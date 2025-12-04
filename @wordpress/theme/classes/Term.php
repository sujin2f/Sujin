<?php
/**
 * Term management
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
class Term {
	/**
	 * Constructor
	 */
	public function __construct() {
		add_action( 'saved_term', array( $this, 'redis_refresh_term' ), 10, 3 );
	}

	/**
	 * Send Redis a message to update change
	 *
	 * @param int    $_        Term ID.
	 * @param int    $tt_id    Term taxonomy ID.
	 * @param string $taxonomy Taxonomy slug.
	 */
	public function redis_refresh_term( int $_, int $tt_id, string $taxonomy ): void {
		$term = get_term_by( 'term_taxonomy_id', $tt_id );
		if ( ! $term ) {
			return;
		}
		$taxonomy = $term->taxonomy;
		$slug     = $term->slug;

		if ( 'category' !== $taxonomy ) {
			return;
		}

		$redis = new Redis();
		$redis->publish(
			'wordpress', // phpcs:ignore WordPress.WP.CapitalPDangit.MisspelledInText
			array(
				'type'   => 'category',
				'action' => 'update',
				'slug'   => $slug,
			)
		);
		$redis->quit();
	}
}
