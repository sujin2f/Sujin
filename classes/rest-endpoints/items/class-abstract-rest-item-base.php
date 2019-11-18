<?php
namespace Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Items;

use Sujin\Wordpress\Theme\Sujin\Helpers\Schema_Valildator;
use RuntimeException, ArrayIterator, JsonSerializable;

abstract class Abstract_Rest_Item_Base implements JsonSerializable {
	protected const ITEM_NAME = '';

	public function get_validator(): Schema_Valildator {
		return Schema_Valildator::get_instance( $this->get_item_name() );
	}

	private function get_item_name(): string {
		if ( static::ITEM_NAME ) {
			return static::ITEM_NAME;
		}

		$called_class = explode( '\\', get_called_class() );
		return strtolower( array_pop( $called_class ) );
	}

	public function jsonSerialize(): array {
		$this->get_validator()->validate_and_cast( $this );
		$array = get_object_vars( $this );
		ksort( $array );
		return json_decode( wp_json_encode( $array ), true );
	}
}
