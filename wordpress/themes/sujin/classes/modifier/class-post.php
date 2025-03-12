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
	 * Remove mongo cache
	 *
	 * @param int      $post_id Post ID.
	 * @param \WP_Post $post    WP_Post object.
	 */
	public function post_updated( int $post_id, \WP_Post $post ): void {
		$graphql = new GraphQL( $post );
		$graphql->update_post();
	}
}
