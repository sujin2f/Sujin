<?php
namespace Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Sujin\V1\Flickr;

use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Sujin\V1\Flickr;
use Sujin\Wordpress\WP_Express\Fields\Settings\Input;
use Sujin\Wordpress\Theme\Sujin\Transient;

use Test_Case;
use WP_REST_Request;

class Unit_Test extends Test_Case {
	private $object;
	private $flickr_id;

	public function setUp() {
		parent::setUp();
		$this->mock_request();

		$this->object    = new Flickr();
		$this->flickr_id = Input::get_instance( Flickr::FLICKR_ID )->get_id();

		do_action( 'rest_api_init' );
	}

	public function test_request() {
		// Empty Setting
		global $wp_rest_server;

		$request = WP_REST_Request::from_url( rest_url( '/sujin/v1/flickr' ) );
		$request->set_method( 'GET' );
		$request->add_header( 'content-type', 'application/json' );
		$response = $wp_rest_server->dispatch( $request );

		$this->assertEquals(
			$response->get_data(),
			$this->get_error_response( $this->call_private_method( $this->object, 'error_no_id' ) )
		);

		// Request Fail
		update_option( $this->flickr_id, 'fail' );
		$response = $wp_rest_server->dispatch( $request );
		$this->assertEquals(
			$response->get_data(),
			$this->get_error_response( $this->call_private_method( $this->object, 'error_request_fail' ) )
		);

		// Setting Exist
		update_option( $this->flickr_id, 'test' );
		$response = $wp_rest_server->dispatch( $request );
		$this->assertEquals( 12, count( $response->get_data() ) );

		$expected = array( 'link', 'media', 'title' );
		$keys     = array_keys( $response->get_data()[0] );
		sort( $keys );
		$this->assertEquals( $expected, $keys );

		// Setting Changed: Transient
		$transient_key = $this->call_private_method( $this->object, 'get_transient_key' );
		$before        = Transient::get_transient( $transient_key );

		update_option( $this->flickr_id, 'test2' );
		$after = Transient::get_transient( $transient_key );

		$this->assertNotEquals( $before, $after );
		$this->assertEmpty( $after );
	}
}
