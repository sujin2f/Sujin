<?php
namespace Sujin\Wordpress\Theme\Sujin\Tests\Unit\Rest_Endpoints\Sujin\V1;

use Sujin\Wordpress\Theme\Sujin\Tests\Unit\Test_Case;
use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Sujin\V1\Media;
use Sujin\Wordpress\Theme\Sujin\Transient;

class Media_Test extends Test_Case {
	private $object;

	public function setUp() {
		parent::setUp();
		$this->object = new Media();
	}

	private function create_media(): void {
	}

	public function test_request() {
		// Request
		// $actual = $this->object->get_items( null );
		// var_dump( $actual );
		/*
				$this->assertEquals( 'Home', $actual[0]['title'] );
				$this->assertEquals( 'http://example.org/', $actual[0]['url'] );

				$menu_item_id = $actual[0]['ID'];

				// Request -- doesn't exist
				$request->set_param( 'menu', 'main2' );
				$actual = $this->object->get_items( $request );
				$this->assertEquals( $actual, $this->call_private_method( $this->object, 'error_no_menu' ) );

				// Menu Changed: Transient
				$transient_key = $this->call_private_method( $this->object, 'get_transient_key', array( 'main' ) );
				$before        = Transient::get_transient( $transient_key );

				$this->update_nav_menu( $menu_id, $menu_item_id );
				$request->set_param( 'menu', 'main' );
				$this->object->get_items( $request );

				$after = Transient::get_transient( $transient_key );
				$this->assertNotEquals( $before, $after );

				// Children
				$this->assertEquals( 'Home', $after->items[0]['children'][0]['title'] );
				$this->assertEquals( 'http://example.org/', $after->items[0]['children'][0]['url'] );
		*/
	}
}
