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

use Sujin\Wordpress\WP_Express\Setting;
use Sujin\Wordpress\WP_Express\Fields\Settings\Input as Option_Input;

class Custom_Fields {
	use Helpers\Singleton;

	function __construct() {
		$this->set_custom_fields();
	}

	private function set_custom_fields() {
		Meta_Box::get_instance( 'Images' )
			->attach_to( 'post' )
			->attach_to( 'page' )
			->add( Meta_Attachment::get_instance( 'List' ) )
			->add( Meta_Attachment::get_instance( 'Icon' ) )
			->add( Meta_Attachment::get_instance( 'Title' ) )
			->add( Meta_Attachment::get_instance( 'Background' ) )
			->add( Meta_Checkbox::get_instance( 'Use Background Color' ) )
			->add( Meta_Input::get_instance( 'Background Color' )->type( 'color' ) );

		Term_Meta_Attachment::get_instance( 'Thumbnail' )
			->attach_to( 'category' )
			->attach_to( 'post_tag' );

		Taxonomy::get_instance( 'Category' )
			->attach_to( 'attachment' );

		Setting::get_instance( 'Flickr Feed' )
			->add( Option_Input::get_instance( 'Flicker ID' ) );
	}
}
