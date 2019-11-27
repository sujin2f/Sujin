<?php
namespace Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Items;

use Sujin\Wordpress\Theme\Sujin\Helpers\Schema\Response_Schema;

use JsonSerializable;

abstract class Abstract_Rest_Item implements JsonSerializable {
	protected const ITEM_NAME = '';

	private function get_item_name(): string {
		if ( static::ITEM_NAME ) {
			return static::ITEM_NAME;
		}

		$called_class = explode( '\\', get_called_class() );
		return strtolower( array_pop( $called_class ) );
	}

	public function jsonSerialize(): array {
		$schema = Response_Schema::get_instance( $this->get_item_name() );
		$value  = $schema->filter( $this );
		return json_decode( wp_json_encode( $value ), true );
	}
}
