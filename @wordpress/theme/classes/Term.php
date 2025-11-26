<?php
/**
 * Term management
 *
 * @package sujinc.com
 * @since   12.0.0
 * @author  Sujin 수진 Choi
 */

namespace Sujin\Theme;

use Sujin\Theme\Tokens;
use GraphQL\Client;
use GraphQL\Mutation;
use GraphQL\Variable;

/**
 * Post controller
 */
class Term {
	/**
	 * Constructor
	 */
	public function __construct() {
		add_action( 'saved_term', array( $this, 'gql_refresh_term' ), 10, 3 );
	}

	/**
	 * Send refreshCategory to GQL
	 *
	 * @param int    $_        Term ID.
	 * @param int    $tt_id    Term taxonomy ID.
	 * @param string $taxonomy Taxonomy slug.
	 */
	public function gql_refresh_term( int $_, int $tt_id, string $taxonomy ): void {
		$term = get_term_by( 'term_taxonomy_id', $tt_id );
		if ( ! $term ) {
			return;
		}
		$taxonomy = $term->taxonomy;
		$slug     = $term->slug;

		if ( 'category' !== $taxonomy ) {
			return;
		}

		$client = new Client( getenv_docker( 'GQL_ENDPOINT', '' ), array( 'authorization' => 'Bearer ' . Tokens::get_token() ) );
		$gql    = ( new Mutation( 'refreshCategory' ) )
			->setVariables( array( new Variable( 'slug', 'String', true ) ) )
			->setArguments( array( 'slug' => '$slug' ) );

		try {
			$client->runQuery(
				$gql,
				true,
				array( 'slug' => $slug )
			);
		} catch ( \Exception $_ ) { // phpcs:ignore Generic.CodeAnalysis.EmptyStatement.DetectedCatch
			// do nothing.
		}
	}
}
