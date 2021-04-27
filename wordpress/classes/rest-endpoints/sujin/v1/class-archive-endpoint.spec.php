<?php // phpcs:ignore WordPress.Files.FileName.InvalidClassFileName
/**
 * Archive Rest Controller Unit Test
 *
 * @package sujinc.com
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Sujin\V1\Archive;

use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Sujin\V1\Archive_Endpoint;

use Test_Case_Theme_Sujin;
use WP_REST_Request;
use Data_Post;

/**
 * Archive Rest Controller Unit Test
 */
class Unit_Test extends Test_Case_Theme_Sujin {
	/**
	 * Archive_Endpoint
	 *
	 * @var Archive_Endpoint
	 */
	private $object;

	/**
	 * Prepare tests
	 */
	public function setUp(): void {
		parent::setUp();
		$this->object = Archive_Endpoint::get_instance();
		do_action( 'rest_api_init' );
	}

	/**
	 * Failure Case
	 */
	public function test_archive_failed_request(): void {
		global $wp_rest_server;

		$request = WP_REST_Request::from_url( rest_url( '/sujin/v1/archive/category/portfolio/1' ) );
		$request->set_method( 'GET' );
		$request->add_header( 'content-type', 'application/json' );
		$response = $wp_rest_server->dispatch( $request );

		$this->assertEquals(
			$response->get_data(),
			$this->get_error_response( $this->call_private_method( $this->object, 'error_not_found_term', array( 'category' ) ) )
		);
	}

	/**
	 * Passed Case
	 */
	public function test_category_request(): void {
		$data_post = new Data_Post( $this->factory );

		global $wp_rest_server;

		$request = WP_REST_Request::from_url( rest_url( '/sujin/v1/archive/category/blog/1' ) );
		$request->set_method( 'GET' );
		$request->add_header( 'content-type', 'application/json' );
		$response = $wp_rest_server->dispatch( $request )->get_data();
		$response = $response['items'][0];

		$this->assertEquals( $data_post->post_main->ID, $response['id'] );
		$this->assertTrue( ! empty( $response['meta']['list'] ) );
		$this->assertTrue( ! empty( $response['prevNext']['prev'] ) );
		$this->assertTrue( ! empty( $response['related'] ) );
		$this->assertTrue( ! empty( $response['series'] ) );
		$this->assertTrue( ! empty( $response['tags'] ) );
		$this->assertEquals(
			$response['thumbnail'],
			array(
				'large'  => '',
				'medium' => '',
				'small'  => '',
				'tiny'   => '',
			),
		);
	}

	/**
	 * Test Schema
	 */
	public function test_schema(): void {
		global $wp_rest_server;

		$request = WP_REST_Request::from_url( rest_url( '/sujin/v1/archive/category/blog/1' ) );
		$request->set_method( 'OPTIONS' );
		$request->add_header( 'content-type', 'application/json' );
		$response = $wp_rest_server->dispatch( $request )->get_data();

		$json = file_get_contents( SJ_BASE__DIR . '/.configs/schema/response/archive.json' ); // phpcs:ignore
		$json = json_decode( $json, true );
		$this->assertEquals( $json, $response['schema'] );
	}
}
