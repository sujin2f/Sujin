<?php
/**
 * Entry Point
 *
 * @project Sujin
 * @since   8.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin;

// REST API Endpoints
use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Sujin\V1\{
	Post as Post_Endpoint,
	Menu,
	Background,
	Archive,
};

// Shortcodes
use Sujin\Wordpress\Theme\Sujin\Shortcode\About_Item;
use Sujin\Wordpress\Theme\Sujin\Shortcode\Gallery as Shortcode_Gallery;

// Widgets
use Sujin\Wordpress\Theme\Sujin\Widgets\{
	Flickr as Flickr_Widget,
	Advert as Advert_Widget,
};

// Modifiers
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
		add_action( 'widgets_init', array( $this, 'register_sidebars' ) );
		add_action( 'widgets_init', array( $this, 'register_widgets' ) );
	}

	private function init(): void {
		Assets::get_instance();
		Theme_Supports::get_instance();

		// Modifiers
		Option::get_instance();
		Taxonomy::get_instance();
		Post_Modifier::get_instance();

		// Shortcode
		About_Item::get_instance();
		Shortcode_Gallery::get_instance();

		// Custom Post Type
		Gallery::get_instance();
	}

	public function the_excerpt( string $excerpt ): string {
		$breaks  = array( '<br />', '<br>', '<br/>' );
		$excerpt = str_replace( $breaks, "\r\n\r\n", $excerpt );
		$excerpt = strip_tags( $excerpt );
		$excerpt = wpautop( $excerpt );

		return $excerpt;
	}

	private function register_rest_endpoints(): void {
		Post_Endpoint::get_instance();
		Menu::get_instance();
		Background::get_instance();
		Archive::get_instance();

		remove_filter( 'the_content', 'wpautop' );
	}

	public function register_sidebars(): void {
		register_sidebar(
			array(
				'name' => 'Side Rail',
				'id'   => 'side-rail',
			)
		);

		register_sidebar(
			array(
				'name' => 'Footer',
				'id'   => 'footer',
			)
		);
	}

	public function register_widgets(): void {
		register_widget( Flickr_Widget::get_instance() );
		register_widget( Advert_Widget::get_instance() );
	}
}
