<?php
/**
 * Class : Utilities
 *
 * @project Sujin
 * @since   8.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin\Helpers;

class Utilities {
	public static function get_item( $object, string $key ) {
		if ( is_object( $object ) ) {
			return $object->{$key} ?? null;
		}

		if ( is_array( $object ) ) {
			return $object[ $key ] ?? null;
		}

		return null;
	}
}
