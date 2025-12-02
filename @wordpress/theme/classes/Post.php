<?php
/**
 * Post management
 *
 * @package sujinc.com
 * @since   12.0.0
 * @author  Sujin 수진 Choi
 */

namespace Sujin\Theme;

use Sujin\Theme\Redis;
use GraphQL\Client;
use GraphQL\Mutation;
use GraphQL\Variable;

/**
 * Post controller
 */
class Post {
	/**
	 * Constructor
	 */
	public function __construct() {
		add_action( 'save_post', array( $this, 'save_post' ), 15, 2 );
	}

	/**
	 * When save post,
	 * 1. Store parsed content to meta
	 * 2. Version
	 * 3. Request GQL to update MongoDB
	 *
	 * @param int      $post_id Post ID.
	 * @param \WP_Post $post    Post instance.
	 */
	public function save_post( int $post_id, \WP_Post $post ): void {
		if ( 'publish' === $post->post_status ) {
			$this->save_content( $post_id, $post->post_content );
			$this->update_version( $post_id, );
			$this->gql_refresh_post( $post->post_name, $post->post_type );
		} else {
			delete_post_meta( $post_id, 'the_content' );
			$this->gql_refresh_post( $post->post_name, $post->post_type );
		}
	}

	/**
	 * Save parsed HTML post to metadata for published post.
	 *
	 * @param int    $post_id      Post ID.
	 * @param string $post_content Post content.
	 */
	private function save_content( int $post_id, string $post_content ): void {
		remove_filter( 'the_content', 'wpautop' );

		$content = apply_filters( 'the_content', $post_content );
		update_post_meta( $post_id, 'the_content', $content );
	}

	/**
	 * Update content version for GQL to process content differently
	 *
	 * @param int $post_id Post ID.
	 */
	private function update_version( int $post_id ): void {
		$version = getenv_docker( 'VERSION', '' );
		if ( ! $version ) {
			return;
		}
		update_post_meta( $post_id, 'version', $version );
	}

	/**
	 * Send refreshPost/Page to GQL
	 *
	 * @param string $slug      Post slug.
	 * @param string $post_type post or page.
	 * @param int    $attempt   recursive for refresh token.
	 */
	private function gql_refresh_post( string $slug, string $post_type, int $attempt = 1 ): void {
		$query = match ( $post_type ) {
			'post' => 'refreshPost',
			'page' => 'refreshPage',
			default => '',
		};
		if ( ! $query ) {
			return;
		}

		$client = new Client( getenv_docker( 'GQL_BASE_URL', '' ), array( 'authorization' => 'Bearer ' . Tokens::get_token() ) );
		$gql    = ( new Mutation( $query ) )
			->setVariables( array( new Variable( 'slug', 'String', true ) ) )
			->setArguments( array( 'slug' => '$slug' ) );

		try {
			$client->runQuery(
				$gql,
				true,
				array( 'slug' => $slug )
			);

			$redis = new Redis();
			$redis->del( "{$post_type}s-archive" );
			$redis->del( "{$post_type}s-{$slug}" );
		} catch ( \Exception $_ ) {
			if ( 1 === $attempt ) {
				Tokens::refresh_token();
				$this->gql_refresh_post( $slug, $post_type, 2 );
			}
		}
	}
}
