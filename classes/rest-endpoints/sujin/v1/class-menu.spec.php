<?php
/**
 * Menu Rest Controller
 *
 * @package sujinc.com
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
*/

namespace Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Sujin\V1\Menu;

use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Sujin\V1\Menu;
use Sujin\Wordpress\WP_Express\Helpers\Transient;

use Test_Case;
use WP_REST_Request;

class Unit_Test extends Test_Case {
	private $object;

	public function setUp(): void {
		parent::setUp();
		$this->object = new Menu();
		do_action( 'rest_api_init' );

		add_filter( 'stylesheet_directory', array( $this, 'stylesheet_directory' ) );
	}

	public function stylesheet_directory() {
		return SJ_BASE__DIR;
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

		global $wp_rest_server;

		$request = WP_REST_Request::from_url( rest_url( '/sujin/v1/menu/main' ) );
		$request->set_method( 'GET' );
		$request->add_header( 'content-type', 'application/json' );
		$response = $wp_rest_server->dispatch( $request );

		$this->assertEquals( 'Home', $response->get_data()[0]['title'] );
		$this->assertEquals( 'http://example.org/', $response->get_data()[0]['url'] );

		$menu_item_id = $response->get_data()[0]['ID'];

		// Request -- doesn't exist
		$request = WP_REST_Request::from_url( rest_url( '/sujin/v1/menu/main2' ) );
		$request->set_method( 'GET' );
		$request->add_header( 'content-type', 'application/json' );
		$response = $wp_rest_server->dispatch( $request );

		$this->assertEquals(
			$response->get_data(),
			$this->get_error_response( $this->call_private_method( $this->object, 'error_no_menu' ) )
		);

		// Menu Changed: Transient
		$transient_key = $this->call_private_method( $this->object, 'get_transient_key', array( 'main' ) );
		$before        = Transient::get_transient( $transient_key );

		$this->update_nav_menu( $menu_id, $menu_item_id );
		$this->update_nav_menu( $menu_id, $menu_item_id );

		$request = WP_REST_Request::from_url( rest_url( '/sujin/v1/menu/main' ) );
		$request->set_method( 'GET' );
		$request->add_header( 'content-type', 'application/json' );
		$response = $wp_rest_server->dispatch( $request );

		$after = Transient::get_transient( $transient_key );
		$this->assertNotEquals( $before, $after );

		// Children
		$this->assertEquals( 'Home', $after->items[0]['children'][0]['title'] );
		$this->assertEquals( 'http://example.org/', $after->items[0]['children'][0]['url'] );
	}

	public function tearDown(): void {
		remove_filter( 'stylesheet_directory', array( $this, 'stylesheet_directory' ) );
	}
}
