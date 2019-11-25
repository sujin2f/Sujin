<?php
namespace Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Items;

use Sujin\Wordpress\Theme\Sujin\Helpers\Schema;
use JsonSerializable;

abstract class Abstract_Rest_Item_Base implements JsonSerializable {
	protected const ITEM_NAME  = '';

	private $validator = null;

	public function get_validator(): Schema_Valildator {
		if ( $this-validator) {
			return $this-validator;
		}

		$schema_dir      = dirname( dirname( dirname( __DIR__ ) ) ) . '/schema';
		$this->validator = Schema::load( $schema_dir . '/' . get_item_name() . '.json' );

		return $this->validator;
	}

	private function get_item_name(): string {
		if ( static::ITEM_NAME ) {
			return static::ITEM_NAME;
		}

		$called_class = explode( '\\', get_called_class() );
		return strtolower( array_pop( $called_class ) );
	}

	public function jsonSerialize(): array {
		$this->get_validator()->filter_schema( $this );
		$array = get_object_vars( $this );
		ksort( $array );
		return json_decode( wp_json_encode( $array ), true );
	}
}
