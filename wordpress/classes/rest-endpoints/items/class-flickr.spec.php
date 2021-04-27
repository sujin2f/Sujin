<?php // phpcs:ignore WordPress.Files.FileName.InvalidClassFileName
/**
 * Flickr Rest Item Unit Test
 *
 * @package sujinc.com
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Items\Flickr;

use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Items\Flickr;

use Test_Case_Theme_Sujin;
use Data_Flickr;

/**
 * Flickr Rest Item Unit Test
 */
class Unit_Test extends Test_Case_Theme_Sujin {
	/**
	 * Test object construction and Schema validator
	 */
	public function test_schema_decode(): void {
		$flickr = new Data_Flickr();
		$items  = array();

		foreach ( $flickr->items as $index => $item ) {
			$items[] = Flickr::get_instance(
				'flickr-' . $index,
				$item,
			);
		}

		$items = json_decode( wp_json_encode( $items ), true );

		foreach ( $items as $item ) {
			$this->assertEquals(
				array( 'title', 'link', 'media' ),
				array_keys( $item )
			);
		}
	}
}
