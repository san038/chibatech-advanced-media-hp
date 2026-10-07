<?php
/**
 * SPA シェル。すべてのフロント表示でこのテンプレートを使う。
 * クローラ向けにリクエストパスへ応じた <title> / description を出力する。
 */
if (!defined('ABSPATH')) {
    exit;
}

/** ルートごとの SEO メタ（SPA 側 useSeoMeta と対応） */
$cimd_routes = [
    '/' => [
        'title' => '知能メディア工学科 | 千葉工業大学',
        'desc'  => 'まだないコミュニケーションを、つくる。音・AI・デザインで未来をひらく。千葉工業大学 知能メディア工学科。',
    ],
    '/about' => [
        'title' => '学びの特徴 | 知能メディア工学科 | 千葉工業大学',
        'desc'  => 'メディア工学・知識工学・情報デザインの3つの柱を横断する知能メディア工学科の学びの特徴をご紹介します。',
    ],
    '/curriculum' => [
        'title' => 'カリキュラム | 知能メディア工学科 | 千葉工業大学',
        'desc'  => '4年間の学びのステップ。専門基礎・専門基幹・専門展開科目を、年次ごとにご紹介します。',
    ],
    '/skills' => [
        'title' => '身につく力 | 知能メディア工学科 | 千葉工業大学',
        'desc'  => '卒業時にあなたは何者になっているか。6つの力の視点から知能メディア工学科の学びを捉えます。',
    ],
    '/laboratories' => [
        'title' => '研究室 | 知能メディア工学科 | 千葉工業大学',
        'desc'  => '知能メディア工学科の9つの研究室を紹介します。メディア工学・知識工学・情報デザインの最先端研究。',
    ],
    '/career' => [
        'title' => 'キャリア・就職 | 知能メディア工学科 | 千葉工業大学',
        'desc'  => '知能メディア工学科卒業生のキャリアパス・就職先・大学院進学実績をご紹介します。',
    ],
    '/news' => [
        'title' => 'ニュース | 知能メディア工学科 | 千葉工業大学',
        'desc'  => '知能メディア工学科の活動・研究・イベント情報をお届けします。',
    ],
    '/articles' => [
        'title' => '記事 | 知能メディア工学科 | 千葉工業大学',
        'desc'  => '知能メディア工学科の教員・学生へのインタビューや研究紹介の記事をお届けします。',
    ],
];

$cimd_path = wp_parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$cimd_base = trim((string) wp_parse_url(home_url('/'), PHP_URL_PATH), '/');
if ($cimd_base !== '') {
    $cimd_path = preg_replace('#^/' . preg_quote($cimd_base, '#') . '#', '', $cimd_path);
}
$cimd_path = '/' . trim((string) $cimd_path, '/');
$cimd_meta = $cimd_routes[$cimd_path] ?? $cimd_routes['/'];

// /news/{slug} は投稿から動的にメタを組み立てる（クローラ・SNS シェア向け）
if (preg_match('#^/news/([^/]+)$#', $cimd_path, $cimd_m)) {
    $cimd_post = get_page_by_path(sanitize_title(rawurldecode($cimd_m[1])), OBJECT, 'post');
    if ($cimd_post instanceof WP_Post && $cimd_post->post_status === 'publish') {
        $cimd_excerpt = has_excerpt($cimd_post)
            ? $cimd_post->post_excerpt
            : wp_trim_words(wp_strip_all_tags(strip_shortcodes($cimd_post->post_content)), 60, '…');
        $cimd_meta = [
            'title' => get_the_title($cimd_post) . ' | ニュース | 知能メディア工学科 | 千葉工業大学',
            'desc'  => $cimd_excerpt,
        ];
    } else {
        $cimd_meta = $cimd_routes['/news'];
    }
}
?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo('charset'); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title><?php echo esc_html($cimd_meta['title']); ?></title>
<meta name="description" content="<?php echo esc_attr($cimd_meta['desc']); ?>">
<meta property="og:title" content="<?php echo esc_attr($cimd_meta['title']); ?>">
<meta property="og:description" content="<?php echo esc_attr($cimd_meta['desc']); ?>">
<meta property="og:type" content="website">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap">
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<div id="app"></div>
<?php wp_footer(); ?>
</body>
</html>
