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
	 */
	public function get_schema(): ?array {
		if ( ! empty( $this->schema ) || is_null( $this->schema ) ) {
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
		var_dump(get_object_vars($object));
		$this->filter_schema( $this->get_schema(), get_object_vars( $object ), $object, array() );

		var_dump(get_object_vars($object));
		die;
	}

	private function filter_schema( array $schema, array $target, Abstract_Rest_Item_Base $object, array $position ) {
		$properties = $this->get_properties_from_schema( $schema );

		foreach ( $target as $key => $type ) {
			// Unset undefined
			if ( ! array_key_exists( $key, $properties ) ) {
				$this->unset( $object, $position );
			}
		}
	}

	private function unset( $object, array $position ) {
		$removing_candidate = &$object;

		foreach ( $position as $key ) {
			if ( is_object( $removing_candidate ) ) {
				$removing_candidate = &$removing_candidate->$key;
			} else if ( is_array( $removing_candidate ) ) {
				$removing_candidate = &$removing_candidate[ $key ];
			}
		}

		unset( $removing_candidate );
	}

	private function get_properties_from_schema( array $schema ): array {
		if ( 'object' !== $schema['type'] ) {
			return array();
		}

		$schema = array_map(
			function( $attrs ) {
				if ( ! empty( $attrs['$ref'] ) ) {
					return $attrs['$ref'];
				}

				return $attrs['type'];
			},
			$schema['properties']
		);

		return $schema;
	}
}
