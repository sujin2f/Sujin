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

	public $multiton_id;

	protected function __construct( string $key ) {}

	public static function get_instance( string $key ) {
		$class = get_called_class();

		if ( ! isset( $class::$_instance[ $key ] ) ) {
			$class::$_instance[ $key ]              = new $class( $key );
			$class::$_instance[ $key ]->multiton_id = $key;
		}

		return $class::$_instance[ $key ];
	}
}
