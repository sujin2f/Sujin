<?php
/**
 * Background management
 *
 * @package sujinc.com
 * @since   12.0.0
 * @author  Sujin 수진 Choi
 */

namespace Sujin\Theme;

use Sujin\Theme\Redis;

/**
 * Post controller
 */
class Background {
	/**
	 * Constructor
	 */
	public function __construct() {
		add_action( 'updated_post_meta', array( $this, 'set_background_term' ), 10, 4 );
	}

	/**
	 * Set background term to attachment and sene message to Redis.
	 *
	 * @param int    $_           ID of updated metadata entry.
	 * @param int    $object_id   ID of the object metadata is for.
	 * @param string $meta_key    Metadata key.
	 * @param mixed  $_meta_value Metadata value.
	 * @return void
	 */
	public function set_background_term( int $_, int $object_id, string $meta_key, mixed $_meta_value ): void {
		if ( 'background_image' !== $meta_key ) {
			return;
		}

		if ( $_meta_value ) {
			$term_id = $this->get_background_term_id();
			wp_set_post_terms( $object_id, array( $term_id ), 'category' );
		} else {
			wp_set_post_terms( $object_id, array(), 'category' );
		}

		$redis = new Redis();
		$redis->publish( 'backgrounds' );
		$redis->quit();
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
