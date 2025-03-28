<?php
/**
 * Modifying Taxonomies
 *
 * @package sujinc.com
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Theme\Modifier;

use Sujin\Wordpress\WP_Express\Helpers\Trait_Singleton;

use Sujin\Wordpress\WP_Express\Post_Type;
use Sujin\Wordpress\WP_Express\Taxonomy;
use Sujin\Wordpress\WP_Express\Fields\Term_Meta\Attachment;
use Sujin\Theme\Plugins\GraphQL;

/**
 * Modifying Taxonomies
 *
 * @codeCoverageIgnore
 */
class Taxonomies {
	use Trait_Singleton;

	/**
	 * Constructor
	 * - Series for Post
	 * - Category for Attachment
	 * - Thumbnail for Category and Tag taxonories
	 *
	 * @visibility protected
	 */
	protected function __construct() {
		add_action( 'saved_term', array( $this, 'term_updated' ), 100 );
		// Post Series.
		Taxonomy::get_instance( 'Series' )
			->append_to( Post_Type::get_instance( 'Post' ) )
			->show_in_rest( true );

		// Attachment Category.
		Taxonomy::get_instance( 'Category' )
			->append_to( Post_Type::get_instance( 'Attachment' ) );

		// Term Meta: Thumbnail.
		Attachment::get_instance( 'Thumbnail' )
			->append_to( Taxonomy::get_instance( 'Category' ) )
			->append_to( Taxonomy::get_instance( 'Tag' ) );
	}

	/**
	 * Update mongo document
	 *
	 * @param int $term_id Term ID.
	 */
	public function term_updated( int $term_id): void {
		$graphql  = new GraphQL();
		$response = $graphql->update_term( $term_id );
		update_option( 'last-gql-response', $response );
	}
}
