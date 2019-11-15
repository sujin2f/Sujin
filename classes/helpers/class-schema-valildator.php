<?php
/**
 * Class : JSON Schema Valildator
 *
 * @project Sujin
 * @since   8.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin\Helpers;

use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Items\Abstract_Rest_Item_Base;

class Schema_Valildator {
	use Multiton;

	private $item_name = '';
	private $schema    = array();

	protected function __construct( string $key ) {
		$this->item_name = $key;
		$this->get_schema();
	}

	/**
	 * Gets the schema from .json file
	 * Otherwise, returns null
	 * $ref should be an object
	 */
	public function get_schema(): ?array {
		if ( ! empty( $this->schema ) || null === $this->schema ) {
			return $this->schema;
		}

		$json = dirname( dirname( dirname( __FILE__ ) ) ) . '/schema/rest-response/' . $this->item_name . '.json';

		if ( ! file_exists( $json ) ) {
			$this->schema = null;
			return null;
		}

		$json = file_get_contents( $json );
		$json = json_decode( $json, true );

		if ( json_last_error() ) {
			$this->schema = null;
			return null;
		}

		$this->schema = $json;
		return $json;
	}

	public function validate_and_cast( Abstract_Rest_Item_Base $object ) {
		$this->filter_schema( $this->get_schema(), $object, array() );

var_dump(get_object_vars($object));
	}

	private function filter_schema( array $schema, object $object, array $position ): void {
		$properties = $this->get_properties_from_schema( $schema );

		foreach ( get_object_vars( $object ) as $key => $value ) {
			// Unset undefined in schema
			if ( ! array_key_exists( $key, $properties ) ) {
				unset( $object->$key );
				continue;
			}

			// Cast value
			$object->$key = $this->cast_value( $properties[ $key ]['type'], $value );

// Validation (URL, array, object...) / Required fields
		}
	}

	private function cast_value( string $type, $value ) {
		switch ( $type ) {
			case 'int':
			case 'integer':
			case 'number':
				return (int) $value;
			case 'bool':
			case 'boolean':
				return (boolean) $value;
			case 'float':
			case 'double':
			case 'real':
				return (float) $value;
			case 'string':
				return (string) $value;
			case 'array':
				return (array) $value;
			case 'object':
				return (object) $value;
		}

		return $value;
	}
	private function get_properties_from_schema( array $schema ): array {
		if ( 'object' !== $schema['type'] ) {
			return array();
		}

		$schema = array_map(
			function( $attrs ) {
				if ( ! empty( $attrs['$ref'] ) ) {
					return $this->get_properties_from_ref( $attrs['$ref'] );
				}

				return $attrs;
			},
			$schema['properties']
		);

		return $schema;
	}

	private function get_properties_from_ref( string $ref ): array {
		$ref    = array_pop( explode( '/', $ref ) );
		$schema = $this->get_schema();
		return $schema['definitions'][ $ref ] ?: array();
	}
}
