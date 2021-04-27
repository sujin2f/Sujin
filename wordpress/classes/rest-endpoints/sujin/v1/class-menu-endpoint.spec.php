<?php // phpcs:ignore WordPress.Files.FileName.InvalidClassFileName
/**
 * Menu Rest Controller Unit Test
 *
 * @package sujinc.com
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */
namespace Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Sujin\V1\Menu;

use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Sujin\V1\Menu_Endpoint;
use Sujin\Wordpress\WP_Express\Helpers\Transient;

use Test_Case_Theme_Sujin;
use WP_REST_Request;
use Data_Nav_Menu;

/**
 * Menu Rest Controller Unit Test
 */
class Unit_Test extends Test_Case_Theme_Sujin {
	/**
	 * Menu_Endpoint
	 *
	 * @var Menu_Endpoint
	 */
	private $object;

	/**
	 * Prepare tests
	 */
	public function setUp(): void {
		parent::setUp();
		$this->object = Menu_Endpoint::get_instance();
		do_action( 'rest_api_init' );
	}

	/**
	 * Test single case
	 */
	public function test_passed_request(): void {
		new Data_Nav_Menu();
		global $wp_rest_server;

		$request = WP_REST_Request::from_url( rest_url( '/sujin/v1/menu/main' ) );
		$request->set_method( 'GET' );
		$request->add_header( 'content-type', 'application/json' );
		$response = $wp_rest_server->dispatch( $request );

		$this->assertEquals( 'Home', $response->get_data()[0]['title'] );
		$this->assertEquals( 'http://example.org/', $response->get_data()[0]['url'] );
	}

	/**
	 * Test failure case
	 */
	public function test_failure_request(): void {
		new Data_Nav_Menu();
		global $wp_rest_server;

		$request = WP_REST_Request::from_url( rest_url( '/sujin/v1/menu/main2' ) );
		$request->set_method( 'GET' );
		$request->add_header( 'content-type', 'application/json' );
		$response = $wp_rest_server->dispatch( $request );

		$this->assertEquals(
			$response->get_data(),
			$this->get_error_response( $this->call_private_method( $this->object, 'error_no_menu' ) )
		);
	}

	/**
	 * Test transient
	 */
	public function test_menu_changed(): void {
		$data_nav_menu = new Data_Nav_Menu();
		global $wp_rest_server;

		$transient_key = $this->call_private_method( $this->object, 'get_transient_key' ) . '-main';
		$before        = Transient::get_transient( $transient_key );

		$data_nav_menu->add_child();

		$request = WP_REST_Request::from_url( rest_url( '/sujin/v1/menu/main' ) );
		$request->set_method( 'GET' );
		$request->add_header( 'content-type', 'application/json' );
		$wp_rest_server->dispatch( $request );

		$after = Transient::get_transient( $transient_key );
		$this->assertNotEquals( $before, $after );

		// Children.
		$this->assertEquals( 'Home', $after->items[0]['children'][0]['title'] );
		$this->assertEquals( 'http://example.org/', $after->items[0]['children'][0]['url'] );
	}

	/**
	 * Test Schema
	 */
	public function test_schema(): void {
		global $wp_rest_server;

		$request = WP_REST_Request::from_url( rest_url( '/sujin/v1/menu/main' ) );
		$request->set_method( 'OPTIONS' );
		$request->add_header( 'content-type', 'application/json' );
		$response = $wp_rest_server->dispatch( $request )->get_data();

		$json = file_get_contents( SJ_BASE__DIR . '/.configs/schema/response/menu-item.json' ); // phpcs:ignore
		$json = json_decode( $json, true );
		$this->assertEquals( $json, $response['schema'] );
	}
}
