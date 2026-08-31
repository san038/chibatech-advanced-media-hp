<?php
/**
 * 千葉工業大学 知能メディア工学科 テーマ
 * Vite でビルドした SPA（dist/）を配信するだけの薄いテーマ。
 *
 * デプロイ手順（ローカル）:
 *   1. npm run build:theme      … dist を theme/chibatech-imd/dist に出力
 *   2. theme/chibatech-imd/ を wp-content/themes/ にアップロード
 *   3. 管理画面でテーマを有効化
 */

if (!defined('ABSPATH')) {
    exit;
}

define('CIMD_THEME_DIR', get_template_directory());
define('CIMD_THEME_URI', get_template_directory_uri());

/* -------------------------------------------------------------------------
 * 分割ファイルの読み込み
 *   - inc/cpt.php     … カスタム投稿タイプ（研究室）
 *   - inc/acf.php     … ACF フィールド定義
 *   - inc/content.php … SPA へ渡す content ペイロードの組み立て
 *   - inc/rest.php    … REST エンドポイント（cimd/v1/news）
 * ---------------------------------------------------------------------- */
require_once CIMD_THEME_DIR . '/inc/cpt.php';
require_once CIMD_THEME_DIR . '/inc/acf.php';
require_once CIMD_THEME_DIR . '/inc/content.php';
require_once CIMD_THEME_DIR . '/inc/rest.php';

/* -------------------------------------------------------------------------
 * SPA アセットの読み込み（Vite manifest からハッシュ名を解決）
 * ---------------------------------------------------------------------- */
function cimd_read_manifest(): ?array
{
    $path = CIMD_THEME_DIR . '/dist/.vite/manifest.json';
    if (!file_exists($path)) {
        return null;
    }
    $json = json_decode((string) file_get_contents($path), true);
    return is_array($json) ? $json : null;
}

function cimd_router_base(): string
{
    $p = wp_parse_url(home_url('/'), PHP_URL_PATH);
    $p = is_string($p) ? trim($p, '/') : '';
    return $p === '' ? '/' : '/' . $p . '/';
}

function cimd_enqueue_assets(): void
{
    $manifest = cimd_read_manifest();
    if (!$manifest || empty($manifest['index.html'])) {
        return;
    }
    $entry    = $manifest['index.html'];
    $dist_uri = CIMD_THEME_URI . '/dist/';

    // エントリの CSS
    foreach (($entry['css'] ?? []) as $i => $css) {
        wp_enqueue_style('cimd-app-' . $i, $dist_uri . $css, [], null);
    }

    // 静的 import チャンクの CSS（route チャンク等）
    foreach (($entry['imports'] ?? []) as $chunk_key) {
        foreach (($manifest[$chunk_key]['css'] ?? []) as $j => $css) {
            wp_enqueue_style('cimd-chunk-' . md5($chunk_key) . '-' . $j, $dist_uri . $css, [], null);
        }
    }

    // エントリ JS（type="module" は script_loader_tag で付与）
    wp_enqueue_script('cimd-app', $dist_uri . $entry['file'], [], null, true);

    // SPA へ渡すデータ
    $site_data = [
        'assetsBase'   => $dist_uri,
        'routerBase'   => cimd_router_base(),
        'newsEndpoint' => esc_url_raw(rest_url('cimd/v1/news')),
        'restBase'     => esc_url_raw(rest_url('cimd/v1/')),
        'restNonce'    => wp_create_nonce('wp_rest'),
        // 未設定/空のキーは SPA 同梱デフォルトにフォールバックする（useContent.ts）
        'content'      => cimd_site_content(),
    ];
    wp_add_inline_script(
        'cimd-app',
        'window.__SITE_DATA__=' . wp_json_encode($site_data) . ';',
        'before'
    );

    // 管理バー分のヘッダーずれ補正（ログイン中のみ）
    if (is_admin_bar_showing()) {
        wp_register_style('cimd-wp', false);
        wp_enqueue_style('cimd-wp');
        wp_add_inline_style(
            'cimd-wp',
            '@media(min-width:783px){body.admin-bar .header{top:32px}}' .
            '@media(max-width:782px){body.admin-bar .header{top:46px}}'
        );
    }
}
add_action('wp_enqueue_scripts', 'cimd_enqueue_assets');

/* エントリスクリプトを ES module として出力 + preload */
function cimd_script_tag(string $tag, string $handle, string $src): string
{
    if ($handle !== 'cimd-app') {
        return $tag;
    }
    $preload = '';
    $manifest = cimd_read_manifest();
    if ($manifest && !empty($manifest['index.html']['imports'])) {
        foreach ($manifest['index.html']['imports'] as $chunk_key) {
            if (!empty($manifest[$chunk_key]['file'])) {
                $preload .= '<link rel="modulepreload" href="'
                    . esc_url(CIMD_THEME_URI . '/dist/' . $manifest[$chunk_key]['file'])
                    . '">' . "\n";
            }
        }
    }
    return $preload . '<script type="module" src="' . esc_url($src) . '"></script>' . "\n";
}
add_filter('script_loader_tag', 'cimd_script_tag', 10, 3);

/* -------------------------------------------------------------------------
 * SPA ルーティング: WP で解決できない URL は SPA シェルを 200 で返す
 * ---------------------------------------------------------------------- */
function cimd_spa_fallback(): void
{
    if (is_404()) {
        status_header(200);
        nocache_headers();
        require CIMD_THEME_DIR . '/index.php';
        exit;
    }
}
add_action('template_redirect', 'cimd_spa_fallback');

/* -------------------------------------------------------------------------
 * 出力を軽く（ブロックエディタCSS・絵文字など不要物を外す）
 * ---------------------------------------------------------------------- */
function cimd_trim_head(): void
{
    remove_action('wp_head', 'print_emoji_detection_script', 7);
    remove_action('wp_print_styles', 'print_emoji_styles');
    remove_action('admin_print_scripts', 'print_emoji_detection_script');
    remove_action('admin_print_styles', 'print_emoji_styles');
    remove_action('wp_head', 'wp_generator');
    remove_action('wp_head', 'rsd_link');
    remove_action('wp_head', 'wlwmanifest_link');
    remove_action('wp_head', 'wp_shortlink_wp_head');
}
add_action('init', 'cimd_trim_head');

function cimd_dequeue_block_css(): void
{
    wp_dequeue_style('wp-block-library');
    wp_dequeue_style('wp-block-library-theme');
    wp_dequeue_style('global-styles');
    wp_dequeue_style('classic-theme-styles');
}
add_action('wp_enqueue_scripts', 'cimd_dequeue_block_css', 100);

/* -------------------------------------------------------------------------
 * テーマサポート
 * ---------------------------------------------------------------------- */
function cimd_theme_supports(): void
{
    // title は index.php が自前で出力するため title-tag は付けない
    add_theme_support('automatic-feed-links');
    add_theme_support('html5', ['style', 'script']);
}
add_action('after_setup_theme', 'cimd_theme_supports');
