<?php // phpcs:ignore WordPress.Files.FileName.InvalidClassFileName
/**
 * Background Rest Controller Unit Test
 *
 * @package sujinc.com
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Sujin\V1\Background;

use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Sujin\V1\Background_Endpoint;

use Test_Case_Theme_Sujin;
use WP_REST_Request;
use Data_Attachment;

/**
 * Background Rest Controller Unit Test
 */
class Unit_Test extends Test_Case_Theme_Sujin {
	/**
	 * Prepare tests
	 */
	public function setUp(): void {
		parent::setUp();
		Background_Endpoint::get_instance();
		do_action( 'rest_api_init' );
	}

	/**
	 * Passed case
	 */
	public function test_request() {
		new Data_Attachment( $this->factory );

		global $wp_rest_server;

		$request = WP_REST_Request::from_url( rest_url( '/sujin/v1/background/random' ) );
		$request->set_method( 'GET' );
		$request->add_header( 'content-type', 'application/json' );
		$response = $wp_rest_server->dispatch( $request )->get_data();

		foreach ( $response as $item ) {
			$keys = array_keys( $item );
			sort( $keys );
			$this->assertEquals( array( 'desktop', 'mobile', 'title' ), $keys );
		}
	}

	/**
	 * Test Schema
	 */
	public function test_schema(): void {
		global $wp_rest_server;

		$request = WP_REST_Request::from_url( rest_url( '/sujin/v1/background/random' ) );
		$request->set_method( 'OPTIONS' );
		$request->add_header( 'content-type', 'application/json' );
		$response = $wp_rest_server->dispatch( $request )->get_data();

		$json = file_get_contents( SJ_BASE__DIR . '/.configs/schema/response/background.json' ); // phpcs:ignore
		$json = json_decode( $json, true );
		$this->assertEquals( $json, $response['schema'] );
	}
}
