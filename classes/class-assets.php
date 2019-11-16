<?php
namespace Sujin\Wordpress\Theme\Sujin;

use Sujin\Wordpress\Theme\Sujin\Helpers\Singleton;
use Sujin\Wordpress\WP_Express\Google_Font_Loader;
use Sujin\Wordpress\WP_Express\Fields\Settings\Attachment as Option_Attachment;
use Sujin\Wordpress\WP_Express\Fields\Settings\Checkbox as Option_Checkbox;

use WP_Query;

/**
 * Initialize
 *
 * @project React Theme
 * @author  Sujin 수진 Choi http://www.sujinc.com/
*/

if ( ! defined( 'ABSPATH' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

final class Assets {
	use Singleton;

	private const JQUERY_CDN = 'http://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js';

	public function __construct() {
		add_action( 'init', array( $this, 'register_scripts' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
		add_filter( 'upload_mimes', array( $this, 'upload_mimes' ) );

		Google_Font_Loader::get_instance( 'Ubuntu:300,400,500,700' );
	}

	public function upload_mimes( array $mime_types ): array {
		$mime_types['svg'] = 'image/svg+xml';
		return $mime_types;
	}

	public function register_scripts(): void {
		$manifest = get_stylesheet_directory() . '/dist/manifest.json';

		if ( ! file_exists( $manifest) ) {
			return;
		}

		$manifest = file_get_contents( get_stylesheet_directory() . '/dist/manifest.json' );
		$manifest = json_decode( $manifest, true );

		if ( $manifest['vendors~app.js'] ?? null ) {
			wp_register_script(
				'sujin-app-vendor',
				$manifest['vendors~app.js'],
				array(),
				false,
				true
			);
		}

		wp_register_script(
			'sujin-app',
			$manifest['app.js'],
			array(),
			false,
			true
		);

		$show_on_front = get_option( 'show_on_front' );
		$page_on_front = get_option( 'page_on_front' );
		$front_page    = null;

		if ( 'posts' === $show_on_front ) {
			$front_page = new WP_Query(
				array(
					'post_type'      => 'post',
					'post_statue'    => 'publish',
					'posts_per_page' => 1,
				)
			);

		} elseif ( 'page' === $show_on_front ) {
			$front_page = new WP_Query(
				array(
					'post_type'      => 'page',
					'post_statue'    => 'publish',
					'posts_per_page' => 1,
					'p'              => $page_on_front,
				)
			);

		}

		wp_localize_script(
			'sujin-app',
			'sujin',
			array(
				'title'           => get_bloginfo( 'name' ),
				'description'     => get_bloginfo( 'description' ),
				'ogImage'         => Option_Attachment::get_instance( 'Open Graph (Default Image)' )->get_image(),
				'hideFrontHeader' => Option_Checkbox::get_instance( 'Hide Header in Front Page' )->get(),
				'hideFrontFooter' => Option_Checkbox::get_instance( 'Hide Footer in Front Page' )->get(),
				'frontPage'       => $front_page->post->post_name,
				'showOnFront'     => $show_on_front,
			)
		);

		wp_register_style(
			'sujin-app',
			$manifest['style.css'],
			array()
		);

		if ( ! is_admin() && 'wp-login.php' !== $GLOBALS['pagenow'] ) {
			wp_deregister_script( 'jquery' );
			wp_register_script( 'jquery', self::JQUERY_CDN, false, '1.12.4' );
		}
	}

	public function enqueue_scripts(): void {
		if ( is_admin() ) {
			return;
		}

		wp_enqueue_script( 'wp-shortcode' );
		wp_enqueue_script( 'wp-components' );

		wp_enqueue_script( 'sujin-app' );
		wp_enqueue_script( 'sujin-app-vendor' );
		wp_enqueue_style( 'sujin-app' );

		wp_dequeue_style( 'wp-block-library' );

		// Remove dependancies to minimize script load
		$scripts = wp_scripts();

		$scripts->registered['wp-shortcode']->deps  = array( 'lodash' );
		$scripts->registered['wp-components']->deps = array(
			'lodash',
			'wp-compose',
			'wp-dom',
			'wp-element',
			'wp-url',
			'wp-i18n',
			'moment',
		);
	}
}
