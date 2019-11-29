<?php
/**
 * Post Modifier
 *
 * @project Sujin
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin\Modifier;

use Sujin\Wordpress\Theme\Sujin\Helpers\Singleton;

use Sujin\Wordpress\WP_Express\Meta_Box;
use Sujin\Wordpress\WP_Express\Fields\Post_Meta\{
	Input,
	Attachment,
	Checkbox,
};

class Post {
	use Singleton;

	function __construct() {
		Meta_Box::get_instance( 'Images' )
			->attach_to( 'post' )
			->attach_to( 'page' )
			->add( Attachment::get_instance( 'List' ) )
			->add( Attachment::get_instance( 'Icon' ) )
			->add( Attachment::get_instance( 'Title' ) )
			->add( Attachment::get_instance( 'Background' ) )
			->add( Checkbox::get_instance( 'Use Background Color' ) )
			->add( Input::get_instance( 'Background Color' )->type( 'color' ) );
	}
}
