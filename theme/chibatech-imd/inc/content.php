<?php
/**
 * SPA へ渡す content ペイロードの組み立て。
 *
 * functions.php が `window.__SITE_DATA__.content` として出力し、
 * SPA 側 composables/useContent.ts が「キー未設定 or 空配列なら同梱デフォルト」で
 * フォールバックする。したがってここでは「値があるものだけ」を詰めればよい。
 *
 * - labs          : 研究室 CPT（lab）→ types.ts の Laboratory[]
 * - curriculum    : 管理画面「サイトコンテンツ」の JSON textarea（CurriculumYear[]）
 * - careerPaths   : 同上（CareerItem[]）
 * - industryStats : 同上（{ label, percentage }[]）
 * - keyStats      : 同上（{ value, label }[]）
 * - heroKeywords  : 同ページのテキスト（1 行 = "語 : media, knowledge"）
 * - courseKeywords: 同ページの領域別テキスト（1 行 1 語）
 *
 * JSON/テキストは inc/site-content-admin.php が wp_options に保存する
 * （ACF 非依存）。研究室 CPT のフィールドのみ ACF（inc/acf.php）を使う。
 */
if (!defined('ABSPATH')) {
    exit;
}

/**
 * 改行区切りのテキストエリアを配列へ。空行は捨てる。
 *
 * @return string[]
 */
function cimd_lines_to_array($raw): array
{
    if (!is_string($raw) || $raw === '') {
        return [];
    }
    $lines = preg_split('/\r\n|\r|\n/', $raw) ?: [];
    $lines = array_map('trim', $lines);
    return array_values(array_filter($lines, static fn ($l) => $l !== ''));
}

/**
 * ヒーローキーワードのテキスト（1 行 = "語 : media, knowledge"）を配列へ。
 * 領域指定が無い行は 3 領域すべてに割り当てる。
 *
 * @return array<int, array{text: string, domains: string[]}>
 */
function cimd_parse_hero_keywords($raw): array
{
    if (!is_string($raw) || trim($raw) === '') {
        return [];
    }
    $valid = ['media', 'knowledge', 'design'];
    $out = [];
    foreach (preg_split('/\r\n|\r|\n/', $raw) ?: [] as $line) {
        $line = trim($line);
        if ($line === '') {
            continue;
        }
        $parts = explode(':', $line, 2);
        $text  = trim($parts[0]);
        if ($text === '') {
            continue;
        }
        $domains = [];
        if (isset($parts[1])) {
            foreach (explode(',', $parts[1]) as $d) {
                $d = trim($d);
                if (in_array($d, $valid, true) && !in_array($d, $domains, true)) {
                    $domains[] = $d;
                }
            }
        }
        $out[] = ['text' => $text, 'domains' => $domains === [] ? $valid : $domains];
    }

    return $out;
}

/**
 * wp_options に保存された JSON textarea をデコード。
 * 妥当な「非空の配列」のときだけ返す。それ以外は null（＝デフォルトへフォールバック）。
 */
function cimd_decode_json_option(string $option_name): ?array
{
    $raw = get_option($option_name, '');
    if (!is_string($raw) || trim($raw) === '') {
        return null;
    }
    $decoded = json_decode($raw, true);
    if (!is_array($decoded) || $decoded === []) {
        return null;
    }
    return $decoded;
}

/**
 * 研究室 CPT を Laboratory[] へ。ACF 未導入・投稿ゼロなら空配列。
 *
 * @return array<int, array<string, mixed>>
 */
function cimd_labs_payload(): array
{
    if (!function_exists('get_field') || !post_type_exists('lab')) {
        return [];
    }

    $posts = get_posts([
        'post_type'        => 'lab',
        'post_status'      => 'publish',
        'numberposts'      => -1,
        'orderby'          => ['menu_order' => 'ASC', 'date' => 'ASC'],
        'suppress_filters' => false,
    ]);

    $labs = [];
    foreach ($posts as $post) {
        $pillar = (string) get_field('pillar', $post->ID);
        if (!in_array($pillar, ['media', 'knowledge', 'design'], true)) {
            $pillar = 'media';
        }

        $topics = [];
        $rows = get_field('topics', $post->ID);
        if (is_array($rows)) {
            foreach ($rows as $row) {
                $title = trim((string) ($row['title'] ?? ''));
                $desc  = trim((string) ($row['desc'] ?? ''));
                if ($title === '' && $desc === '') {
                    continue;
                }
                $topic = ['title' => $title, 'desc' => $desc];
                $url = trim((string) ($row['url'] ?? ''));
                if ($url !== '') {
                    $topic['url'] = $url;
                }
                $topics[] = $topic;
            }
        }

        $thumb = get_the_post_thumbnail_url($post->ID, 'large');

        $labs[] = [
            'id'         => $post->post_name,
            'name'       => get_the_title($post),
            'professor'  => (string) get_field('professor', $post->ID),
            'focus'      => (string) get_field('focus', $post->ID),
            'theme'      => (string) get_field('theme', $post->ID),
            'pillar'     => $pillar,
            'keywords'   => cimd_lines_to_array(get_field('keywords', $post->ID)),
            'seminarUrl' => (string) get_field('seminar_url', $post->ID),
            'imageSrc'   => $thumb ?: null,
            'topics'     => $topics,
        ];
    }

    return $labs;
}

/**
 * SPA へ渡す content 全体。値のないキーは含めない。
 *
 * @return array<string, mixed>
 */
function cimd_site_content(): array
{
    $content = [];

    $labs = cimd_labs_payload();
    if ($labs !== []) {
        $content['labs'] = $labs;
    }

    $map = [
        'curriculum'    => 'cimd_curriculum_json',
        'careerPaths'   => 'cimd_career_paths_json',
        'industryStats' => 'cimd_industry_json',
        'keyStats'      => 'cimd_key_stats_json',
    ];
    foreach ($map as $key => $option_name) {
        $decoded = cimd_decode_json_option($option_name);
        if ($decoded !== null) {
            $content[$key] = $decoded;
        }
    }

    $hero = cimd_parse_hero_keywords((string) get_option('cimd_hero_keywords', ''));
    if ($hero !== []) {
        $content['heroKeywords'] = $hero;
    }

    $courses = [];
    foreach (['media', 'knowledge', 'design'] as $domain) {
        $kw = cimd_lines_to_array(get_option('cimd_course_keywords_' . $domain, ''));
        if ($kw !== []) {
            $courses[$domain] = $kw;
        }
    }
    if ($courses !== []) {
        $content['courseKeywords'] = $courses;
    }

    return $content;
}
