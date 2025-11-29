<?php
/**
 * Background management
 *
 * @package sujinc.com
 * @since   12.0.0
 * @author  Sujin 수진 Choi
 */

namespace Sujin\Theme;

use Sujin\Theme\Tokens;
use GraphQL\Client;
use GraphQL\Mutation;

/**
 * Post controller
 */
class Background {
	/**
	 * Constructor
	 */
	public function __construct() {
		add_action( 'updated_post_meta', array( $this, 'gql_refresh_background' ), 10, 4 );
	}

	/**
	 * Send GQL refresh background when attachment changes.
	 *
	 * @param int    $_           ID of updated metadata entry.
	 * @param int    $object_id   ID of the object metadata is for.
	 * @param string $meta_key    Metadata key.
	 * @param mixed  $_meta_value Metadata value.
	 * @param int    $attempt     recursive for refresh token.
	 * @return void
	 */
	public function gql_refresh_background( int $_, int $object_id, string $meta_key, mixed $_meta_value, int $attempt = 1 ): void {
		if ( 'background_image' !== $meta_key ) {
			return;
		}

		if ( $_meta_value ) {
			$term_id = $this->get_background_term_id();
			wp_set_post_terms( $object_id, array( $term_id ), 'category' );
		} else {
			wp_set_post_terms( $object_id, array(), 'category' );
		}

		$client = new Client( getenv_docker( 'GQL_ENDPOINT', '' ), array( 'authorization' => 'Bearer ' . Tokens::get_token() ) );
		$gql    = new Mutation( 'refreshBackgrounds' );

		try {
			$client->runQuery( $gql );
			// TODO remove @next cache.
		} catch ( \Exception $_ ) {
			if ( 1 === $attempt ) {
				Tokens::refresh_token();
				$this->gql_refresh_background( 0, $object_id, $meta_key, $_meta_value, 2 );
			}
		}
	}

	/**
	 * Term ID of `background`
	 *
	 * @return integer
	 */
	private function get_background_term_id(): int {
		$term = get_term_by( 'slug', 'background', 'category' );
		if ( ! $term ) {
			$term = wp_insert_term( 'background', 'category' );
		}
		return $term->term_id;
	}
}
