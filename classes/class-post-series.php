<?php
/**
 * Class : Rest API
 *
 * @project Sujin
 * @since   8.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin;

use Sujin\Wordpress\Theme\Sujin\Helpers\Singleton;
use Sujin\Wordpress\WP_Express\Taxonomy;

class Post_Series {
	use Singleton;

	function __construct() {
		Taxonomy::get_instance( 'Series' )
			->attach_to( 'post' )
			->show_in_rest( true );
	}
}
