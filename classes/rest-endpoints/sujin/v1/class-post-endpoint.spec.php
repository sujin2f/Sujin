<?php // phpcs:ignore WordPress.Files.FileName.InvalidClassFileName
/**
 * Post Rest Controller Unit Test
 *
 * @package sujinc.com
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Sujin\V1\Post;

use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Sujin\V1\Post_Endpoint;

use Test_Case_Theme_Sujin;
use WP_REST_Request;
use Data_Post;

/**
 * Post Rest Controller Unit Test
 */
class Unit_Test extends Test_Case_Theme_Sujin {
	/**
	 * Post_Endpoint
	 *
	 * @var Post_Endpoint
	 */
	private $object;

	/**
	 * Prepare tests
	 */
	public function setUp(): void {
		parent::setUp();
		$this->object = Post_Endpoint::get_instance();
		do_action( 'rest_api_init' );
	}

	/**
	 * Failure case
	 */
	public function test_sinlge_failed_request() {
		global $wp_rest_server;

		$request = WP_REST_Request::from_url( rest_url( '/sujin/v1/post/test' ) );
		$request->set_method( 'GET' );
		$request->add_header( 'content-type', 'application/json' );
		$response = $wp_rest_server->dispatch( $request );

		$this->assertEquals(
			$response->get_data(),
			$this->get_error_response( $this->call_private_method( $this->object, 'error_not_found_post' ) )
		);
	}

	/**
	 * Passed case
	 */
	public function test_sinlge_request() {
		$post = new Data_Post( $this->factory );

		global $wp_rest_server;

		$request = WP_REST_Request::from_url( rest_url( '/sujin/v1/post/' . $post->post_main->post_name ) );
		$request->set_method( 'GET' );
		$request->add_header( 'content-type', 'application/json' );
		$response = $wp_rest_server->dispatch( $request )->get_data();

		$this->assertEquals( $post->post_main->ID, $response['id'] );
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

		// Simple Post.
		$this->assertTrue(
			! is_null( $response['series'][0]['id'] ),
			'id in Simple Post does not exist.',
		);
		$this->assertTrue(
			! is_null( $response['series'][0]['slug'] ),
			'slug in Simple Post does not exist.',
		);
		$this->assertTrue(
			! is_null( $response['series'][0]['title'] ),
			'title in Simple Post does not exist.',
		);
		$this->assertTrue(
			! is_null( $response['series'][0]['excerpt'] ),
			'excerpt in Simple Post does not exist.',
		);
		$this->assertTrue(
			! is_null( $response['series'][0]['date'] ),
			'date in Simple Post does not exist.',
		);
		$this->assertTrue(
			! is_null( $response['series'][0]['link'] ),
			'link in Simple Post does not exist.',
		);
		$this->assertTrue(
			! is_null( $response['series'][0]['tags'] ),
			'tags in Simple Post does not exist.',
		);
		$this->assertTrue(
			! is_null( $response['series'][0]['thumbnail'] ),
			'thumbnail in Simple Post does not exist.',
		);
		$this->assertTrue(
			! is_null( $response['series'][0]['meta'] ),
			'meta in Simple Post does not exist.',
		);
	}

	/**
	 * Test Schema
	 */
	public function test_schema(): void {
		global $wp_rest_server;

		$request = WP_REST_Request::from_url( rest_url( '/sujin/v1/post/test' ) );
		$request->set_method( 'OPTIONS' );
		$request->add_header( 'content-type', 'application/json' );
		$response = $wp_rest_server->dispatch( $request )->get_data();

		$json = file_get_contents( SJ_BASE__DIR . '/.configs/schema/response/post.json' ); // phpcs:ignore
		$json = json_decode( $json, true );
		$this->assertEquals( $json, $response['schema'] );
	}
}
