<?php
/**
 * Test data -- Nav Menu
 *
 * @package sujinc.com
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

/**
 * Test data -- Nav Menu
 */
class Data_Nav_Menu {
	/**
	 * Nav menu ID
	 *
	 * @var int
	 */
	public $nav_menu_id;

	/**
	 * Nav menu
	 *
	 * @var array
	 */
	public $nav_menu;

	/**
	 * Constructor
	 */
	public function __construct() {
		$menu_name     = 'Main Menu';
		$menu_location = 'main';
		$menu_id       = wp_create_nav_menu( $menu_name );

		wp_update_nav_menu_item(
			$menu_id,
			0,
			array(
				'menu-item-title'   => 'Home',
				'menu-item-classes' => 'home',
				'menu-item-url'     => home_url( '/' ),
				'menu-item-status'  => 'publish',
			)
		);

		wp_update_nav_menu_item(
			$menu_id,
			0,
			array(
				'menu-item-title'   => 'Blog',
				'menu-item-classes' => 'blog',
				'menu-item-url'     => home_url( '/category/blog' ),
				'menu-item-status'  => 'publish',
			)
		);

		$locations                   = get_theme_mod( 'nav_menu_locations' );
		$locations[ $menu_location ] = $menu_id;
		set_theme_mod( 'nav_menu_locations', $locations );

		$this->nav_menu_id = $menu_id;
		$this->nav_menu    = wp_get_nav_menu_items( $menu_id );
	}

	/**
	 * Add child menu
	 */
	public function add_child(): void {
		wp_update_nav_menu_item(
			$this->nav_menu_id,
			0,
			array(
				'menu-item-title'     => 'Home',
				'menu-item-classes'   => 'home',
				'menu-item-url'       => home_url( '/' ),
				'menu-item-status'    => 'publish',
				'menu-item-parent-id' => $this->nav_menu[0]->ID,
			)
		);

		wp_update_nav_menu_object( $this->nav_menu_id, array( 'menu-name' => 'Main Menu' ) );

	}
}
