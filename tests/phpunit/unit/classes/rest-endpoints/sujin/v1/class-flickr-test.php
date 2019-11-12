<?php
namespace Sujin\Wordpress\Theme\Sujin\Tests\Unit\Rest_Endpoints\Sujin\V1;

use Sujin\Wordpress\Theme\Sujin\Tests\Unit\Test_Case;
use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Sujin\V1\Flickr;
use Sujin\Wordpress\WP_Express\Fields\Settings\Input;
use Sujin\Wordpress\Theme\Sujin\Transient;

class Flickr_Test extends Test_Case {
	private $object;
	private $flickr_id;

	public function setUp() {
		parent::setUp();
		$this->mock_request();

		$this->object    = new Flickr();
		$this->flickr_id = Input::get_instance( Flickr::FLICKR_ID )->get_id();
	}

	public function test_request() {
		// Empty Setting
		$actual = $this->object->get_items( null );
		$this->assertEquals( $actual, $this->call_private_method( $this->object, 'error_no_id' ) );

		// Request Fail
		update_option( $this->flickr_id, 'fail' );
		$actual = $this->object->get_items( null );
		$this->assertEquals( $actual, $this->call_private_method( $this->object, 'error_request_fail' ) );

		// Setting Exist
		update_option( $this->flickr_id, 'test' );
		$actual = $this->object->get_items( null )->get_data();
		$this->assertEquals( 12, count( $actual ) );

		$expected = array( 'title', 'link', 'media' );
		$this->assertEquals( $expected, array_keys( $actual[0] ) );

		// Setting Changed
		$transient_key = $this->call_private_method( $this->object, 'get_transient_key' );
		$before        = Transient::get_transient( $transient_key );

		update_option( $this->flickr_id, 'test2' );
		$after = Transient::get_transient( $transient_key );

		$this->assertNotEquals( $before, $after );
		$this->assertEmpty( $after );
	}
}
