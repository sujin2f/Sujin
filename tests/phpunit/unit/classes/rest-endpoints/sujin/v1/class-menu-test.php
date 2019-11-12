<?php
namespace Sujin\Wordpress\Theme\Sujin\Tests\Unit\Rest_Endpoints\Sujin\V1;

use Sujin\Wordpress\Theme\Sujin\Tests\Unit\Test_Case;
use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Sujin\V1\Menu;
use Sujin\Wordpress\Theme\Sujin\Transient;

class Menu_Test extends Test_Case {
	private $object;

	public function setUp() {
		parent::setUp();
		$this->object = new Menu();
	}

	private function create_nav_menu(): int {
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

		$locations                   = get_theme_mod( 'nav_menu_locations' );
		$locations[ $menu_location ] = $menu_id;
		set_theme_mod( 'nav_menu_locations', $locations );

		return $menu_id;
	}

	private function update_nav_menu( int $menu_id ) {
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

		wp_update_nav_menu_object( $menu_id, array( 'menu-name' => 'Main Menu' ) );
	}

	public function test_request() {
		$menu_id = $this->create_nav_menu();
		$this->update_nav_menu( $menu_id );

		/*
				$locations = get_nav_menu_locations();
				var_dump($locations);
		*/

		$this->assertEquals( '', '' );
	}
}
