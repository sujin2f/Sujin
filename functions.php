<?php
/**
 * Functions
 *
 * @project Sujin
 * @since   8.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

if ( ! defined( 'ABSPATH' ) ) {
	header( 'Status: 404 Not Found' );
	header( 'HTTP/1.1 404 Not Found' );
	exit();
}

if ( ! function_exists( 'register_block_type' ) ) {
	return;
}

include_once( get_stylesheet_directory() . '/autoload.php' );
include_once( get_stylesheet_directory() . '/vendor/sujin/wp-express/autoload.php' );

Sujin\Wordpress\Theme\Sujin\Bootstrap::get_instance();

/*
add_action( 'wp_enqueue_scripts', 'this_wp_enqueue_scripts' );
function this_wp_enqueue_scripts() {
	$scripts = wp_scripts();
	var_dump(array_keys($scripts->registered));
	die;
}
*/
