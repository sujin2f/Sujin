<?php
/**
 * Instantiable Trait
 *
 * @project WP-Express
 * @since   1.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\WP_Express\Helpers;

if ( !defined( "ABSPATH" ) ) {
	header( "Status: 404 Not Found" );
	header( "HTTP/1.1 404 Not Found" );
	exit();
}

trait Multiton {
	public static $_instance = array();

	public static function get_instance( $id ) {
		if ( ! array_key_exists( $id, self::$_instance ) ) {
			self::$_instance[ $id ] = new self( $id );
		}

		return self::$_instance[ $id ];
	}
}
