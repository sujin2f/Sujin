<?php
namespace Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Items;

use Sujin\Wordpress\Theme\Sujin\Helpers\Schema;
use JsonSerializable;

abstract class Abstract_Rest_Item_Base implements JsonSerializable {
	protected const ITEM_NAME = '';

	private $schema = null;

	public function get_schema(): Schema {
		if ( ! ( $this->schema instanceof Schema ) ) {
			return $this->schema;
		}

		$schema_dir   = dirname( dirname( dirname( __DIR__ ) ) ) . '/schema';
		$this->schema = Schema::load( $schema_dir . '/' . $this->get_item_name() . '.json' );

		return $this->schema;
	}

	private function get_item_name(): string {
		if ( static::ITEM_NAME ) {
			return static::ITEM_NAME;
		}

		$called_class = explode( '\\', get_called_class() );
		return strtolower( array_pop( $called_class ) );
	}

	public function jsonSerialize(): array {
		$value = $this->get_schema()->process( $this );
		return json_decode( wp_json_encode( $value ), true );
	}
}
