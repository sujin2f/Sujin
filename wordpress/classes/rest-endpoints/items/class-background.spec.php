<?php // phpcs:ignore WordPress.Files.FileName.InvalidClassFileName
/**
 * Background Rest Item Unit Test
 *
 * @package sujinc.com
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Items\Background;

use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Items\Background;

use Test_Case_Theme_Sujin;
use Data_Attachment;

/**
 * Archive Rest Item Unit Test
 */
class Unit_Test extends Test_Case_Theme_Sujin {
	/**
	 * Test object construction and Schema validator
	 */
	public function test_schema_decode(): void {
		$attachment = new Data_Attachment( $this->factory );
		$posts      = array(
			Background::get_instance( 'background-01', $attachment->attachment_01 ),
			Background::get_instance( 'background-02', $attachment->attachment_02 ),
		);
		$response   = json_decode( wp_json_encode( $posts ), true );

		$this->assertEquals(
			2,
			count( $response ),
		);
	}
}
