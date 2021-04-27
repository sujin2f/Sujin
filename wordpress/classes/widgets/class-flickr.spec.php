<?php // phpcs:ignore WordPress.Files.FileName.InvalidClassFileName
/**
 * Flickr Widget Unit Test
 *
 * @package sujinc.com
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */
namespace Sujin\Wordpress\Theme\Sujin\Widgets\Flickr;

use Test_Case_Theme_Sujin;
use Sujin\Wordpress\Theme\Sujin\Widgets\Flickr;

/**
 * Flickr Widget Unit Test
 */
class Unit_Test extends Test_Case_Theme_Sujin {
	/**
	 * Passed case
	 */
	public function test_shortcode(): void {
		$this->mock_request();
		$object = Flickr::get_instance();
		$actual = $object->widget(
			array(
				'id'    => 'test',
				'title' => 'title',
			),
			array(),
		);

		$this->assertEquals( $actual['widget'], 'flickr' );
		$this->assertEquals( $actual['title'], 'title' );
		$this->assertEquals( count( $actual['items'] ), 12 );
	}

	/**
	 * Failed case: ID is null
	 */
	public function test_shortcode_id_null(): void {
		$this->mock_request();
		$object = Flickr::get_instance();
		$actual = $object->widget(
			array(
				'title' => 'title',
			),
			array(),
		);

		$this->assertNull( $actual );
	}

	/**
	 * Failed case: request failed
	 */
	public function test_shortcode_request_failed(): void {
		$this->mock_request();
		$object = Flickr::get_instance();
		$actual = $object->widget(
			array(
				'id'    => 'flickr',
				'title' => 'title',
			),
			array(),
		);

		$this->assertNull( $actual );
	}
}
