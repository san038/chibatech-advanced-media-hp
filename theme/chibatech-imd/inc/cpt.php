<?php
/**
 * カスタム投稿タイプ: 研究室（lab）
 * タイトル = 研究室名、抜粋やフィールドは ACF（inc/acf.php）。
 */
if (!defined('ABSPATH')) {
    exit;
}

add_action('init', function (): void {
    register_post_type('lab', [
        'labels' => [
            'name'          => '研究室',
            'singular_name' => '研究室',
            'add_new_item'  => '研究室を追加',
            'edit_item'     => '研究室を編集',
            'menu_name'     => '研究室',
        ],
        'public'        => true,
        'show_in_rest'  => true,
        'menu_icon'     => 'dashicons-welcome-learn-more',
        'menu_position' => 5,
        'has_archive'   => false,
        'rewrite'       => ['slug' => 'lab', 'with_front' => false],
        'supports'      => ['title', 'thumbnail', 'page-attributes'],
    ]);
});
