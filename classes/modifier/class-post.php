<?php
/**
 * Post Modifier
 *
 * @project Sujin
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin\Modifier;

use Sujin\Wordpress\WP_Express\Helpers\Trait_Singleton;

use Sujin\Wordpress\WP_Express\Post_Type;
use Sujin\Wordpress\WP_Express\Meta_Box;
use Sujin\Wordpress\WP_Express\Fields\Post_Meta\{
	Input,
	Attachment,
	Checkbox,
};

class Post {
	use Trait_Singleton;

	function __construct() {
		Meta_Box::get_instance( 'Images' )
			->append_to( Post_Type::get_instance( 'Post' ) )
			->append_to( Post_Type::get_instance( 'Page' ) )
			->append( Attachment::get_instance( 'List' ) )
			->append( Attachment::get_instance( 'Icon' ) )
			->append( Attachment::get_instance( 'Title' ) )
			->append( Attachment::get_instance( 'Background' ) )
			->append( Checkbox::get_instance( 'Use Background Color' ) )
			->append( Input::get_instance( 'Background Color' )->type( 'color' ) );
	}
}
