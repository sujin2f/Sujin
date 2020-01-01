<?php
/**
 * Option Modifier
 *
 * @project Sujin
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin\Modifier;

use Sujin\Wordpress\WP_Express\Helpers\Trait_Singleton;

use Sujin\Wordpress\WP_Express\Post_Type;
use Sujin\Wordpress\WP_Express\Taxonomy as Ex_Taxonomy;
use Sujin\Wordpress\WP_Express\Fields\Term_Meta\Attachment;

class Taxonomy {
	use Trait_Singleton;

	function __construct() {
		// Post Series
		Ex_Taxonomy::get_instance( 'Series' )
			->append_to( Post_Type::get_instance( 'Post' ) )
			->show_in_rest( true );

		// Attachment Category
		Ex_Taxonomy::get_instance( 'Category' )
			->append_to( Post_Type::get_instance( 'Attachment' ) );

		// Term Meta: Thumbnail
		Attachment::get_instance( 'Thumbnail' )
			->append_to( Ex_Taxonomy::get_instance( 'Category' ) )
			->append_to( Ex_Taxonomy::get_instance( 'Tag' ) );
	}
}
