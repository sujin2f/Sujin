<?php
namespace Sujin\Wordpress\Theme\Sujin\Tests\Unit\Rest_Endpoints\Sujin\V1;

use Sujin\Wordpress\Theme\Sujin\Tests\Unit\Test_Case;
use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Sujin\V1\Menu;
use Sujin\Wordpress\Theme\Sujin\Transient;
use WP_REST_Request;

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

	private function update_nav_menu( int $menu_id, int $parent_id ): void {
		wp_update_nav_menu_item(
			$menu_id,
			0,
			array(
				'menu-item-title'     => 'Home',
				'menu-item-classes'   => 'home',
				'menu-item-url'       => home_url( '/' ),
				'menu-item-status'    => 'publish',
				'menu-item-parent-id' => $parent_id,
			)
		);

		wp_update_nav_menu_object( $menu_id, array( 'menu-name' => 'Main Menu' ) );
	}

	public function test_request() {
		// Request
		$menu_id = $this->create_nav_menu();
		$request = new WP_REST_Request( 'GET', '' );
		$request->set_param( 'menu', 'main' );

		$actual = $this->object->get_items( $request )->get_data();
		$this->assertEquals( 'Home', $actual[0]['title'] );
		$this->assertEquals( 'http://example.org/', $actual[0]['url'] );

		$menu_item_id = $actual[0]['ID'];

		// Request -- doesn't exist
		$request->set_param( 'menu', 'main2' );
		$actual = $this->object->get_items( $request );
		$this->assertEquals( $actual, $this->call_private_method( $this->object, 'error_no_menu' ) );

		// Menu Changed: Transient
		$transient_key = $this->call_private_method( $this->object, 'get_transient_key', array( 'main' ) );
		$before        = Transient::get_transient( $transient_key );

		$this->update_nav_menu( $menu_id, $menu_item_id );
		$request->set_param( 'menu', 'main' );
		$this->object->get_items( $request );

		$after = Transient::get_transient( $transient_key );
		$this->assertNotEquals( $before, $after );

		// Children
		$this->assertEquals( 'Home', $after->items[0]['children'][0]['title'] );
		$this->assertEquals( 'http://example.org/', $after->items[0]['children'][0]['url'] );
	}
}
