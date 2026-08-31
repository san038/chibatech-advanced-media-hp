<?php
/**
 * REST エンドポイント。
 *
 *   GET /wp-json/cimd/v1/news
 *     note RSS を取得・整形して NoteArticle[] を返す。
 *     - scripts/build-note-data.mjs / utils/mapNoteRssItem.ts と同じ形に揃える。
 *     - 1 時間 transient キャッシュ。取得失敗時は直近の成功結果へフォールバック。
 */
if (!defined('ABSPATH')) {
    exit;
}

const CIMD_NOTE_RSS_URL   = 'https://note.com/sannnomiya/rss';
const CIMD_NEWS_TRANSIENT = 'cimd_news_articles';
const CIMD_NEWS_LASTGOOD  = 'cimd_news_articles_lastgood';
const CIMD_NEWS_TTL       = HOUR_IN_SECONDS;
const CIMD_NEWS_LIMIT     = 20;

add_action('rest_api_init', function (): void {
    register_rest_route('cimd/v1', '/news', [
        'methods'             => 'GET',
        'permission_callback' => '__return_true',
        'callback'            => 'cimd_rest_news',
    ]);
});

/**
 * @return WP_REST_Response
 */
function cimd_rest_news()
{
    $cached = get_transient(CIMD_NEWS_TRANSIENT);
    if (is_array($cached)) {
        return new WP_REST_Response($cached, 200);
    }

    $articles = cimd_fetch_note_articles();
    if ($articles === null) {
        // 取得・整形に失敗。直近の成功結果があればそれを返す。
        $lastgood = get_option(CIMD_NEWS_LASTGOOD);
        return new WP_REST_Response(is_array($lastgood) ? $lastgood : [], 200);
    }

    set_transient(CIMD_NEWS_TRANSIENT, $articles, CIMD_NEWS_TTL);
    update_option(CIMD_NEWS_LASTGOOD, $articles, false);
    return new WP_REST_Response($articles, 200);
}

/**
 * note RSS を取得して NoteArticle[] へ整形。失敗時は null。
 *
 * @return array<int, array<string, mixed>>|null
 */
function cimd_fetch_note_articles(): ?array
{
    $res = wp_remote_get(CIMD_NOTE_RSS_URL, [
        'timeout' => 8,
        'headers' => [
            'User-Agent' => 'Mozilla/5.0 (compatible; ChitechIME/1.0)',
            'Accept'     => 'application/rss+xml, application/xml, text/xml',
        ],
    ]);
    if (is_wp_error($res) || wp_remote_retrieve_response_code($res) !== 200) {
        return null;
    }

    $body = wp_remote_retrieve_body($res);
    if ($body === '') {
        return null;
    }

    $prev = libxml_use_internal_errors(true);
    $xml  = simplexml_load_string($body);
    libxml_use_internal_errors($prev);
    if ($xml === false || !isset($xml->channel->item)) {
        return null;
    }

    $articles = [];
    foreach ($xml->channel->item as $item) {
        $articles[] = cimd_map_rss_item($item);
        if (count($articles) >= CIMD_NEWS_LIMIT) {
            break;
        }
    }
    return $articles;
}

/**
 * RSS item 1 件 → NoteArticle。
 *
 * @param SimpleXMLElement $item
 * @return array<string, mixed>
 */
function cimd_map_rss_item(SimpleXMLElement $item): array
{
    $description = trim((string) $item->description);

    $article = [
        'title'   => trim((string) $item->title),
        'link'    => trim((string) $item->link),
        'pubDate' => trim((string) $item->pubDate),
    ];

    if ($description !== '') {
        $plain = trim(wp_strip_all_tags($description));
        if ($plain !== '') {
            $article['description'] = mb_substr($plain, 0, 160);
        }
    }

    $image = cimd_pick_note_image($item, $description);
    if ($image !== null) {
        $article['imageUrl'] = $image;
    }

    return $article;
}

/**
 * 表示用画像 URL の推定。
 * 優先: media:thumbnail → description 内の最初の <img src> → note:creatorImage
 */
function cimd_pick_note_image(SimpleXMLElement $item, string $description): ?string
{
    $media = $item->children('media', true);
    if (isset($media->thumbnail)) {
        $thumb = trim((string) $media->thumbnail);
        if ($thumb === '') {
            $attr  = $media->thumbnail->attributes();
            $thumb = isset($attr['url']) ? trim((string) $attr['url']) : '';
        }
        if ($thumb !== '') {
            return $thumb;
        }
    }

    if ($description !== '' && preg_match('/<img[^>]+src=["\']([^"\']+)["\']/i', $description, $m)) {
        $src = trim($m[1]);
        if ($src !== '') {
            return $src;
        }
    }

    $note = $item->children('note', true);
    if (isset($note->creatorImage)) {
        $creator = trim((string) $note->creatorImage);
        if ($creator !== '') {
            return $creator;
        }
    }

    return null;
}
