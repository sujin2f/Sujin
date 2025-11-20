<?php
/**
 * Functions
 *
 * @package sujinc.com
 * @since   1.0.0
 * @author  Sujin 수진 Choi
 */

if ( ! defined( 'ABSPATH' ) ) {
	header( 'Status: 404 Not Found' );
	header( 'HTTP/1.1 404 Not Found' );
	exit();
}

require_once __DIR__ . '/vendor/autoload.php';
new Sujin\Theme\Bootstrap();

/**
 * For Dev: Do not call this from production
 *
 * @param mixed $value Log message.
 * @return void
 */
function halp( mixed $value ) {
	error_log( wp_json_encode( $value ) );
}
