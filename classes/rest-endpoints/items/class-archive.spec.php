<?php // phpcs:ignore WordPress.Files.FileName.InvalidClassFileName
/**
 * Archive Rest Item Unit Test
 *
 * @package sujinc.com
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Items\Archive;

use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Items\Archive;
use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Items\Post;

use Test_Case;
use Test_Case_Theme_Sujin;
use Data_Post;
use Data_Taxonomy;
use Exception;

/**
 * Archive Rest Item Unit Test
 */
class Unit_Test extends Test_Case_Theme_Sujin {
	/**
	 * Test object construction and Schema validator
	 */
	public function test_schema_decode(): void {
		$posts      = new Data_Post( $this->factory );
		$taxonomies = new Data_Taxonomy();
		$archive    = Archive::get_instance( $taxonomies->category_blog->term_id );

		$archive->title       = 'Lorem ipsum dolor sit amet';
		$archive->description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
		$archive->total       = 2;
		$archive->totalPages  = 1; // phpcs:ignore WordPress.NamingConventions.ValidVariableName.NotSnakeCaseMemberVar

		$post_item = Post::get_instance( 'post-' . $posts->post_main->ID, $posts->post_main );
		$archive->append_item( $post_item );

		$post_item = Post::get_instance( 'post-' . $posts->post_past->ID, $posts->post_past );
		$archive->append_item( $post_item );

		$response = json_decode( wp_json_encode( $archive ), true );

		$this->assertEquals(
			2,
			count( $response['items'] ),
		);

		$this->assertEquals(
			'훈민정음',
			$response['items'][0]['title'],
		);

		$this->assertEquals(
			'MA GIRLS',
			$response['items'][1]['title'],
		);
	}

	/**
	 * Test object construction and Schema validator failure
	 */
	public function test_schema_decode_wrong_data_format(): void {
		$archive = Archive::get_instance( 'archive-failure' );

		$archive->title       = array( 'Lorem ipsum dolor sit amet' );
		$archive->description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
		$archive->total       = 2;
		$archive->totalPages  = 1; // phpcs:ignore WordPress.NamingConventions.ValidVariableName.NotSnakeCaseMemberVar

		try {
			json_decode( wp_json_encode( $archive ), true );
		} catch ( Exception $e ) {
			$this->assertEquals(
				'Array to string conversion',
				$e->getMessage()
			);
			return;
		}

		$this->assertTrue( false );
	}

	/**
	 * Test object construction and Schema validator conversion
	 */
	public function test_schema_decode_conversion(): void {
		$archive = Archive::get_instance( 'archive-conversion' );

		$archive->title       = 'Lorem ipsum dolor sit amet';
		$archive->description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
		$archive->total       = '2';
		$archive->totalPages  = '1'; // phpcs:ignore WordPress.NamingConventions.ValidVariableName.NotSnakeCaseMemberVar

		$response = json_decode( wp_json_encode( $archive ), true );
		$this->assertEquals( 'integer', gettype( $response['total'] ) );
		$this->assertEquals( 'integer', gettype( $response['totalPages'] ) );
	}
}
