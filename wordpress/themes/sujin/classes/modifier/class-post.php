<?php
/**
 * Modifying Post Type
 *
 * @package sujinc.com
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\WordPress\Theme\Sujin\Modifier;

use Sujin\Wordpress\WP_Express\Helpers\Trait_Singleton;

use Sujin\Wordpress\WP_Express\Post_Type;
use Sujin\Wordpress\WP_Express\Meta_Box;
use Sujin\Wordpress\WP_Express\Fields\Post_Meta\{
	Input,
	Attachment,
	Checkbox,
};

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
		$nonce  = wp_create_nonce( 'clear-cache_' . $post_id );
		$is_dev = false;
		if ( function_exists( 'getenv_docker' ) ) {
			$is_dev = getenv_docker( 'NODE_ENV', 'production' ) === 'development';
		}
		$base_url = $is_dev ? 'http://host.docker.internal:3000' : 'https://sujinc.com';
		if ( ! $is_dev && function_exists( 'getenv_docker' ) ) {
			$base_url = getenv_docker( 'NEXT_PUBLIC_BASE_URL', $base_url );
		}

		$categories = array();
		$tags       = array();
		foreach ( get_the_category( $post_id ) as  $category ) {
			array_push( $categories, $category->slug );
		}
		foreach ( get_the_tags( $post_id ) as  $tag ) {
			array_push( $tags, $tag->slug );
		}

		$mutation = array(
			'query' => '
				mutation {
					removeCache(nonce: "' . $nonce . '", slug: "' . $post->post_name . '", id: ' . $post->ID . ', categories: "' . join( ',', $categories ) . '", tags: "' . join( ',', $tags ) . '") {
						result
					}
				}',
		);
		$args     = array(
			'headers' => array(
				'Content-Type' => 'application/json',
			),
			'body'    => wp_json_encode( $mutation ),
		);

		update_option( 'clear_cache', $nonce . '-' . $post->post_name );
		wp_remote_post( $base_url . '/api/graphql', $args );
	}
}
