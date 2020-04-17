<?php
/**
 * Menu Item
 *
 * @project Sujinc.com
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
*/

namespace Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Items;

use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Items;
use WP_Post;

final class Menu extends Items {
	public $ID;
	public $title;
	public $url;
	public $target;
	public $parent;
	public $classes  = array();
	public $children = array(); // Array of Menu

	/**
	 * Create MenuItem from WP_Post
	*/
	public function __construct( WP_Post $post ) {

		$this->ID      = $post->ID;
		$this->title   = $post->title;
		$this->url     = $post->url;
		$this->target  = $post->target;
		$this->parent  = $post->menu_item_parent;
		$this->classes = $post->classes;
	}

	public function append_children( Menu $child ) {
		$this->children[] = $child;
	}
}
