<?php
/**
 * Class : Rest API
 *
 * @project Sujin
 * @since   8.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin;

use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Sujin\V1\{Flickr, Post, Menu, Background, Archive};

final class Rest_Api {
	use Helpers\Singleton;

	public function __construct() {
		Flickr::get_instance();
		Post::get_instance();
		Menu::get_instance();
		Background::get_instance();
		Archive::get_instance();

		remove_filter( 'the_content', 'wpautop' );
	}
}
