<?php
/**
 * Class : Rest API
 *
 * @project Sujin
 * @since   8.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin;

use Sujin\Wordpress\Theme\Sujin\Theme_Supports;
use Sujin\Wordpress\Theme\Sujin\Helpers\Rest_Helper;

use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Sujin\V1\Flickr;
use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Sujin\V1\Posts;
use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Sujin\V1\Menu;
use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Sujin\V1\Media;

use WP_REST_Server, WP_REST_Response, WP_Query;

class REST_API {
	use Helpers\Singleton;

	public function __construct() {
		new Flickr();
		new Posts();
		new Menu();
		new Media();

		remove_filter( 'the_content', 'wpautop' );
	}
}
