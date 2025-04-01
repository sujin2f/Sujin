<?php
/**
 * Modifying Post Type
 *
 * @package sujinc.com
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Theme\Modifier;

use Sujin\Wordpress\WP_Express\Helpers\Trait_Singleton;

use Sujin\Wordpress\WP_Express\Post_Type;
use Sujin\Wordpress\WP_Express\Meta_Box;
use Sujin\Wordpress\WP_Express\Fields\Post_Meta\{
	Input,
	Attachment,
	Checkbox,
};
use Sujin\Theme\Plugins\GraphQL;

/**
 * Modifying Post Type
 *
 * @codeCoverageIgnore
 */
class Post {
	use Trait_Singleton;

	/**
	 * Constructor
	 * - Image metabox
	 *
	 * @visibility protected
	 */
	protected function __construct() {
		add_action( 'save_post', array( $this, 'post_updated' ), 100, 2 );
		add_action( 'edit_attachment', array( $this, 'attachment_updated' ), 100, 1 );

		Meta_Box::get_instance( 'Images' )
			->append_to( Post_Type::get_instance( 'Post' ) )
			->append_to( Post_Type::get_instance( 'Page' ) )
			->append( Attachment::get_instance( 'List' ) )
			->append( Attachment::get_instance( 'Icon' ) )
			->append( Attachment::get_instance( 'Title' ) )
			->append( Attachment::get_instance( 'Background' ) )
			->append( Checkbox::get_instance( 'Use Background Color' ) )
			->append( Input::get_instance( 'Background Color' )->type( 'color' ) );
	}

	/**
	 * Update mongo document
	 *
	 * @param int      $post_id Post ID.
	 * @param \WP_Post $post    WP_Post object.
	 */
	public function post_updated( int $post_id, \WP_Post $post ): void {
		$graphql  = new GraphQL();
		$response = '';
		
		if ( $post->post_type === 'post' ) {
			$response = $graphql->update_post( $post );
		}

		if ( $post->post_type === 'page' ) {
			$response = $graphql->update_page( $post );
		}

		update_option( 'last-gql-response', $response );
	}

	/**
	 * Update mongo document
	 *
	 * @param int $post_id Post ID.
	 */
	public function attachment_updated( int $post_id ): void {
		$categories = array();
		$the_cats   = get_the_category( $post_id );
		if ( is_array( $the_cats ) ) {
			foreach ( $the_cats as  $category ) {
				array_push( $categories, $category->slug );
			}
		}
		$is_background = in_array('background', $categories) ? 1 : 0;

		if ( $is_background ) {
			$graphql    = new GraphQL();
			$response   = $graphql->update_background( $post_id );
	
			update_option( 'last-gql-response', $response );
		}
	}
}
