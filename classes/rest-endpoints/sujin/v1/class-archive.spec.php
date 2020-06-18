<?php
/**
 * Archive Rest Controller Unit Test
 *
 * @package sujinc.com
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Sujin\V1\Archive;

use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Sujin\V1\Archive;
use Sujin\Wordpress\Theme\Sujin\Helpers\Transient;

use Sujin\Wordpress\WP_Express\Fields\Post_Meta\{Attachment, Input, Checkbox};
use Sujin\Wordpress\WP_Express\Taxonomy;

use Test_Case;
use WP_REST_Request;

class Unit_Test extends Test_Case {
	private $object;

	private $post_01;
	private $post_02;

	public function setUp(): void {
		parent::setUp();
		$this->object = Archive::get_instance();
		register_taxonomy( 'series', 'post' );
		do_action( 'rest_api_init' );

		add_filter( 'stylesheet_directory', array( $this, 'stylesheet_directory' ) );
	}

	public function stylesheet_directory() {
		return SJ_BASE__DIR;
	}

	public function test_archive_failed_request() {
		global $wp_rest_server;

		$request = WP_REST_Request::from_url( rest_url( '/sujin/v1/archive/category/portfolio' ) );
		$request->set_method( 'GET' );
		$request->add_header( 'content-type', 'application/json' );
		$response = $wp_rest_server->dispatch( $request );

		$this->assertEquals(
			$response->get_data(),
			$this->get_error_response( $this->call_private_method( $this->object, 'error_not_found_term', array( 'category' ) ) )
		);
	}

	private function register_posts(): void {
		$this->post_01 = $this->factory->post->create_and_get( array( 'post_title' => '김조광수 감독의 교훈 없는 승리' ) );
		$this->post_02 = $this->factory->post->create_and_get( array( 'post_date' => '1997-01-02' ) );
		$attachment_id = $this->factory->attachment->create_upload_object( DIR_TESTDATA . '/images/test-image.png', 0 );

		// Assign Tags
		wp_set_post_terms( $this->post_01->ID, array( 'tag01', 'tag02' ) );
		wp_set_post_terms( $this->post_02->ID, array( 'tag01', 'tag02' ) );

		// Assign Category
		$undefined = wp_insert_term( 'Undefined', 'category' );
		wp_set_post_terms( $this->post_01->ID, array( $undefined['term_id'] ), 'category' );
		wp_set_post_terms( $this->post_02->ID, array( $undefined['term_id'] ), 'category' );

		// Assign Series
		wp_set_post_terms( $this->post_01->ID, array( 'series' ), 'series' );
		wp_set_post_terms( $this->post_02->ID, array( 'series' ), 'series' );

		// Assign Meta
		update_post_meta( $this->post_01->ID, Attachment::get_instance( 'List' )->get_id(), $attachment_id );
		update_post_meta( $this->post_01->ID, Attachment::get_instance( 'Icon' )->get_id(), $attachment_id );
		update_post_meta( $this->post_01->ID, Attachment::get_instance( 'Title' )->get_id(), $attachment_id );
		update_post_meta( $this->post_01->ID, Attachment::get_instance( 'Background' )->get_id(), $attachment_id );
		update_post_meta( $this->post_01->ID, Attachment::get_instance( 'Thumbnail' )->get_id(), $attachment_id );
		update_post_meta( $this->post_01->ID, Attachment::get_instance( 'Use Background Color' )->get_id(), true );
		update_post_meta( $this->post_01->ID, Attachment::get_instance( 'Background Color' )->get_id(), '#970000' );
	}

	public function test_category_request() {
		$this->register_posts();

		global $wp_rest_server;

		$request = WP_REST_Request::from_url( rest_url( '/sujin/v1/archive/category/undefined' ) );
		$request->set_method( 'GET' );
		$request->add_header( 'content-type', 'application/json' );
		$response = $wp_rest_server->dispatch( $request )->get_data();
		$response = $response['items'][0];

		$this->assertEquals( $this->post_01->ID, $response['id'] );
		$this->assertTrue( ! empty( $response['meta']['list'] ) );
		$this->assertTrue( ! empty( $response['prevNext']['prev'] ) );
		$this->assertTrue( ! empty( $response['related'] ) );
		$this->assertTrue( ! empty( $response['series'] ) );
		$this->assertTrue( ! empty( $response['tags'] ) );
		$this->assertTrue( empty( $response['thumbnail'] ) );
	}

	public function tearDown(): void {
		remove_filter( 'stylesheet_directory', array( $this, 'stylesheet_directory' ) );
	}
}
