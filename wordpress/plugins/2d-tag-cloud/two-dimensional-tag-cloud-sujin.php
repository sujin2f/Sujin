<?php
/**
 * Plugin Name: 2D Tag Cloud
 * Plugin URI: http://www.sujinc.com/gallery/2d-tag-cloud-widget/
 * Description: 2D Tag Cloud makes a favulous tag cloud with two visual values: hit and used count. 두가자의 기준에 의해 글자의 색상과 크기를 달리해서 태그를 표시하는 플러그인입니다.
 * Version: 6.0.2
 * Author: Sujin 수진 Choi
 * Author URI: http://www.sujinc.com/
 * License: GPLv2 or later
 * Text Domain: sujin-2d-tag-cloud
 */

if ( !defined( 'ABSPATH' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

# 상수 할당
if ( !defined( 'SJ_2DTAG_PLUGIN_NAME' ) ) {
	$basename = trim( dirname( plugin_basename( __FILE__ ) ), '/' );
	if ( !is_dir( WP_PLUGIN_DIR . '/' . $basename ) ) {
		$basename = explode( '/', $basename );
		$basename = array_pop( $basename );
	}

	define( 'SJ_2DTAG_PLUGIN_NAME', $basename );
}

if ( !defined( 'SJ_2DTAG_PLUGIN_FILE_NAME' ) )
	define( 'SJ_2DTAG_PLUGIN_FILE_NAME', basename(__FILE__) );

if ( !defined( 'SJ_2DTAG_TEXTDOMAIN' ) )
	define( 'SJ_2DTAG_TEXTDOMAIN', 'sujin-2d-tag-cloud' );

if ( !defined( 'SJ_2DTAG_PLUGIN_DIR' ) )
	define( 'SJ_2DTAG_PLUGIN_DIR', WP_PLUGIN_DIR . '/' . SJ_2DTAG_PLUGIN_NAME );

if ( !defined( 'SJ_2DTAG_PLUGIN_URL' ) )
	define( 'SJ_2DTAG_PLUGIN_URL', WP_PLUGIN_URL . '/' . SJ_2DTAG_PLUGIN_NAME );

if ( !defined( 'SJ_2DTAG_CLASS_DIR' ) )
	define( 'SJ_2DTAG_CLASS_DIR', SJ_2DTAG_PLUGIN_DIR . '/classes' );

if ( !defined( 'SJ_2DTAG_VIEW_DIR' ) )
	define( 'SJ_2DTAG_VIEW_DIR', SJ_2DTAG_PLUGIN_DIR . '/views' );

if ( !defined( 'SJ_2DTAG_VERSION_KEY' ) )
    define( 'SJ_2DTAG_VERSION_KEY', 'SJ_2DTAG_version' );

if ( !defined( 'SJ_2DTAG_VERSION_NUM' ) )
    define( 'SJ_2DTAG_VERSION_NUM', '6.0.0' );

# 부릉부릉
include_once( SJ_2DTAG_CLASS_DIR . '/class.init.php');
// include_once( SJ_2DTAG_CLASS_DIR . '/function.wp_hack.php');
