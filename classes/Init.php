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
	private $ThemeSetup;
//	$AdminPages, $PostTypes, , $Template, $Shortcodes;
	private $defaultThumbnail;

	function __construct() {
		$this->ThemeSetup = new ThemeSetup();
		new RestApi();

/*
		$this->AdminPages = new AdminPages();
		$this->PostTypes = new PostTypes();
*/
/*
		$this->Template = new Template();
		$this->Shortcodes = new Shortcodes();
*/
	}
}
