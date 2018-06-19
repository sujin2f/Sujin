<?php
/**
 * Functions
 *
 * @project Sujin
 * @since   8.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

if ( !defined( "ABSPATH" ) ) {
	header( "Status: 404 Not Found" );
	header( "HTTP/1.1 404 Not Found" );
	exit();
}

include_once( __DIR__ . '/autoload.php' );
include_once( __DIR__ . '/venders/wp-express/autoload.php' );

Sujin\Wordpress\Theme\Sujin\Bootstrap::get_instance();
