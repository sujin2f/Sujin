<?php
/**
 * Gallery
 *
 * @project Sujin
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin\Modifier\Post_Type;

use Sujin\Wordpress\WP_Express\Helpers\Trait_Singleton;
use Sujin\Wordpress\WP_Express\Meta_Box;
use Sujin\Wordpress\WP_Express\Post_Type;
use Sujin\Wordpress\WP_Express\Fields\Post_Meta\Attachment;

class Gallery {
	use Trait_Singleton;

	function __construct() {
		$gallery    = Post_Type::get_instance( 'Gallery' )
			->supports( array( 'title', 'excerpt' ) );
		$attachment = Attachment::get_instance( 'Photos' )
			->single( false );
		$meta_box   = Meta_Box::get_instance( 'Gallery' )
			->append_to( $gallery )
			->append( $attachment );
	}
}
