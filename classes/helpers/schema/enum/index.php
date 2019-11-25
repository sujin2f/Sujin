<?php
/**
 * Class : JSON Schema -- Enum -- Type
 *
 * @project Sujin
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin\Helpers\Schema;

use Sujin\Wordpress\Theme\Sujin\Exceptions\Not_Found_Exception;

use ReflectionClass;

class Enum {
	public $keyword;

	public function __construct( string $keyword ) {
		$ref_class = new ReflectionClass( $this );

		if ( ! in_array( $keyword, $ref_class->getConstants(), true ) ) {
			throw new Not_Found_Exception( 'Enum ' . $keyword );
		}

		$this->keyword = $keyword;
	}

	public function __toString() {
		return $this->keyword;
	}
}
