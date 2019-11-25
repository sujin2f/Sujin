<?php
/**
 * Class : JSON Schema Valildator
 *
 * @project Sujin
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin\Helpers;

use Sujin\Wordpress\Theme\Sujin\Helpers\Schema\Property;
use Sujin\Wordpress\Theme\Sujin\Helpers\Schema\Reference;
use Sujin\Wordpress\Theme\Sujin\Helpers\Schema\Definition;
use Sujin\Wordpress\Theme\Sujin\Helpers\Schema\Enum\Type;
use Sujin\Wordpress\Theme\Sujin\Helpers\Schema\Enum\Format;

use Sujin\Wordpress\Theme\Sujin\Exceptions\Not_Found_Exception;
use DomainException;

class Schema {
	use Multiton;

	public $initialized = false;
	public $title       = '';
	public $properties  = array();
	public $base_dir    = '';
	public $json        = '';

	/**
	 * Load schema from filesystem
	 */
	public static function load( string $file = null ): Schema {
		if ( ! file_exists( $file ) ) {
			throw new Not_Found_Exception( $file );
		}

		$json = file_get_contents( $file );
		$json = json_decode( $json, true );

		if ( json_last_error() ) {
			throw new DomainException( 'Not a valid json format.' );
		}

		$schema = Schema::get_instance( $json['title'] );

		$schema->base_dir = dirname( $file );
		$schema->title    = $json['title'];
		$properties       = $json['properties'] ?? array();
		$definitions      = $json['definitions'] ?? array();
		$required         = $json['required'] ?? array();

		$schema = Schema::set_properties( $schema, $properties, $required );

		foreach ( $definitions as $key => $definition ) {
			$schema->definitions[ $key ] = Definition::get_from_properties( $schema->title . '-' . $key, $definition, array(), $schema->base_dir );
		}

		$schema->initialized = true;
		$schema->json        = $json;

		return $schema;
	}

	/**
	 * Assign schema directly
	 */
	public static function get_from_properties( string $key, ?array $properties, array $required, string $base_dir ): Schema {
		$schema = Schema::get_instance( $key );

		if ( $schema->initialized ) {
			return $schema;
		}

		$properties       = $properties ?? array();
		$schema->title    = $key;
		$schema->base_dir = $base_dir;

		return Schema::set_properties( $schema, $properties, $required );
	}

	private static function set_properties( Schema $schema, array $properties, array $required ): Schema {
		foreach ( $properties as $key => $property ) {
			/**
			 * {
			 *   ...,
			 *   "properties": {
			 *     "$ref": "#/definitions/definitions"
			 *   },
			 *   ...
			 * }
			 */
			if ( '$ref' === $key ) {
				$schema->properties[ $key ] = new Reference( $property, $schema );
				return $schema;
			}

			/**
			 * {
			 *   ...,
			 *   "properties": {
			 *     "item": {
			 *       "$ref": "#/definitions/definitions"
			 *     }
			 *   },
			 *   ...
			 * }
			 */
			if ( array_key_exists( '$ref', $property ) ) {
				$schema->properties[ $key ] = new Reference( $property['$ref'], $schema, $key );
				continue;
			}

			$property['item_required']  = $property['required'] ?? null;
			$property['required']       = in_array( $key, $required, true );
			$property['parent']         = $schema->title;
			$property['key']            = $key;

			$schema->properties[ $key ] = new Property( $property );
		}

		return $schema;
	}

	/**
	 * Schema validation and return value
	 */
	public function process( object $object ): object {
		// For each in schema
		foreach ( $this->properties as $key => $property ) {
			$property->validate( $object, $key );
		}

		// For each property item
		foreach ( get_object_vars( $object ) as $key => $_ ) {
			// Unset undefined in schema
			$properties = $this->properties;

			if ( array_key_exists( '$ref', $this->properties ) ) {
				$properties = $this->properties['$ref']->properties;
			}

			if ( ! array_key_exists( $key, $properties ) ) {
				unset( $object->$key );
				continue;
			}
		}

		return $object;
	}




	/**
	 * Reculsive method to filter and validate values
	 * Object will be an associatied array
	 */
	public function filter_schema( object $object, ?array $schema = null ): void {
		if ( ! $schema ) {
			$schema = $this->schema;
		}

		$properties = $this->get_properties_from_schema( $schema );

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
							$this->filter_schema( $child, $schema );
							$child = (array) $child;
						}
					} else {
						$this->filter_schema( $object->$key, $schema );
					}

					$object->$key = (array) $object->$key;
					continue;
				}

				$object->$key = array();
				continue;
			}
		}
	}

	private function get_properties_from_schema( array $schema ): array {
		$all_of = $schema['allOf'] ?? array();

		if ( 'object' === $schema['type'] ) {
			$schema = $schema['properties'];
		}

		// Expand $ref
		foreach ( array_keys( $schema ) as $key ) {
			if ( '$ref' === $key ) {
				$schema = $this->get_properties_from_ref( $schema[ $key ] );
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
