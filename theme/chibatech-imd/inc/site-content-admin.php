<?php
/**
 * 管理画面「サイトコンテンツ」— WP コア Settings API のみ（ACF 非依存）。
 *
 * 1) 構造データ（JSON）: カリキュラム／キャリアパス／業界分布／主要数値
 * 2) キーワード（テキスト）: トップの図（ヒーロー背景）／コース紹介
 *
 * いずれも wp_options に保存し、inc/content.php が get_option() で読む。
 * 空欄にすると SPA 同梱のデフォルト表示に戻る。
 */
if (!defined('ABSPATH')) {
    exit;
}

const CIMD_CONTENT_OPTION_GROUP = 'cimd_site_content';
const CIMD_CONTENT_MENU_SLUG    = 'cimd-content';

/**
 * JSON textarea: option 名 => 画面ラベル。
 *
 * @return array<string, string>
 */
function cimd_content_fields(): array
{
    return [
        'cimd_curriculum_json'   => 'カリキュラム（JSON: CurriculumYear[]）',
        'cimd_career_paths_json' => 'キャリアパス（JSON: CareerItem[]）',
        'cimd_industry_json'     => '就職先の業界分布（JSON: { label, percentage }[]）',
        'cimd_key_stats_json'    => '主要数値（JSON: { value, label }[]）',
    ];
}

/**
 * キーワード textarea: option 名 => [ラベル, 補足, 行数]。
 *
 * @return array<string, array{0:string,1:string,2:int}>
 */
function cimd_keyword_fields(): array
{
    return [
        'cimd_hero_keywords' => [
            'トップの図：浮遊キーワード',
            '1 行に 1 語。「 語 : 領域 」の形式で領域（media / knowledge / design）を'
                . ' カンマ区切り指定。領域を省略すると 3 領域すべてに配置します。'
                . '（例）AR（拡張現実） : media, knowledge',
            16,
        ],
        'cimd_course_keywords_media' => [
            'コース紹介：メディア工学のキーワード',
            '1 行に 1 語。',
            6,
        ],
        'cimd_course_keywords_knowledge' => [
            'コース紹介：知識工学のキーワード',
            '1 行に 1 語。',
            6,
        ],
        'cimd_course_keywords_design' => [
            'コース紹介：情報デザインのキーワード',
            '1 行に 1 語。',
            6,
        ],
    ];
}

/* ---- 既定値（SPA コンポーネントのデフォルトと一致させること） ------------- */

function cimd_hero_keywords_default(): string
{
    return implode("\n", [
        '３D音響 : media',
        '歌声合成 : media',
        'バーチャルリアリティ : media',
        'ビッグデータ : knowledge',
        '人工知能 : knowledge',
        '機械学習 : knowledge',
        'ディープラーニング : knowledge',
        'テクノロジーアート : design',
        'ビジュアライゼーション : design',
        'コミュニケーションデザイン : design',
        'AR（拡張現実） : media, knowledge',
        '画像認識 : media, knowledge',
        'サウンドデザイン : media, design',
        'データ可視化 : media, knowledge, design',
    ]);
}

/** @return array<string, string> domain => 改行区切りキーワード */
function cimd_course_keywords_default(): array
{
    return [
        'media'     => implode("\n", ['音響信号処理', '映像メディア', 'XR・仮想現実', 'センサーシステム']),
        'knowledge' => implode("\n", ['機械学習・深層学習', '自然言語処理', '知識グラフ', '推薦システム']),
        'design'    => implode("\n", ['UX/UIデザイン', 'データ可視化', 'タイポグラフィ', 'コミュニケーション設計']),
    ];
}

/** 未設定のキーワード option に既定値を投入（テーマ有効化時 / 手動実行用）。 */
function cimd_seed_keyword_defaults(): void
{
    if ((string) get_option('cimd_hero_keywords', '') === '') {
        update_option('cimd_hero_keywords', cimd_hero_keywords_default());
    }
    foreach (cimd_course_keywords_default() as $domain => $value) {
        $name = 'cimd_course_keywords_' . $domain;
        if ((string) get_option($name, '') === '') {
            update_option($name, $value);
        }
    }
}
add_action('after_switch_theme', 'cimd_seed_keyword_defaults');

/* ---- メニュー / 設定登録 ------------------------------------------------- */

add_action('admin_menu', static function (): void {
    add_menu_page(
        'サイトコンテンツ',
        'サイトコンテンツ',
        'edit_theme_options',
        CIMD_CONTENT_MENU_SLUG,
        'cimd_content_render_page',
        'dashicons-admin-customizer',
        3
    );
});

add_action('admin_init', static function (): void {
    foreach (array_keys(cimd_content_fields()) as $name) {
        register_setting(CIMD_CONTENT_OPTION_GROUP, $name, [
            'type'              => 'string',
            // option 名をクロージャで束縛（WP バージョン差でフィルタ引数数が変わるため）
            'sanitize_callback' => static fn ($value) => cimd_content_sanitize_json($value, $name),
            'default'           => '',
            'show_in_rest'      => false,
        ]);
    }
    foreach (array_keys(cimd_keyword_fields()) as $name) {
        register_setting(CIMD_CONTENT_OPTION_GROUP, $name, [
            'type'              => 'string',
            'sanitize_callback' => 'sanitize_textarea_field',
            'default'           => '',
            'show_in_rest'      => false,
        ]);
    }
});

/**
 * JSON textarea のサニタイズ。空文字は許可。非空なら妥当性を検証し、
 * 壊れていれば前回値を維持する。
 *
 * @param mixed  $value
 * @param string $option_name
 * @return string
 */
function cimd_content_sanitize_json($value, string $option_name = ''): string
{
    $raw = is_string($value) ? trim($value) : '';
    if ($raw === '') {
        return '';
    }

    json_decode($raw);
    if (json_last_error() !== JSON_ERROR_NONE) {
        add_settings_error(
            CIMD_CONTENT_OPTION_GROUP,
            'cimd_invalid_json_' . $option_name,
            sprintf(
                '「%s」は JSON 構文エラーのため保存しませんでした（%s）。',
                cimd_content_fields()[$option_name] ?? $option_name,
                json_last_error_msg()
            )
        );
        $previous = $option_name !== '' ? get_option($option_name, '') : '';
        return is_string($previous) ? $previous : '';
    }

    return $raw;
}

/* ---- 描画 ------------------------------------------------------------- */

function cimd_content_render_page(): void
{
    if (!current_user_can('edit_theme_options')) {
        return;
    }
    ?>
    <div class="wrap">
        <h1>サイトコンテンツ</h1>
        <p>
            各項目は SPA の表示内容を上書きします。
            <strong>空欄にすると SPA 同梱のデフォルト表示に戻ります</strong>（現状維持）。
        </p>
        <?php settings_errors(CIMD_CONTENT_OPTION_GROUP); ?>
        <form method="post" action="options.php">
            <?php settings_fields(CIMD_CONTENT_OPTION_GROUP); ?>

            <h2>構造データ（JSON）</h2>
            <p class="description">保存時に JSON 構文を検証し、壊れている場合は前回値を維持します。</p>
            <table class="form-table" role="presentation">
                <tbody>
                <?php foreach (cimd_content_fields() as $name => $label) :
                    $val = get_option($name, ''); ?>
                    <tr>
                        <th scope="row">
                            <label for="<?php echo esc_attr($name); ?>"><?php echo esc_html($label); ?></label>
                        </th>
                        <td>
                            <textarea
                                id="<?php echo esc_attr($name); ?>"
                                name="<?php echo esc_attr($name); ?>"
                                rows="12"
                                class="large-text code"
                                spellcheck="false"
                            ><?php echo esc_textarea(is_string($val) ? $val : ''); ?></textarea>
                        </td>
                    </tr>
                <?php endforeach; ?>
                </tbody>
            </table>

            <h2>キーワード</h2>
            <table class="form-table" role="presentation">
                <tbody>
                <?php foreach (cimd_keyword_fields() as $name => $meta) :
                    [$label, $help, $rows] = $meta;
                    $val = get_option($name, ''); ?>
                    <tr>
                        <th scope="row">
                            <label for="<?php echo esc_attr($name); ?>"><?php echo esc_html($label); ?></label>
                        </th>
                        <td>
                            <textarea
                                id="<?php echo esc_attr($name); ?>"
                                name="<?php echo esc_attr($name); ?>"
                                rows="<?php echo (int) $rows; ?>"
                                class="large-text code"
                                spellcheck="false"
                            ><?php echo esc_textarea(is_string($val) ? $val : ''); ?></textarea>
                            <p class="description"><?php echo esc_html($help); ?></p>
                        </td>
                    </tr>
                <?php endforeach; ?>
                </tbody>
            </table>

            <?php submit_button(); ?>
        </form>
    </div>
    <?php
}
