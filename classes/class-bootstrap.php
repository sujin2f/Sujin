<?php
/**
 * Entry Point
 *
 * @package sujinc.com
 * @since   8.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin;

// REST API Endpoints.
use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Sujin\V1\{
	Post_Endpoint,
	Menu_Endpoint,
	Background_Endpoint,
	Archive_Endpoint,
};

// Shortcodes.
use Sujin\Wordpress\Theme\Sujin\Shortcode\About_Item;
use Sujin\Wordpress\Theme\Sujin\Shortcode\Gallery as Shortcode_Gallery;

// Widgets.
use Sujin\Wordpress\Theme\Sujin\Widgets\{
	Flickr as Flickr_Widget,
	Google_Advert as Advert_Widget,
	Recent_Post as Recent_Post_Widget,
};

// Modifiers.
use Sujin\Wordpress\Theme\Sujin\Modifier\{
	Options,
	Taxonomies,
	Post as Post_Modifier,
	Post_Type\Gallery,
};

use Sujin\Wordpress\WP_Express\Helpers\Trait_Singleton;

/**
 * Entry Point
 *
 * @codeCoverageIgnore
 */
class Bootstrap {
	use Trait_Singleton;

	/**
	 * Constructor
	 *
	 * @visibility protected
	 */
	protected function __construct() {
		$this->init();
		$this->register_rest_endpoints();

		add_filter( 'the_excerpt', array( $this, 'the_excerpt' ) );
		add_action( 'widgets_init', array( $this, 'register_sidebars' ) );
		add_action( 'widgets_init', array( $this, 'register_widgets' ) );
		add_filter( 'xmlrpc_enabled', '__return_false' );
	}

	/**
	 * Initialized
	 *
	 * @todo separate admin
	 */
	private function init(): void {
		Assets::get_instance();
		Theme_Supports::get_instance();

		// Modifiers.
		Options::get_instance();
		Taxonomies::get_instance();
		Post_Modifier::get_instance();

		// Shortcode.
		About_Item::get_instance();
		Shortcode_Gallery::get_instance();

		// Custom Post Type.
		Gallery::get_instance();
	}

	/**
	 * Excerpt
	 *
	 * @param  string $excerpt Excerpt.
	 * @return string
	 * @see https://developer.wordpress.org/reference/functions/the_excerpt/
	 */
	public function the_excerpt( string $excerpt ): string {
		$breaks  = array( '<br />', '<br>', '<br/>' );
		$excerpt = str_replace( $breaks, "\r\n\r\n", $excerpt );
		$excerpt = wp_strip_all_tags( $excerpt );
		$excerpt = wpautop( $excerpt );

		return $excerpt;
	}

	/**
	 * RESTful API
	 */
	private function register_rest_endpoints(): void {
		Post_Endpoint::get_instance();
		Menu_Endpoint::get_instance();
		Background_Endpoint::get_instance();
		Archive_Endpoint::get_instance();

		remove_filter( 'the_content', 'wpautop' );
	}

	/**
	 * Sidebars
	 */
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

	/**
	 * Widgets
	 */
	public function register_widgets(): void {
		register_widget( Flickr_Widget::get_instance() );
		register_widget( Advert_Widget::get_instance() );
		register_widget( Recent_Post_Widget::get_instance() );
	}
}
