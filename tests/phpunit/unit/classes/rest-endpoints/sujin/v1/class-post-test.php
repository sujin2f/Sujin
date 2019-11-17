<?php
/**
 * Menu Rest Controller
 *
 * @project Sujinc.com
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
*/

namespace Sujin\Wordpress\Theme\Sujin\Tests\Unit\Rest_Endpoints\Sujin\V1;

use Sujin\Wordpress\Theme\Sujin\Tests\Unit\Test_Case;
use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Sujin\V1\Posts;
use Sujin\Wordpress\Theme\Sujin\Transient;
use WP_REST_Request;

class Post_Test extends Test_Case {
	private $object;

	public function setUp() {
		parent::setUp();
		$this->object = new Posts();
		do_action( 'rest_api_init' );
	}

	public function test_failed_request() {
		global $wp_rest_server;

		$request = WP_REST_Request::from_url( rest_url( '/sujin/v1/posts' ) );
		$request->set_method( 'GET' );
		$request->add_header( 'content-type', 'application/json' );
		$request->set_param( 'slug', 'test' );
		$response = $wp_rest_server->dispatch( $request );

		var_dump($response->get_data());
	}
}
