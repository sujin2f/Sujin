<?php
/**
 * Post management
 *
 * @package sujinc.com
 * @since   12.0.0
 * @author  Sujin 수진 Choi
 */

namespace Sujin\Theme;

use Firebase\JWT\JWT;
use GraphQL\Client;
use GraphQL\Query;
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
		$content = apply_filters( 'the_content', $post_content );
		update_post_meta( $post_id, 'the_content', $content );
	}

	/**
	 * Update content version for GQL to process content differently
	 * // TODO create deployment script to update VERSION env from package.json.
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
	 */
	private function gql_refresh_post( string $slug, string $post_type ): void {
		$client = new Client( getenv_docker( 'GQL_ENDPOINT', '' ), array( 'authorization' => 'Bearer ' . Tokens::get_token() ) );
		$query  = 'post' === $post_type ? 'refreshPost' : 'refreshPage';
		$gql    = ( new Mutation( $query ) )
			->setVariables( array( new Variable( 'slug', 'String', true ) ) )
			->setArguments( array( 'slug' => '$slug' ) );

		$client->runQuery(
			$gql,
			true,
			array( 'slug' => $slug )
		);
	}
}
