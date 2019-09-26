<?php
namespace Sujin\Wordpress\Theme\Sujin;

use Sujin\Wordpress\Theme\Sujin\Helpers\Singleton;

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

class Assets {
	use Singleton;

	public function __construct() {
		add_action( 'init', array( $this, 'register_scripts' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
	}

	public function register_scripts() {
		wp_register_script(
			'sujin-app-vendor',
			get_stylesheet_directory_uri() . '/dist/vendors~app.js',
			array(),
			false,
			true
		);

		wp_register_style(
			'sujin-app-vendor',
			get_stylesheet_directory_uri() . '/dist/vendors~style.css',
			array(),
			false
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

		wp_deregister_script('jquery');
		wp_register_script('jquery', 'http://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js', false, '1.12.4');
	}

	public function enqueue_scripts() {
		wp_enqueue_script( 'wp-shortcode' );
		wp_enqueue_script( 'wp-components' );

		wp_enqueue_script( 'sujin-app' );
		wp_enqueue_script( 'sujin-app-vendor' );
		wp_enqueue_style( 'sujin-app' );
		wp_enqueue_style( 'sujin-app-vendor' );

		wp_dequeue_style( 'wp-block-library' );

	}
}
