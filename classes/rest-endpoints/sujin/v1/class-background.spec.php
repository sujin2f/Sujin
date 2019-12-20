<?php
namespace Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Sujin\V1\Background;

use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Sujin\V1\Background;
use Sujin\Wordpress\WP_Express\Taxonomy;

use Test_Case;
use WP_REST_Request;

class Unit_Test extends Test_Case {
	private $object;

	public function setUp(): void {
		parent::setUp();
		$this->object = new Background();
		do_action( 'rest_api_init' );
		Taxonomy::get_instance( 'Category' )->attach_to( 'attachment' );

		add_filter( 'stylesheet_directory', array( $this, 'stylesheet_directory' ) );
	}

	public function stylesheet_directory() {
		return SJ_BASE__DIR;
	}

	private function create_attachment(): void {
		wp_insert_term( 'Background', 'category' );

		$attachment_id = $this->factory->attachment->create_upload_object( DIR_TESTDATA . '/images/test-image.png', 0 );
		wp_set_object_terms( $attachment_id, 'background', 'category' );

		$attachment_id = $this->factory->attachment->create_upload_object( DIR_TESTDATA . '/images/canola.jpg', 0 );
		wp_set_object_terms( $attachment_id, 'background', 'category' );
	}

	public function test_request() {
		global $wp_rest_server;

		$this->create_attachment();

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

	public function tearDown(): void {
		remove_filter( 'stylesheet_directory', array( $this, 'stylesheet_directory' ) );
	}
}
