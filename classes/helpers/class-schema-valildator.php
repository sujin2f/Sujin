<?php
/**
 * Class : JSON Schema Valildator
 *
 * @project Sujin
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin\Helpers;

use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Items\Abstract_Rest_Item_Base;

final class Schema_Valildator {
	use Multiton;

	private $item_name = '';
	private $schema    = array();

	protected function __construct( string $key ) {
		$this->item_name = str_replace( '_', '-', $key );
		$this->get_schema();
	}

	/**
	 * Gets the schema from .json file
	 * Otherwise, returns null
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

	/**
	 * Entry point of validation
	 */
	public function validate_and_cast( Abstract_Rest_Item_Base $object ) {
		if ( ! $this->get_schema() ) {
			return;
		}

		$this->filter_schema( $this->get_schema(), $object );
	}

	/**
	 * Reculsive method to filter and validate values
	 * Object will be an associatied array
	 */
	private function filter_schema( array $schema, object $object ): void {
		$properties = $this->get_properties_from_schema( $schema, $echo );

		// For each property item
		foreach ( get_object_vars( $object ) as $key => $value ) {
			// Unset undefined in schema
			if ( ! array_key_exists( $key, $properties ) ) {
				unset( $object->$key );
				continue;
			}

			$type = $properties[ $key ]['type'];

			// For object type, reculsion
			if ( 'object' === $type || 'array' === $type ) {
				// Object should not be empty. Otherwise, it could end up with infinity loop.
				if ( $object->$key ) {
					$schema = 'object' === $type ? $properties[ $key ] : $properties[ $key ]['items'];

					// Has items.type = ''
					if ( 'array' === $type && array_key_exists( 'type', $schema ) ) {
						foreach ( $object->$key as &$child ) {
							$child = $this->filter_values( $schema, $child );
						}
						continue;
					}

					$object->$key = (object) $object->$key;

					if ( array_key_exists( '$ref', $schema ) ) {
						foreach ( $object->$key as &$child ) {
							$child = (object) $child;
							$this->filter_schema( $schema, $child );
							$child = (array) $child;
						}
					} else {
						$this->filter_schema( $schema, $object->$key );
					}

					$object->$key = (array) $object->$key;
					continue;
				}

				$object->$key = array();
				continue;
			}

			$object->$key = $this->filter_values( $properties[ $key ], $object->$key );

		}
	}

	/**
	 * Filtering the values
	 * Calls filter_enum(), filter_format(), and type_cast()
	 */
	private function filter_values( array $schema, $value ) {
		$value = $this->type_cast( $schema, $value );
		$value = $this->filter_enum( $schema, $value );
		$value = $this->filter_format( $schema, $value );

		return $value;
	}
	private function filter_enum( array $schema, $value ) {
		if ( ! $schema['enum'] ) {
			return $value;
		}

		if ( in_array( $value, $schema['enum'] ) ) {
			return $value;
		}

		return $schema['default'];
	}
	private function filter_format( array $schema, $value ) {
		if ( ! $schema['format'] ) {
			return $value;
		}

		switch ( $schema['format'] ) {
			case 'uri':
				return filter_var( $value, FILTER_VALIDATE_URL );
			case 'date':
				return date( 'Y-m-d', strtotime( $value ) );
		}

		return $value;
	}
	private function type_cast( array $schema, $value ) {
		switch ( $schema['type'] ) {
			case 'int':
			case 'integer':
			case 'number':
				return (int) $value;
			case 'bool':
			case 'boolean':
				return (bool) $value;
			case 'float':
			case 'double':
			case 'real':
				return (float) $value;
			case 'string':
				return (string) $value;
			case 'array':
			case 'object':
				return (array) $value;
		}

		return $value;
	}

	private function get_properties_from_schema( array $schema ): array {
		$all_of = $schema['allOf'] ?? array();

		if ( 'object' === $schema['type'] ) {
			$schema = $schema['properties'];
		}

		// Expand $ref
		foreach ( array_keys( $schema ) as $key ) {
			if ( '$ref' === $key ) {
				$schema = $this->get_properties_from_ref( $schema[ $key ], $echo );
				continue;
			}
		}

		foreach ( $all_of as $ref ) {
			$schema = array_merge(
				$schema,
				$this->get_properties_from_ref( $ref['$ref'] )
			);
		}

		return $schema;
	}

	private function get_properties_from_ref( string $ref ): array {
		$ref = explode( '/', $ref );

		if ( '#' === $ref[0] ) {
			$ref    = array_pop( $ref );
			$schema = $this->get_schema();
			return $schema['definitions'][ $ref ] ?: array();
		}

		$ref    = array_pop( $ref );
		$schema = Schema_Valildator::get_instance( $ref )->get_schema();

		return $schema['properties'];
	}
}
