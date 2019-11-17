<?php
namespace Sujin\Wordpress\Theme\Sujin\Tests\Unit\Rest_Endpoints\Sujin\V1;

use Sujin\Wordpress\Theme\Sujin\Tests\Unit\Test_Case;
use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Sujin\V1\Background;
use Sujin\Wordpress\WP_Express\Taxonomy;

use WP_REST_Request;

class Background_Test extends Test_Case {
	private $object;

	public function setUp() {
		parent::setUp();
		$this->object = new Background();
		do_action( 'rest_api_init' );
		Taxonomy::get_instance( 'Category' )->attach_to( 'attachment' );
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
			$this->assertEquals( array( 'title', 'desktop', 'mobile' ), array_keys( $item ) );
		}
	}
}
