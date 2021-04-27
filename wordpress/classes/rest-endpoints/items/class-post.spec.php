<?php // phpcs:ignore WordPress.Files.FileName.InvalidClassFileName
/**
 * Post Rest Item Unit Test
 *
 * @package sujinc.com
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Items\Post;

use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Items\Post;

use Test_Case_Theme_Sujin;
use Data_Post;

/**
 * Post Rest Item Unit Test
 */
class Unit_Test extends Test_Case_Theme_Sujin {
	/**
	 * Test object construction and Schema validator
	 */
	public function test_schema_decode(): void {
		$data = new Data_Post( $this->factory );
		$post = Post::get_instance( 'post-01', $data->post_main );
		$post = json_decode( wp_json_encode( $post ), true );

		$this->assertEquals(
			'ma-girls',
			$post['series'][1]['slug'],
		);
		$this->assertEquals(
			'ma-girls',
			$post['prevNext']['prev']['slug'],
		);
		$this->assertEquals(
			null,
			$post['prevNext']['next'],
		);
		$this->assertEquals(
			array(
				array(
					'tag'  => 'h2',
					'text' => '훈민정음',
				),
			),
			$post['toc'],
		);
		$this->assertEquals(
			'http://example.org/wp-content/uploads/',
			substr( $post['meta']['list']['large'], 0, 38 ),
		);
		$this->assertEquals(
			true,
			$post['meta']['useBackgroundColor'],
		);
		$this->assertEquals(
			'#970000',
			$post['meta']['backgroundColor'],
		);
		$this->assertEquals(
			'WordPress',
			$post['tags'][0]['name'],
		);
	}
}
