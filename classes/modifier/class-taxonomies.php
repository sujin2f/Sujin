<?php
/**
 * Modifying Taxonomies
 *
 * @package sujinc.com
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin\Modifier;

use Sujin\Wordpress\WP_Express\Helpers\Trait_Singleton;

use Sujin\Wordpress\WP_Express\Post_Type;
use Sujin\Wordpress\WP_Express\Taxonomy;
use Sujin\Wordpress\WP_Express\Fields\Term_Meta\Attachment;

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
}
