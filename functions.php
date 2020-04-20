<?php
/**
	* Functions
	*
	* @project Sujin
	* @since   8.0.0
	* @author  Sujin 수진 Choi http://www.sujinc.com/
	*
	* @todo    schema required fields
	*/

if ( ! defined( 'ABSPATH' ) ) {
	header( 'Status: 404 Not Found' );
	header( 'HTTP/1.1 404 Not Found' );
	exit();
}

if ( ! defined( 'SUJIN_DEV_MODE' ) ) {
	define( 'SUJIN_DEV_MODE', true );
}

include_once( get_stylesheet_directory() . '/vendor/sujin/wp-express/autoload.php' );

$class_loader = new Sujin\Wordpress\WP_Express\Autoloader(
	'Sujin\\Wordpress\\Theme\\Sujin',
	dirname( __FILE__ ) . DIRECTORY_SEPARATOR . 'classes',
);
$class_loader->register();

Sujin\Wordpress\Theme\Sujin\Bootstrap::get_instance();
