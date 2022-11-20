<?php
/**
 * Entry Point
 *
 * @package sujinc.com
 * @since   8.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin;

// Shortcodes.
use Sujin\Wordpress\Theme\Sujin\Shortcode\About_Item;
use Sujin\Wordpress\Theme\Sujin\Shortcode\Gallery as Shortcode_Gallery;

// Modifiers.
use Sujin\Wordpress\Theme\Sujin\Modifier\{
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

		add_filter( 'the_excerpt', array( $this, 'the_excerpt' ) );
	}

	/**
	 * Initialized
	 *
	 * @todo separate admin
	 */
	private function init(): void {
		Theme_Supports::get_instance();

		// Modifiers.
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
}
