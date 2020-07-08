<?php // phpcs:ignore WordPress.Files.FileName.InvalidClassFileName
/**
 * Images Rest Item Unit Test
 *
 * @package sujinc.com
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Items\Images;

use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Items\Images;

use Test_Case_Theme_Sujin;
use Data_Attachment;

/**
 * Images Rest Item Unit Test
 */
class Unit_Test extends Test_Case_Theme_Sujin {
	/**
	 * Test object construction and Schema validator
	 */
	public function test_schema_decode(): void {
		$attachment = new Data_Attachment( $this->factory );
		$images     = array(
			new Images( $attachment->attachment_01->ID ),
			new Images( $attachment->attachment_02->ID ),
		);
		$images     = json_decode( wp_json_encode( $images ), true );

		foreach ( $images as $image ) {
			$this->assertEquals(
				array( 'large', 'medium', 'small', 'tiny' ),
				array_keys( $image )
			);
		}
	}
}
