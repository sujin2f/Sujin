<?php
/**
 * JSON Schema Property Unit Test
 *
 * @package    Sujinc.com
 * @subpackage Schema
 * @author     Sujin 수진 Choi <http://www.sujinc.com/>
 */

namespace Sujin\Wordpress\Theme\Sujin\Helpers\Schema\Property;

use Test_Case;
use Sujin\Wordpress\Theme\Sujin\Helpers\Schema\Response_Schema;
use Sujin\Wordpress\Theme\Sujin\Helpers\Schema\Property;
use Sujin\Wordpress\Theme\Sujin\Helpers\Schema\Enum\Type;
use Sujin\Wordpress\Theme\Sujin\Helpers\Schema\Enum\Format;

use InvalidArgumentException;

class Unit_Test extends Test_Case {
	/**
	 * Test data
	 */
	function provider_test_string_validator(): array {
		return array(
			/*
				'Null String'                  => array(
					'type'       => Type::string(),
					'default'    => null,
					'required'   => false,
					'value'      => null,
					'expected'   => null,
				),
				'Null String Default'          => array(
					'type'       => Type::string(),
					'default'    => 'Sujin',
					'required'   => false,
					'value'      => null,
					'expected'   => 'Sujin',
				),
			*/
				'Null String Required' => array(
					'type'     => Type::string(),
					'default'  => null,
					'required' => true,
					'value'    => null,
					'expected' => 'exception',
				),
		/*
			'Null String Default Required' => array(
				'type'       => Type::string(),
				'default'    => 'Sujin',
				'required'   => true,
				'value'      => null,
				'expected'   => 'Sujin',
			),
			'String Conversion'            => array(
				'type'       => Type::string(),
				'default'    => null,
				'required'   => true,
				'value'      => 3000,
				'expected'   => '3000',
			),
		*/
		);
	}

	/**
	 * Load and validate string schema
	 *
	 * @dataProvider provider_test_string_validator
	 */
	public function test_string_validator(
		Type $type,
		?string $default,
		bool $required,
		$value,
		?string $expected
	) {
		$arg = array(
			'type'    => $type->value(),
			'default' => $default,
		);

		$required = $required ? [ 'test' ] : [];
		$property = Property::from_json(
			Response_Schema::from_json( 'schema', array() ), // Schema
			'test',
			$arg,
		);

		if ( $required ) {
			$this->set_private_property( $property, 'required', true );
		}

		if ( 'exception' === $expected ) {
			error_reporting( 0 );
			$result = false;

			try {
				$property->filter( $value );
			} catch ( InvalidArgumentException $_ ) {
				$result = true;
			}

			error_reporting( -1 );
			$this->assertTrue( $result );
			return;
		}

		$this->assertEquals( $expected, $property->filter( $value ) );
	}
}
