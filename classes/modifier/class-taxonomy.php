<?php
/**
 * Option Modifier
 *
 * @project Sujin
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin\Modifier;

use Sujin\Wordpress\Theme\Sujin\Helpers\Singleton;

use Sujin\Wordpress\WP_Express\Taxonomy as Ex_Taxonomy;
use Sujin\Wordpress\WP_Express\Fields\Term_Meta\Attachment;

class Taxonomy {
	use Singleton;

	function __construct() {
		// Post Series
		Ex_Taxonomy::get_instance( 'Series' )
			->attach_to( 'post' )
			->show_in_rest( true );

		// Attachment Category
		Ex_Taxonomy::get_instance( 'Category' )
			->attach_to( 'attachment' );

		// Term Meta: Thumbnail
		Attachment::get_instance( 'Thumbnail' )
			->attach_to( 'category' )
			->attach_to( 'post_tag' );
	}
}
