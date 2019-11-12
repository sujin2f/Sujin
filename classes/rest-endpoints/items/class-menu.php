<?php
namespace Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Items;

use WP_Post;

class Menu extends Abstract_Rest_Item_Base {
	public $ID;
	public $title;
	public $url;
	public $target;
	public $menu_item_parent;
	public $menu_order;
	public $classes  = array();
	public $children = array(); // Array of MenuItem

	// Make MenuItem from WP_Post
	public function __construct( WP_Post $post ) {
		$properties = array_keys( self::get_item_properties() );
		foreach ( get_object_vars( $post ) as $key => $value ) {
			if ( in_array( $key, $properties, true ) ) {
				$this->$key = $value;
			}
		}
	}

	public function append_children( MenuItem $child ) {
		$this->children[] = $child;
	}

	public static function get_item_schema(): array {
		return array(
			'$schema'    => 'http://json-schema.org/draft-04/schema#',
			'title'      => 'media',
			'type'       => 'object',
			'properties' => array(
				'ID'               => array(
					'description' => 'Unique ID',
					'type'        => 'integer',
					'context'     => array( 'view', 'edit', 'embed' ),
					'readonly'    => true,
				),
				'title'            => array(
					'description' => 'The title of the menu item.',
					'type'        => 'string',
					'context'     => array( 'view', 'edit', 'embed' ),
					'readonly'    => true,
				),
				'url'              => array(
					'description' => 'Link URL',
					'type'        => 'string',
					'context'     => array( 'view', 'edit', 'embed' ),
					'readonly'    => true,
				),
				'target'           => array(
					'description' => 'Link target',
					'type'        => 'string',
					'context'     => array( 'view', 'edit', 'embed' ),
					'readonly'    => true,
				),
				'menu_item_parent' => array(
					'description' => 'Parent ID',
					'type'        => 'integer',
					'context'     => array( 'view', 'edit', 'embed' ),
					'readonly'    => true,
				),
				'classes'          => array(
					'description' => 'HTML class',
					'type'        => 'array',
					'context'     => array( 'view', 'edit', 'embed' ),
					'readonly'    => true,
				),
				'children'         => array(
					'type' => 'array',
				),
			),
		);
	}
}
