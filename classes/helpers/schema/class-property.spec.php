<?php
/**
 * Class : JSON Schema Valildator
 *
 * @project Sujin
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin\Helpers\Schema\Property;

use Test_Case;
use Sujin\Wordpress\Theme\Sujin\Helpers\Schema\Property;
use Sujin\Wordpress\Theme\Sujin\Helpers\Schema\Enum\Type;
use Sujin\Wordpress\Theme\Sujin\Helpers\Schema\Enum\Format;

use OutOfBoundsException;

class Unit_Test extends Test_Case {
	public function setUp() {
		parent::setUp();
	}

	function provider_test_validator(): array {
		return array(
			'Null String' => array(
				'type'       => new Type( 'string' ),
				'format'     => null,
				'properties' => null,
				'enum'       => null,
				'items'      => null,
				'default'    => null,
				'required'   => false,
				'value'      => null,
				'expected'   => null,
			),
			'Null String Default' => array(
				'type'       => new Type( 'string' ),
				'format'     => null,
				'properties' => null,
				'enum'       => null,
				'items'      => null,
				'default'    => 'Sujin',
				'required'   => false,
				'value'      => null,
				'expected'   => 'Sujin',
			),
			'Null String Required' => array(
				'type'       => new Type( 'string' ),
				'format'     => null,
				'properties' => null,
				'enum'       => null,
				'items'      => null,
				'default'    => null,
				'required'   => true,
				'value'      => null,
				'expected'   => 'exception',
			),
			'Null String Default Required' => array(
				'type'       => new Type( 'string' ),
				'format'     => null,
				'properties' => null,
				'enum'       => null,
				'items'      => null,
				'default'    => 'Sujin',
				'required'   => true,
				'value'      => null,
				'expected'   => 'Sujin',
			),
			'String Conversion' => array(
				'type'       => new Type( 'string' ),
				'format'     => null,
				'properties' => null,
				'enum'       => null,
				'items'      => null,
				'default'    => null,
				'required'   => true,
				'value'      => 3000,
				'expected'   => '3000',
			),
		);
	}

	/**
	 * @dataProvider provider_test_validator
	 */
	public function test_validator(
		Type $type,
		?Format $format,
		?array $properties,
		?array $enum,
		?array $items,
		$default,
		$required,
		$value,
		$expected
	) {
		$object = new Property(
			array(
				'parent'      => 'parent',
				'key'         => 'key',
				'type'        => $type,
				'format'      => $format,
				'properties'  => $properties,
				'enum'        => $enum,
				'items'       => $items,
				'default'     => $default,
				'required'    => $required,
			)
		);

		if ( 'exception' === $expected ) {
			error_reporting( 0 );
			$result = false;

			try {
				$object->validate( $value );
			} catch ( OutOfBoundsException $_) {
				$result = true;
			}

			error_reporting( -1 );
			$this->assertTrue( $result );
			return;
		}

		$this->assertEquals( $expected, $object->validate( $value ) );
	}
}
