<?php
/**
 * Functions
 *
 * @project Sujin
 * @since   8.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

ini_set( 'display_errors', 1 );
ini_set( 'display_startup_errors', 1 );
error_reporting( E_ALL );

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
