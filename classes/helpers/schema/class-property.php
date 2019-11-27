<?php
/**
 * JSON Schema Property
 *
 * @package    Sujinc.com
 * @subpackage Schema
 * @author     Sujin 수진 Choi <http://www.sujinc.com/>
 * @since      9.0
 * @todo       Array Validation
 */

namespace Sujin\Wordpress\Theme\Sujin\Helpers\Schema;

use Sujin\Wordpress\Theme\Sujin\Helpers\Schema;
use Sujin\Wordpress\Theme\Sujin\Helpers\Schema\Enum\{
	Type,
	Format,
};

use InvalidArgumentException;

final class Property {
	/**
	 * Parent Schema
	 *
	 * @var Schema
	 */
	private $schema;

	/**
	 * Identifier
	 *
	 * @var string
	 */
	private $id;

	/**
	 * @var array
	 */
	private $property;

	/**
	 * When the prop is reference
	 *
	 * @var Reference
	 */
	private $reference;

	/**
	 * Property must have type, so this can be used as an indicator of initialization.
	 *
	 * @var Type
	 */
	private $type;

	/**
	 * @var Format
	 */
	private $format;

	/**
	 * @var array
	 */
	private $enum;

	/**
	 * @var array
	 */
	private $items;

	/**
	 * @var bool
	 */
	private $required;

	/**
	 * @var mixed
	 */
	private $default;

	/**
	 * Required property?
	 *
	 * @used-by Property::filter()
	 */
	public function get_required(): bool {
		return $this->required;
	}

	/**
	 * Get the instance from a json
	 *
	 * @return  Property
	 * @used-by Schema::init
	 */
	public static function from_json( Schema $parent, string $id, array $property ): Property {
		$that           = new Property();
		$that->id       = $id;
		$that->schema   = $parent;
		$that->property = $property;

		$that->init();

		return $that;
	}

	/**
	 * Prepare this instance
	 */
	public function init(): void {
		$this->required = ! empty( $this->schema->get_required() ) ? in_array( $this->id, $this->schema->get_required(), true ) : false;

		if ( ! empty( $this->property['$ref'] ) ) {
			$this->reference = $this->schema->get_reference( $this->property['$ref'] );
			return;
		}

		// Type is required
		$type       = $this->property['type'];
		$this->type = Type::$type();

		$format       = $this->property['format'] ?? null;
		$this->format = ! empty( $format ) ? Format::$format() : null;

		$this->enum          = $this->property['enum'] ?? null;
		$this->items         = $this->property['items'] ?? null;
		$this->default       = $this->property['default'] ?? null;
	}

	/**
	 * Filter a value
	 *
	 *
	 *
	 * @param  $value mixed
	 * @return mixed
	 * @throws InvalidArgumentException
	 * @todo   $ref
	 */
	public function filter( $value ) {
		if ( $this->reference ) {
			return $this->reference->filter( $value );
		}

		// Set as default
		if ( empty( $value ) && $this->default ) {
			return $this->default;
		}

		// Filters
		$value = $this->filter_type( $value );
		$value = $this->filter_enum( $value );
		$value = $this->filter_format( $value );
		$value = $this->filter_array( $value );

		// Empty value, but it's required
		if ( empty( $value ) && $this->required ) {
			throw new InvalidArgumentException( 'The property value is required.' );
		}

		return $value;
	}

	/**
	 * @return  mixed
	 * @used-by Property::filter()
	 */
	private function filter_type( $value ) {
		if ( empty( $this->type ) ) {
			return $value;
		}

		switch ( $this->type->case() ) {
			case Type::NUMBER:
				return (int) $value;

			case Type::BOOL:
				return (bool) $value;

			case Type::STRING:
				return (string) $value;

			case Type::ARRAY:
				return (array) $value;
		}

		return $value;
	}

	/**
	 * @return  mixed
	 * @used-by Property::filter()
	 * @throws  InvalidArgumentException
	 */
	private function filter_enum( $value ) {
		if ( empty( $this->enum ) ) {
			return $value;
		}

		if ( in_array( $value, $this->enum ) ) {
			return $value;
		}

		throw new InvalidArgumentException( 'Enum value ' . $value . ' does not exist in the schema.' );
	}

	/**
	 * @return  mixed
	 * @used-by Property::filter()
	 */
	private function filter_format( $value ) {
		if ( empty( $this->format ) ) {
			return $value;
		}

		if ( empty( $value ) ) {
			return $value;
		}

		switch ( $this->format->case() ) {
			case Format::URI:
				$value = filter_var( $value, FILTER_VALIDATE_URL );
				break;
			case Format::DATE:
				$value = date( 'Y-m-d', strtotime( $value ) );
				break;
		}

		return $value;
	}

	/**
	 * @return  mixed
	 * @used-by Property::filter()
	 */
	private function filter_array( $value ) {
		if ( Type::ARRAY !== $this->type->case() ) {
			return $value;
		}

		if ( empty( $value ) ) {
			return $value;
		}

		$property = Property::from_json( $this->schema, $id . '::items', $this->items );
		$array    = array();
var_dump($property, $value);
		foreach ( $value as $item ) {
			$array[] = $property->filter( $item );
		}

		return $array;
	}
}
