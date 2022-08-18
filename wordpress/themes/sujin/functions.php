<?php
/**
 * Functions
 *
 * @package sujinc.com
 * @since   8.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

if ( ! defined( 'ABSPATH' ) ) {
	header( 'Status: 404 Not Found' );
	header( 'HTTP/1.1 404 Not Found' );
	exit();
}

require_once get_stylesheet_directory() . '/wp-express/autoload.php';

$class_loader = new Sujin\Wordpress\WP_Express\Autoloader(
	'Sujin\\Wordpress\\Theme\\Sujin',
	dirname( __FILE__ ) . DIRECTORY_SEPARATOR . 'classes',
);
$class_loader->register();

Sujin\Wordpress\Theme\Sujin\Bootstrap::get_instance();
