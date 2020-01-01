<?php
/**
 * Entry Point
 *
 * @project Sujin
 * @since   8.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin;

use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Sujin\V1\{
	Flickr,
	Post as Post_Endpoint,
	Menu,
	Background,
	Archive,
};

use Sujin\Wordpress\Theme\Sujin\Shortcode\About_Item;

use Sujin\Wordpress\Theme\Sujin\Modifier\{
	Option,
	Taxonomy,
	Post as Post_Modifier,
	Post_Type\Gallery,
};

use Sujin\Wordpress\WP_Express\Helpers\Trait_Singleton;

class Bootstrap {
	use Trait_Singleton;

	function __construct() {
		$this->init();
		$this->register_rest_endpoints();

		add_filter( 'the_excerpt', array( $this, 'the_excerpt' ) );
	}

	private function init() {
		Assets::get_instance();
		Theme_Supports::get_instance();

		// Modifiers
		Option::get_instance();
		Taxonomy::get_instance();
		Post_Modifier::get_instance();

		// Shortcode
		About_Item::get_instance();

		// Custom Post Type
		Gallery::get_instance();
	}

	public function the_excerpt( $excerpt ) {
		$breaks  = array( '<br />', '<br>', '<br/>' );
		$excerpt = str_replace( $breaks, "\r\n\r\n", $excerpt );
		$excerpt = strip_tags( $excerpt );
		$excerpt = wpautop( $excerpt );

		return $excerpt;
	}

	private function register_rest_endpoints(): void {
		Flickr::get_instance();
		Post_Endpoint::get_instance();
		Menu::get_instance();
		Background::get_instance();
		Archive::get_instance();

		remove_filter( 'the_content', 'wpautop' );
	}
}
