<?php
/**
 * Functions
 *
 * @project Sujin
 * @since   7.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

if ( !defined( "ABSPATH" ) ) {
	header( "Status: 404 Not Found" );
	header( "HTTP/1.1 404 Not Found" );
	exit();
}

include_once( "autoload.php" );
include_once( 'assets/vendors/wp_express/autoload.php' );

new \Sujin\Init();