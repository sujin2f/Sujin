<?php
/**
 * Class : Rest API
 *
 * @project Sujin
 * @since   8.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin;

use Sujin\Wordpress\WP_Express\Taxonomy;

use Sujin\Wordpress\WP_Express\Meta_Box;
use Sujin\Wordpress\WP_Express\Fields\Post_Meta\Input as Meta_Input;
use Sujin\Wordpress\WP_Express\Fields\Post_Meta\Attachment as Meta_Attachment;
use Sujin\Wordpress\WP_Express\Fields\Post_Meta\Checkbox as Meta_Checkbox;

use Sujin\Wordpress\WP_Express\Fields\Term_Meta\Attachment as Term_Meta_Attachment;

class Custom_Fields {
	use Helpers\Singleton;

	function __construct() {
		$metabox = Meta_Box::get_instance( 'Images' )
			->post_type( 'post' )
			->post_type( 'page' )
			->add( Meta_Attachment::get_instance( 'List' )->show_in_rest( true ) )
			->add( Meta_Attachment::get_instance( 'Icon' )->show_in_rest( true ) )
			->add( Meta_Attachment::get_instance( 'Title' )->show_in_rest( true ) )
			->add( Meta_Attachment::get_instance( 'Background' )->show_in_rest( true ) )
			->add( Meta_Checkbox::get_instance( 'Use Background Color' )->show_in_rest( true ) )
			->add( Meta_Input::get_instance( 'Background Color' )->type( 'color' )->show_in_rest( true ) );

		Term_Meta_Attachment::get_instance( 'Thumbnail' )
			->attach_to( 'category' )
			->attach_to( 'post_tag' )
			->show_in_rest( true );

		Taxonomy::get_instance( 'Category' )
			->attach_to( 'attachment' )
			->show_in_rest( true );
	}
}
