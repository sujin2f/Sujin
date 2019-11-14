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
	public $children = array(); // Array of Menu

	// Make MenuItem from WP_Post
	public function __construct( WP_Post $post ) {
		// Iterate properites
		foreach ( get_object_vars( $post ) as $key => $value ) {
			if ( property_exists( $this, $key ) ) {
				$this->$key = $post->$key;
			}
		}
	}

	public function append_children( Menu $child ) {
		$this->children[] = $child;
	}
}
