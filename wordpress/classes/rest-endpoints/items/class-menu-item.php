<?php
/**
 * Menu Item RESTful API Item
 *
 * @package sujinc.com
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Items;

use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Items;
use WP_Post;

/**
 * Menu Item RESTful API Item
 */
class Menu_Item extends Items {
	/**
	 * WordPress ID
	 *
	 * @var int
	 */
	public $ID;

	/**
	 * Menu title
	 *
	 * @var string
	 */
	public $title;

	/**
	 * Destination URL
	 *
	 * @var string
	 */
	public $url;

	/**
	 * Target attribute
	 *
	 * @var '_blank' | '_self'
	 */
	public $target;

	/**
	 * Parent ID
	 *
	 * @var int
	 */
	public $parent;

	/**
	 * Class attributes
	 *
	 * @var string[]
	 */
	public $classes = array();

	/**
	 * Sub-menus
	 *
	 * @var Menu[]
	 */
	public $children = array();

	protected const ITEM_NAME = 'menu-item';

	/**
	 * Constructor
	 *
	 * @param      string   $name      Name of the instance.
	 * @param      ?WP_Post $menu_item Post object of the menu item.
	 * @visibility protected
	 */
	protected function __construct( string $name, ?WP_Post $menu_item = null ) {
		parent::__construct( $name );

		if ( ! $menu_item ) {
			return;
		}

		$this->ID      = $menu_item->ID;
		$this->title   = $menu_item->title;
		$this->url     = $menu_item->url;
		$this->target  = $menu_item->target;
		$this->parent  = $menu_item->menu_item_parent;
		$this->classes = $menu_item->classes;
	}

	/**
	 * Append child menu item into the children
	 *
	 * @param Menu_Item $child Menu item to attach.
	 */
	public function append_children( Menu_Item $child ): void {
		$this->children[] = $child;
	}
}
