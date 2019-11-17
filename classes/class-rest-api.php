<?php
/**
 * Class : Rest API
 *
 * @project Sujin
 * @since   8.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin;

use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Sujin\V1\{Flickr, Posts, Menu, Background};

final class REST_API {
	use Helpers\Singleton;

	public function __construct() {
		new Flickr();
		new Posts();
		new Menu();
		new Background();

		remove_filter( 'the_content', 'wpautop' );
	}
}
