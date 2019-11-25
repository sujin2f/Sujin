<?php
/**
 * Class : JSON Schema -- Property
 *
 * @project Sujin
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin\Helpers\Schema;

use Sujin\Wordpress\Theme\Sujin\Helpers\Schema;
use Sujin\Wordpress\Theme\Sujin\Helpers\Schema\Enum\Type;
use Sujin\Wordpress\Theme\Sujin\Helpers\Schema\Enum\Format;

use OutOfBoundsException;

final class Property {
	private $parent = '';
	private $key    = '';

	public $description   = null;
	public $type          = null;
	public $format        = null;
	public $properties    = array();
	public $enum          = array();
	public $items         = array();
	public $required      = false;
	public $item_required = array();
	public $default       = null;

	public function __construct( array $property ) {
		$this->parent      = $property['parent'];
		$this->key         = $property['key'];

		$this->description   = $property['description'] ?? null;
		$this->type          = new Type( $property['type'] );
		$this->format        = ! empty( $property['format'] ) ? new Format( $property['format'] ) : null;
		$this->properties    = $property['properties'] ?? null;
		$this->enum          = $property['enum'] ?? null;
		$this->items         = $property['items'] ?? null;
		$this->default       = $property['default'] ?? null;
		$this->required      = $property['required'] ?? false;
		$this->item_required = $property['item_required'] ?? array();
	}

	public function validate( $object, ?string $key = null, ?bool $return = null ) {
		$value = $key ? $object->$key : $object;

		if ( ! $value && $this->default ) {
			return $this->default;
		}

		$value = $this->filter_type_cast( $value );
		$value = $this->filter_enum( $value );
		$value = $this->filter_format( $value );

		if ( ! $value && $this->required ) {
			throw new OutOfBoundsException( 'The property value is required.' );
		}

		// Case: Object
		if ( Type::OBJECT === ( (string) $this->type ) && $value ) {
			$parent_schema = Schema::get_instance( $this->parent );
			$object_schema = Schema::get_from_properties(
				$this->parent . '-' . $this->key,
				$this->properties,
				$this->item_required,
				$parent_schema->base_dir
			);
			$value         = $object_schema->process( (object) $value );
		}

		if ( $return ) {
			return $value;
		}
	}

	private function filter_type_cast( $value ) {
		switch ( (string) $this->type ) {
			case Type::NUMBER:
				return (int) $value;

			case Type::BOOL:
				return (bool) $value;

			case Type::STRING:
				return (string) $value;

			case Type::OBJECT:
			case Type::ARRAY:
				return (array) $value;
		}

		return $value;
	}

	private function filter_enum( $value ) {
		if ( ! $this->enum ) {
			return $value;
		}

		if ( in_array( $value, $this->enum ) ) {
			return $value;
		}

		throw new OutOfBoundsException( 'Enum value ' . $value . ' does not exist in the schema.' );
	}

	private function filter_format( $value ) {
		if ( ! $this->format ) {
			return $value;
		}

		if ( ! $value && $this->default ) {
			$value = $this->default;
		}

		if ( ! $value ) {
			return $value;
		}

		switch ( $this->format ) {
			case Format::URI:
				$value = filter_var( $value, FILTER_VALIDATE_URL );
				break;
			case Format::DATE:
				$value = date( 'Y-m-d', strtotime( $value ) );
				break;
		}


		return $value;
	}
}
