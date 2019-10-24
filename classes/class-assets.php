<?php
namespace Sujin\Wordpress\Theme\Sujin;

use Sujin\Wordpress\Theme\Sujin\Helpers\Singleton;
use Sujin\Wordpress\WP_Express\Google_Font_Loader;

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

		Google_Font_Loader::get_instance( 'Ubuntu:300,400,500,700' );
	}

	public function register_scripts() {
		wp_register_script(
			'sujin-app-vendor',
			get_stylesheet_directory_uri() . '/dist/vendors~app.js',
			array(),
			false,
			true
		);

		wp_register_script(
			'sujin-app',
			get_stylesheet_directory_uri() . '/dist/app.js',
			array(),
			filemtime( get_stylesheet_directory() . '/dist/app.js' ),
			true
		);

		wp_register_style(
			'sujin-app',
			get_stylesheet_directory_uri() . '/dist/style.css',
			array(),
			filemtime( get_stylesheet_directory() . '/dist/style.css' )
		);

		if ( ! is_admin() && 'wp-login.php' !== $GLOBALS['pagenow'] ) {
			wp_deregister_script( 'jquery' );
			wp_register_script( 'jquery', self::JQUERY_CDN, false, '1.12.4' );
		}
	}

	public function enqueue_scripts() {
		if ( is_admin() ) {
			return;
		}

		wp_enqueue_script( 'wp-shortcode' );
		wp_enqueue_script( 'wp-components' );

		wp_enqueue_script( 'sujin-app' );
		wp_enqueue_script( 'sujin-app-vendor' );
		wp_enqueue_style( 'sujin-app' );

		// Remove dependancies to minimize script load
		$scripts = wp_scripts();
		$scripts->registered['wp-shortcode']->deps = array( 'lodash' );
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
