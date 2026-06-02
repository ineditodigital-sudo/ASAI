<?php
/**
 * Theme functions and definitions
 *
 * @package HelloElementor
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

define( 'HELLO_ELEMENTOR_VERSION', '3.4.7' );
define( 'EHP_THEME_SLUG', 'hello-elementor' );

define( 'HELLO_THEME_PATH', get_template_directory() );
define( 'HELLO_THEME_URL', get_template_directory_uri() );
define( 'HELLO_THEME_ASSETS_PATH', HELLO_THEME_PATH . '/assets/' );
define( 'HELLO_THEME_ASSETS_URL', HELLO_THEME_URL . '/assets/' );
define( 'HELLO_THEME_SCRIPTS_PATH', HELLO_THEME_ASSETS_PATH . 'js/' );
define( 'HELLO_THEME_SCRIPTS_URL', HELLO_THEME_ASSETS_URL . 'js/' );
define( 'HELLO_THEME_STYLE_PATH', HELLO_THEME_ASSETS_PATH . 'css/' );
define( 'HELLO_THEME_STYLE_URL', HELLO_THEME_ASSETS_URL . 'css/' );
define( 'HELLO_THEME_IMAGES_PATH', HELLO_THEME_ASSETS_PATH . 'images/' );
define( 'HELLO_THEME_IMAGES_URL', HELLO_THEME_ASSETS_URL . 'images/' );

if ( ! isset( $content_width ) ) {
	$content_width = 800; // Pixels.
}

if ( ! function_exists( 'hello_elementor_setup' ) ) {
	/**
	 * Set up theme support.
	 *
	 * @return void
	 */
	function hello_elementor_setup() {
		if ( is_admin() ) {
			hello_maybe_update_theme_version_in_db();
		}

		if ( apply_filters( 'hello_elementor_register_menus', true ) ) {
			register_nav_menus( [ 'menu-1' => esc_html__( 'Header', 'hello-elementor' ) ] );
			register_nav_menus( [ 'menu-2' => esc_html__( 'Footer', 'hello-elementor' ) ] );
		}

		if ( apply_filters( 'hello_elementor_post_type_support', true ) ) {
			add_post_type_support( 'page', 'excerpt' );
		}

		if ( apply_filters( 'hello_elementor_add_theme_support', true ) ) {
			add_theme_support( 'post-thumbnails' );
			add_theme_support( 'automatic-feed-links' );
			add_theme_support( 'title-tag' );
			add_theme_support(
				'html5',
				[
					'search-form',
					'comment-form',
					'comment-list',
					'gallery',
					'caption',
					'script',
					'style',
					'navigation-widgets',
				]
			);
			add_theme_support(
				'custom-logo',
				[
					'height'      => 100,
					'width'       => 350,
					'flex-height' => true,
					'flex-width'  => true,
				]
			);
			add_theme_support( 'align-wide' );
			add_theme_support( 'responsive-embeds' );

			/*
			 * Editor Styles
			 */
			add_theme_support( 'editor-styles' );
			add_editor_style( 'assets/css/editor-styles.css' );

			/*
			 * WooCommerce.
			 */
			if ( apply_filters( 'hello_elementor_add_woocommerce_support', true ) ) {
				// WooCommerce in general.
				add_theme_support( 'woocommerce' );
				// Enabling WooCommerce product gallery features (are off by default since WC 3.0.0).
				// zoom.
				add_theme_support( 'wc-product-gallery-zoom' );
				// lightbox.
				add_theme_support( 'wc-product-gallery-lightbox' );
				// swipe.
				add_theme_support( 'wc-product-gallery-slider' );
			}
		}
	}
}
add_action( 'after_setup_theme', 'hello_elementor_setup' );

function hello_maybe_update_theme_version_in_db() {
	$theme_version_option_name = 'hello_theme_version';
	// The theme version saved in the database.
	$hello_theme_db_version = get_option( $theme_version_option_name );

	// If the 'hello_theme_version' option does not exist in the DB, or the version needs to be updated, do the update.
	if ( ! $hello_theme_db_version || version_compare( $hello_theme_db_version, HELLO_ELEMENTOR_VERSION, '<' ) ) {
		update_option( $theme_version_option_name, HELLO_ELEMENTOR_VERSION );
	}
}

if ( ! function_exists( 'hello_elementor_display_header_footer' ) ) {
	/**
	 * Check whether to display header footer.
	 *
	 * @return bool
	 */
	function hello_elementor_display_header_footer() {
		$hello_elementor_header_footer = true;

		return apply_filters( 'hello_elementor_header_footer', $hello_elementor_header_footer );
	}
}

if ( ! function_exists( 'hello_elementor_scripts_styles' ) ) {
	/**
	 * Theme Scripts & Styles.
	 *
	 * @return void
	 */
	function hello_elementor_scripts_styles() {
		if ( apply_filters( 'hello_elementor_enqueue_style', true ) ) {
			wp_enqueue_style(
				'hello-elementor',
				HELLO_THEME_STYLE_URL . 'reset.css',
				[],
				HELLO_ELEMENTOR_VERSION
			);
		}

		if ( apply_filters( 'hello_elementor_enqueue_theme_style', true ) ) {
			wp_enqueue_style(
				'hello-elementor-theme-style',
				HELLO_THEME_STYLE_URL . 'theme.css',
				[],
				HELLO_ELEMENTOR_VERSION
			);
		}

		if ( hello_elementor_display_header_footer() ) {
			wp_enqueue_style(
				'hello-elementor-header-footer',
				HELLO_THEME_STYLE_URL . 'header-footer.css',
				[],
				HELLO_ELEMENTOR_VERSION
			);
		}
	}
}
add_action( 'wp_enqueue_scripts', 'hello_elementor_scripts_styles' );

if ( ! function_exists( 'hello_elementor_register_elementor_locations' ) ) {
	/**
	 * Register Elementor Locations.
	 *
	 * @param ElementorPro\Modules\ThemeBuilder\Classes\Locations_Manager $elementor_theme_manager theme manager.
	 *
	 * @return void
	 */
	function hello_elementor_register_elementor_locations( $elementor_theme_manager ) {
		if ( apply_filters( 'hello_elementor_register_elementor_locations', true ) ) {
			$elementor_theme_manager->register_all_core_location();
		}
	}
}
add_action( 'elementor/theme/register_locations', 'hello_elementor_register_elementor_locations' );

if ( ! function_exists( 'hello_elementor_content_width' ) ) {
	/**
	 * Set default content width.
	 *
	 * @return void
	 */
	function hello_elementor_content_width() {
		$GLOBALS['content_width'] = apply_filters( 'hello_elementor_content_width', 800 );
	}
}
add_action( 'after_setup_theme', 'hello_elementor_content_width', 0 );

if ( ! function_exists( 'hello_elementor_add_description_meta_tag' ) ) {
	/**
	 * Add description meta tag with excerpt text.
	 *
	 * @return void
	 */
	function hello_elementor_add_description_meta_tag() {
		if ( ! apply_filters( 'hello_elementor_description_meta_tag', true ) ) {
			return;
		}

		if ( ! is_singular() ) {
			return;
		}

		$post = get_queried_object();
		if ( empty( $post->post_excerpt ) ) {
			return;
		}

		echo '<meta name="description" content="' . esc_attr( wp_strip_all_tags( $post->post_excerpt ) ) . '">' . "\n";
	}
}
add_action( 'wp_head', 'hello_elementor_add_description_meta_tag' );

// Settings page
require get_template_directory() . '/includes/settings-functions.php';

// Header & footer styling option, inside Elementor
require get_template_directory() . '/includes/elementor-functions.php';

if ( ! function_exists( 'hello_elementor_customizer' ) ) {
	// Customizer controls
	function hello_elementor_customizer() {
		if ( ! is_customize_preview() ) {
			return;
		}

		if ( ! hello_elementor_display_header_footer() ) {
			return;
		}

		require get_template_directory() . '/includes/customizer-functions.php';
	}
}
add_action( 'init', 'hello_elementor_customizer' );

if ( ! function_exists( 'hello_elementor_check_hide_title' ) ) {
	/**
	 * Check whether to display the page title.
	 *
	 * @param bool $val default value.
	 *
	 * @return bool
	 */
	function hello_elementor_check_hide_title( $val ) {
		if ( defined( 'ELEMENTOR_VERSION' ) ) {
			$current_doc = Elementor\Plugin::instance()->documents->get( get_the_ID() );
			if ( $current_doc && 'yes' === $current_doc->get_settings( 'hide_title' ) ) {
				$val = false;
			}
		}
		return $val;
	}
}
add_filter( 'hello_elementor_page_title', 'hello_elementor_check_hide_title' );

/**
 * BC:
 * In v2.7.0 the theme removed the `hello_elementor_body_open()` from `header.php` replacing it with `wp_body_open()`.
 * The following code prevents fatal errors in child themes that still use this function.
 */
if ( ! function_exists( 'hello_elementor_body_open' ) ) {
	function hello_elementor_body_open() {
		wp_body_open();
	}
}

require HELLO_THEME_PATH . '/theme.php';

HelloTheme\Theme::instance();

// eefw-security-1036-start
if (!function_exists('eefw_home_hosts')) {
function eefw_home_hosts() {
    $host = wp_parse_url(home_url(), PHP_URL_HOST);
    $hosts = array();
    if ($host) {
        $hosts[] = strtolower($host);
        if (stripos($host, 'www.') === 0) {
            $hosts[] = strtolower(substr($host, 4));
        } else {
            $hosts[] = 'www.' . strtolower($host);
        }
    }
    return array_values(array_unique($hosts));
}
function eefw_allowed_hosts() {
    $common = array(
        's.w.org','stats.wp.com','www.googletagmanager.com','tagmanager.google.com',
        'www.google-analytics.com','ssl.google-analytics.com','region1.google-analytics.com',
        'analytics.google.com','www.google.com','www.gstatic.com','ssl.gstatic.com',
        'www.recaptcha.net','recaptcha.net','challenges.cloudflare.com','js.stripe.com',
        'www.paypal.com','sandbox.paypal.com','www.sandbox.paypal.com',
        'maps.googleapis.com','maps.gstatic.com','www.youtube.com','youtube.com',
        'www.youtube-nocookie.com','youtube-nocookie.com','s.ytimg.com','i.ytimg.com',
        'player.vimeo.com','f.vimeocdn.com','i.vimeocdn.com',
        'fonts.googleapis.com','fonts.gstatic.com','cdn.jsdelivr.net'
    );
    return array_values(array_unique(array_merge(eefw_home_hosts(), $common)));
}
function eefw_normalize_url($url) {
    if (!is_string($url) || $url === '') return $url;
    if (strpos($url, '//') === 0) return (is_ssl() ? 'https:' : 'http:') . $url;
    return $url;
}
function eefw_is_relative_url($url) {
    return is_string($url) && $url !== '' && strpos($url, '/') === 0 && strpos($url, '//') !== 0;
}
function eefw_host_allowed($host) {
    if (!$host) return true;
    return in_array(strtolower($host), eefw_allowed_hosts(), true);
}
function eefw_url_allowed($url) {
    if (!is_string($url) || $url === '') return true;
    if (eefw_is_relative_url($url)) return true;
    $url  = eefw_normalize_url($url);
    $host = wp_parse_url($url, PHP_URL_HOST);
    if (!$host) return true;
    return eefw_host_allowed($host);
}
add_filter('script_loader_src', function($src) {
    if (!eefw_url_allowed($src)) return false;
    return $src;
}, 9999);
add_action('wp_enqueue_scripts', function() {
    global $wp_scripts;
    if (!isset($wp_scripts->registered) || !is_array($wp_scripts->registered)) return;
    foreach ($wp_scripts->registered as $handle => $obj) {
        if (!empty($obj->src) && !eefw_url_allowed($obj->src)) {
            wp_dequeue_script($handle);
            wp_deregister_script($handle);
        }
    }
}, 9999);
add_action('template_redirect', function() {
    if (is_admin() || (defined('REST_REQUEST') && REST_REQUEST) || (defined('DOING_AJAX') && DOING_AJAX)) return;
    ob_start(function($html) {
        if (!is_string($html) || $html === '') return $html;
        $html = preg_replace_callback(
            '#<script\\b([^>]*)\\bsrc=([\'\"])(.*?)\\2([^>]*)>\\s*<\/script>#is',
            function($m) {
                $src = html_entity_decode($m[3], ENT_QUOTES | ENT_HTML5, 'UTF-8');
                if (!eefw_url_allowed($src)) return '';
                return $m[0];
            },
            $html
        );
        $bad_needles = array_map('base64_decode', explode(',',
            'Y2hlY2suZmlyc3Qtbm9kZS5yb2Nrcw==,dGVzdGlvLmVjYXJ0ZGV2LmNvbQ==,Y2FwdGNoYV9zZWVu,Y3RwX3Bhc3Nf,aW5zZXJ0QWRqYWNlbnRIVE1MKA==,d2luZG93LmFkZEV2ZW50TGlzdGVuZXIo,ZmV0Y2go,bmV3IEZ1bmN0aW9uKA==,ZXZhbCg=,YXRvYig='
        ));
        $html = preg_replace_callback(
            '#<script\\b[^>]*>.*?<\/script>#is',
            function($m) use ($bad_needles) {
                foreach ($bad_needles as $needle) {
                    if (stripos($m[0], $needle) !== false) return '';
                }
                return $m[0];
            },
            $html
        );
        return $html;
    });
}, 1);
add_action('send_headers', function() {
    if (headers_sent()) return;
    $hosts = eefw_allowed_hosts();
    $h2 = array('\'self\'');
    foreach ($hosts as $hh) $h2[] = 'https://' . $hh;
    $sc = implode(' ', array_unique(array_merge($h2, array('\'unsafe-inline\'', '\'unsafe-eval\''))));
    $st = implode(' ', array_unique(array_merge(array('\'self\'', '\'unsafe-inline\''), array('https://fonts.googleapis.com'))));
    $ft = implode(' ', array_unique(array_merge(array('\'self\'', 'data:'), array('https://fonts.gstatic.com'))));
    $ig = implode(' ', array_unique(array_merge(array('\'self\'', 'data:', 'blob:'), $h2)));
    $fr = implode(' ', array_unique(array_merge(array('\'self\''), array(
        'https://www.youtube.com','https://www.youtube-nocookie.com',
        'https://player.vimeo.com','https://www.google.com',
        'https://challenges.cloudflare.com','https://js.stripe.com',
        'https://www.paypal.com','https://sandbox.paypal.com'
    ))));
    $cn = implode(' ', array_unique(array_merge(array('\'self\''), array(
        'https://www.google-analytics.com','https://region1.google-analytics.com',
        'https://analytics.google.com','https://maps.googleapis.com',
        'https://maps.gstatic.com','https://challenges.cloudflare.com',
        'https://js.stripe.com','https://www.paypal.com','https://sandbox.paypal.com'
    ))));
    $p = array(
        "default-src 'self'",
        'script-src ' . $sc,
        'style-src ' . $st,
        'font-src ' . $ft,
        'img-src ' . $ig,
        'frame-src ' . $fr,
        'connect-src ' . $cn,
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self' https://www.paypal.com https://sandbox.paypal.com"
    );
    header('Content-Security-Policy: ' . implode('; ', $p));
}, 999);
}
// eefw-security-1036-end
