<?php
/**
 * Class : Init
 *
 * @project Sujin
 * @since   7.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin;

if ( !defined( "ABSPATH" ) ) {
	header( "Status: 404 Not Found" );
	header( "HTTP/1.1 404 Not Found" );
	exit();
}

class Init {
	function __construct() {
		new ThemeSetup();
		new RestApi();

/*
// 		new Admin();
		new RestApi();
*/
	}
}
