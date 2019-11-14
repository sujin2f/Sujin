<?php
/**
 * Class : Instancable
 *
 * @project Sujin
 * @since   8.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin\Helpers;

trait Multiton {
	public static $_instance = array();

	protected function __construct( string $key ) {}

	public static function get_instance( string $key ) {
		if ( ! isset( self::$_instance[ $key ] ) ) {
			self::$_instance[ $key ] = new self( $key );
		}
		return self::$_instance[ $key ];
	}
}
