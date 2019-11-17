<?php
/**
 * Menu Item
 *
 * @project Sujinc.com
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
*/

namespace Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Items;

use WP_Post;

final class Menu extends Abstract_Rest_Item_Base {
	public $ID;
	public $title;
	public $url;
	public $target;
	public $menu_item_parent;
	public $menu_order;
	public $classes  = array();
	public $children = array(); // Array of Menu

	/**
	 * Create MenuItem from WP_Post
	*/
	public function __construct( WP_Post $post ) {
		$this_keys = array_keys( get_object_vars( $this ) );

		foreach ( $this_keys as $key ) {
			if ( property_exists( $post, $key ) ) {
				$this->$key = $post->$key;
			}
		}
	}

	public function append_children( Menu $child ) {
		$this->children[] = $child;
	}
}
