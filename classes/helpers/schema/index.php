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
		$all_of           = $json['allOf'] ?? array();

		foreach ( $definitions as $key => $definition ) {
			$schema->definitions[ $key ] = Definition::get_from_properties(
				$schema->title . '-' . $key,
				$definition,
				array(),
				$schema->base_dir
			);
		}

		$schema = Schema::set_properties( $schema, $properties, $required );

		$schema->initialized = true;
		$schema->json        = $json;

		if ( ! empty( $all_of ) ) {
			foreach ( $all_of as $one ) {
				$keys = array_keys( $one );

				if ( '$ref' === $keys[0] ) {
					$reference          = new Reference( $one['$ref'], $schema );
					$schema->properties = array_merge( $schema->properties, $reference->properties );
				} else {
					foreach ( $one['properties'] as $key => $property ) {
						$property['item_required']  = $property['required'] ?? null;
						$property['required']       = in_array( $key, $required, true );
						$property['parent']         = $schema->title;
						$property['key']            = $key;
						$schema->properties[ $key ] = new Property( $property );
					}
				}
			}
		}

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

			$property['item_required'] = $property['required'] ?? null;
			$property['required']      = in_array( $key, $required, true );
			$property['parent']        = $schema->title;
			$property['key']           = $key;

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
}
