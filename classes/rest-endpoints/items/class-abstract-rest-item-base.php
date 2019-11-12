<?php
namespace Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Items;

use RuntimeException, IteratorAggregate, ArrayIterator;

abstract class Abstract_Rest_Item_Base implements IteratorAggregate {
	public static function get_item_schema(): array {
		// This method should be overridden
		throw new RuntimeException( 'Unimplemented' );
	}

	public static function get_item_properties(): array {
		$properties = static::get_item_schema();
		$properties = $properties['properties'];
		return $properties;
	}

	public function getIterator(): ArrayIterator {
		return new ArrayIterator( static::get_item_properties() );
	}
}
