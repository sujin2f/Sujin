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
	 * @return void
	 */
	public function gql_refresh_background( int $_, int $object_id, string $meta_key, mixed $_meta_value ): void {
		if ( 'background_image' !== $meta_key ) {
			return;
		}
		
		console($object_id);
		if ( $_meta_value ) {
			$term_id = $this->get_background_term_id();
			wp_set_post_terms( $object_id, array( $term_id ), 'category' );
			console($term_id);
		} else {
			wp_set_post_terms( $object_id, array(), 'category' );
		}

		$client = new Client( getenv_docker( 'GQL_ENDPOINT', '' ), array( 'authorization' => 'Bearer ' . Tokens::get_token() ) );
		$gql    = new Mutation( 'refreshBackgrounds' );

		try {
			$client->runQuery( $gql );
		} catch ( \Exception $_ ) { // phpcs:ignore Generic.CodeAnalysis.EmptyStatement.DetectedCatch
			// do nothing.
		}
	}

	/**
	 * Term ID of `background`
	 *
	 * @return integer
	 */
	private function get_background_term_id(): int {
		$term = get_term_by( 'slug', 'background', 'category' );
		console($term);
		if ( ! $term ) {
			$term = wp_insert_term( 'background', 'category' );
		}
		return $term->term_id;
	}
}
