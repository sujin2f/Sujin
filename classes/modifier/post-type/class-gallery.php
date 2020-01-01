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
use Sujin\Wordpress\WP_Express\Post_Type;

class Gallery {
	use Trait_Singleton;

	function __construct() {
		Post_Type::get_instance( 'Gallery' )
			->supports( array( 'title', 'excerpt' ) );
	}
}
