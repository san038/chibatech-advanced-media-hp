<?php
/**
 * ACF フィールド定義（コードで登録＝管理画面での手作業不要）。
 * - 研究室（lab）: 教授名・専門・領域・キーワード・説明・URL・主要研究3件
 * - サイトコンテンツ（オプションページ）: カリキュラム/キャリアの構造データを JSON で保持
 *
 * 必要プラグイン: Advanced Custom Fields（主要研究のくり返しに ACF PRO 推奨）。
 */
if (!defined('ABSPATH')) {
    exit;
}

add_action('acf/init', function (): void {
    if (!function_exists('acf_add_local_field_group')) {
        return;
    }

    // オプションページ「サイトコンテンツ」
    if (function_exists('acf_add_options_page')) {
        acf_add_options_page([
            'page_title' => 'サイトコンテンツ',
            'menu_title' => 'サイトコンテンツ',
            'menu_slug'  => 'cimd-content',
            'capability' => 'edit_theme_options',
            'icon_url'   => 'dashicons-admin-customizer',
            'position'   => 3,
        ]);
    }

    // ---- 研究室 ----
    $topic_sub = [
        [
            'key'   => 'field_lab_topic_title',
            'label' => '見出し',
            'name'  => 'title',
            'type'  => 'text',
        ],
        [
            'key'   => 'field_lab_topic_desc',
            'label' => '説明',
            'name'  => 'desc',
            'type'  => 'textarea',
            'rows'  => 3,
        ],
        [
            'key'   => 'field_lab_topic_url',
            'label' => 'リンク（任意）',
            'name'  => 'url',
            'type'  => 'url',
        ],
    ];

    acf_add_local_field_group([
        'key'      => 'group_lab',
        'title'    => '研究室の情報',
        'location' => [[['param' => 'post_type', 'operator' => '==', 'value' => 'lab']]],
        'fields'   => [
            [
                'key'          => 'field_lab_professor',
                'label'        => '教授名（「教授」まで含む）',
                'name'         => 'professor',
                'type'         => 'text',
                'instructions' => '例: 今野 将 教授',
            ],
            [
                'key'   => 'field_lab_focus',
                'label' => '専門・テーマ（1行）',
                'name'  => 'focus',
                'type'  => 'text',
            ],
            [
                'key'     => 'field_lab_pillar',
                'label'   => '専門領域',
                'name'    => 'pillar',
                'type'    => 'select',
                'choices' => [
                    'media'     => 'メディア工学',
                    'knowledge' => '知識工学',
                    'design'    => '情報デザイン',
                ],
            ],
            [
                'key'          => 'field_lab_keywords',
                'label'        => 'キーワード（1行に1つ）',
                'name'         => 'keywords',
                'type'         => 'textarea',
                'rows'         => 5,
                'instructions' => '改行区切り',
            ],
            [
                'key'   => 'field_lab_theme',
                'label' => '研究内容の説明',
                'name'  => 'theme',
                'type'  => 'textarea',
                'rows'  => 6,
            ],
            [
                'key'   => 'field_lab_seminar_url',
                'label' => '研究室ウェブサイト URL',
                'name'  => 'seminar_url',
                'type'  => 'url',
            ],
            [
                'key'        => 'field_lab_topics',
                'label'      => '主要研究（3件推奨）',
                'name'       => 'topics',
                'type'       => 'repeater',
                'layout'     => 'block',
                'button_label' => '主要研究を追加',
                'sub_fields' => $topic_sub,
            ],
        ],
    ]);

    // ---- サイトコンテンツ（構造データは JSON textarea） ----
    acf_add_local_field_group([
        'key'      => 'group_cimd_content',
        'title'    => '構造データ（JSON）',
        'location' => [[['param' => 'options_page', 'operator' => '==', 'value' => 'cimd-content']]],
        'fields'   => [
            [
                'key'          => 'field_cimd_curriculum_json',
                'label'        => 'カリキュラム（JSON: CurriculumYear[]）',
                'name'         => 'curriculum_json',
                'type'         => 'textarea',
                'rows'         => 12,
                'instructions' => '空なら SPA 同梱のデフォルトを使用。seed で初期投入されます。',
            ],
            [
                'key'   => 'field_cimd_career_paths_json',
                'label' => 'キャリアパス（JSON: CareerItem[]）',
                'name'  => 'career_paths_json',
                'type'  => 'textarea',
                'rows'  => 10,
            ],
            [
                'key'   => 'field_cimd_industry_json',
                'label' => '就職先の業界分布（JSON）',
                'name'  => 'industry_json',
                'type'  => 'textarea',
                'rows'  => 6,
            ],
            [
                'key'   => 'field_cimd_key_stats_json',
                'label' => '主要数値（JSON）',
                'name'  => 'key_stats_json',
                'type'  => 'textarea',
                'rows'  => 6,
            ],
        ],
    ]);
});
