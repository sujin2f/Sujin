<?php
/**
 * Gallery
 *
 * @project Sujin
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin\Modifier\PostType;

use Sujin\Wordpress\Theme\Sujin\Helpers\Singleton;

use Sujin\Wordpress\WP_Express\Post_Type;

class Gallery {
	use Singleton;

	function __construct() {
		Post_Type::get_instance( 'Gallery' )
			->supports( array( 'title', 'excerpt' ) );
	}
}
