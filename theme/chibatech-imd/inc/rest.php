<?php
/**
 * REST エンドポイント（ニュース = WordPress 標準投稿 / 記事 = note マガジン RSS）。
 *
 *   GET /wp-json/cimd/v1/news         … 公開投稿の一覧（NewsItem[]）
 *   GET /wp-json/cimd/v1/news/{slug}  … 単一投稿（NewsArticle: 本文 HTML 込み）
 *
 * SPA 側 composables/useNews.ts が消費する。詳細は SPA 内 /news/:slug で表示。
 */
if (!defined('ABSPATH')) {
    exit;
}

const CIMD_NEWS_LIST_LIMIT = 30;

add_action('rest_api_init', function (): void {
    register_rest_route('cimd/v1', '/news', [
        'methods'             => 'GET',
        'permission_callback' => '__return_true',
        'callback'            => 'cimd_rest_news_list',
    ]);
    register_rest_route('cimd/v1', '/news/(?P<slug>[^/]+)', [
        'methods'             => 'GET',
        'permission_callback' => '__return_true',
        'callback'            => 'cimd_rest_news_single',
        'args'                => [
            'slug' => ['sanitize_callback' => 'sanitize_title'],
        ],
    ]);
});

/**
 * @return WP_REST_Response
 */
function cimd_rest_news_list()
{
    $posts = get_posts([
        'post_type'   => 'post',
        'post_status' => 'publish',
        'numberposts' => CIMD_NEWS_LIST_LIMIT,
        'orderby'     => 'date',
        'order'       => 'DESC',
    ]);

    return new WP_REST_Response(array_map('cimd_news_item', $posts), 200);
}

/**
 * @param WP_REST_Request $req
 * @return WP_REST_Response
 */
function cimd_rest_news_single($req)
{
    $slug = (string) $req['slug'];

    $query = new WP_Query([
        'name'                => $slug,
        'post_type'           => 'post',
        'post_status'         => 'publish',
        'posts_per_page'      => 1,
        'ignore_sticky_posts' => true,
        'no_found_rows'       => true,
    ]);

    if (!$query->have_posts()) {
        return new WP_REST_Response(['message' => 'not found'], 404);
    }

    global $post;
    $post = $query->posts[0];
    setup_postdata($post);
    $content = apply_filters('the_content', $post->post_content);
    $item = cimd_news_item($post);
    wp_reset_postdata();

    $item['content']  = $content;
    $item['imageUrl'] = get_the_post_thumbnail_url($post->ID, 'full')
        ?: $item['imageUrl'];

    return new WP_REST_Response($item, 200);
}

/**
 * 投稿 1 件 → NewsItem。
 *
 * @param WP_Post $post
 * @return array<string, mixed>
 */
function cimd_news_item(WP_Post $post): array
{
    $thumb = get_the_post_thumbnail_url($post->ID, 'large');

    return [
        'slug'     => $post->post_name,
        'title'    => get_the_title($post),
        'date'     => get_the_date('c', $post),
        'excerpt'  => cimd_news_excerpt($post),
        'imageUrl' => $thumb ?: null,
    ];
}

/**
 * 抜粋。手動抜粋があればそれを、無ければ本文を整形して先頭 120 文字。
 */
function cimd_news_excerpt(WP_Post $post): string
{
    if (trim($post->post_excerpt) !== '') {
        return trim($post->post_excerpt);
    }
    $text = wp_strip_all_tags(strip_shortcodes($post->post_content));
    $text = trim((string) preg_replace('/\s+/u', ' ', $text));

    return mb_substr($text, 0, 120);
}

/* -------------------------------------------------------------------------
 * 記事 = note マガジンの RSS
 *
 *   GET /wp-json/cimd/v1/articles … ArticleItem[]（公開日の新しい順）
 *
 * マガジン URL は管理画面「サイトコンテンツ」（option: cimd_note_magazine_url）。
 * RSS は transient に CIMD_ARTICLES_CACHE_TTL 秒キャッシュする。取得に失敗した
 * ときは最後に成功した結果（option: cimd_note_articles_last）を返す。
 * ---------------------------------------------------------------------- */

const CIMD_ARTICLES_CACHE_TTL  = 30 * MINUTE_IN_SECONDS;
const CIMD_ARTICLES_LIST_LIMIT = 50;

add_action('rest_api_init', function (): void {
    register_rest_route('cimd/v1', '/articles', [
        'methods'             => 'GET',
        'permission_callback' => '__return_true',
        'callback'            => 'cimd_rest_articles_list',
    ]);
});

/**
 * @return WP_REST_Response
 */
function cimd_rest_articles_list()
{
    $magazine = cimd_note_magazine_url();
    if ($magazine === null) {
        return new WP_REST_Response([], 200);
    }

    $cache_key = 'cimd_note_articles_' . md5($magazine);
    $cached    = get_transient($cache_key);
    if (is_array($cached)) {
        return new WP_REST_Response($cached, 200);
    }

    $items = cimd_fetch_note_articles($magazine . '/rss');
    if (is_wp_error($items)) {
        error_log('[cimd] note RSS の取得に失敗: ' . $items->get_error_message());
        $last = get_option('cimd_note_articles_last');
        $fallback = is_array($last) && ($last['magazine'] ?? '') === $magazine
            ? ($last['items'] ?? [])
            : [];
        // 失敗時も短時間キャッシュして、毎リクエスト note を叩かないようにする
        set_transient($cache_key, $fallback, 5 * MINUTE_IN_SECONDS);
        return new WP_REST_Response($fallback, 200);
    }

    set_transient($cache_key, $items, CIMD_ARTICLES_CACHE_TTL);
    update_option('cimd_note_articles_last', ['magazine' => $magazine, 'items' => $items], false);

    return new WP_REST_Response($items, 200);
}

/**
 * 設定されたマガジン URL を正規化して返す（https://note.com/{user}/m/{key}）。
 * 未設定・不正なら null。
 */
function cimd_note_magazine_url(): ?string
{
    $raw = trim((string) get_option('cimd_note_magazine_url', ''));
    if (preg_match('#^https://note\.com/([A-Za-z0-9_]+)/m/([A-Za-z0-9]+)/?$#', $raw, $m)) {
        return 'https://note.com/' . $m[1] . '/m/' . $m[2];
    }
    return null;
}

/**
 * RSS を取得して ArticleItem[] に変換。
 *
 * @return array<int, array<string, mixed>>|WP_Error
 */
function cimd_fetch_note_articles(string $feed_url)
{
    $res = wp_remote_get($feed_url, ['timeout' => 8]);
    if (is_wp_error($res)) {
        return $res;
    }
    $code = wp_remote_retrieve_response_code($res);
    if ($code !== 200) {
        return new WP_Error('cimd_note_http', sprintf('HTTP %d (%s)', $code, $feed_url));
    }

    $prev = libxml_use_internal_errors(true);
    $xml  = simplexml_load_string(wp_remote_retrieve_body($res), 'SimpleXMLElement', LIBXML_NOCDATA);
    libxml_clear_errors();
    libxml_use_internal_errors($prev);
    if ($xml === false || !isset($xml->channel)) {
        return new WP_Error('cimd_note_parse', 'RSS を解析できません: ' . $feed_url);
    }

    $items = [];
    foreach ($xml->channel->item as $item) {
        $url = (string) $item->link;
        if ($url === '') {
            continue;
        }
        $note  = $item->children('https://note.com');
        $media = $item->children('http://search.yahoo.com/mrss/');
        $time  = strtotime((string) $item->pubDate);
        $thumb = trim((string) $media->thumbnail);

        $items[] = [
            'url'      => esc_url_raw($url),
            'title'    => (string) $item->title,
            'date'     => $time ? gmdate('c', $time) : '',
            'excerpt'  => cimd_note_excerpt((string) $item->description),
            'imageUrl' => $thumb !== '' ? esc_url_raw($thumb) : null,
            'author'   => (string) $note->creatorName,
        ];
    }

    // マガジンの RSS は追加順のため、公開日の新しい順に並べ替える
    usort($items, static fn ($a, $b) => strcmp($b['date'], $a['date']));

    return array_slice($items, 0, CIMD_ARTICLES_LIST_LIMIT);
}

/** RSS の description（HTML + 「続きをみる」リンク）→ 先頭 120 文字のテキスト */
function cimd_note_excerpt(string $html): string
{
    $html = (string) preg_replace('#<a [^>]*>続きをみる</a>#u', '', $html);
    $text = html_entity_decode(wp_strip_all_tags($html), ENT_QUOTES, 'UTF-8');
    $text = trim((string) preg_replace('/\s+/u', ' ', $text));

    return mb_substr($text, 0, 120);
}
