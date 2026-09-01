<?php
/**
 * REST エンドポイント（ニュース = WordPress 標準投稿）。
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
