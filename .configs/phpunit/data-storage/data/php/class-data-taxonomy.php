<?php
/**
 * Test data -- Taxonomy
 *
 * @package sujinc.com
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

use Sujin\Wordpress\WP_Express\Taxonomy;

/**
 * Test data -- Taxonomy
 */
class Data_Taxonomy {
	/**
	 * Lyrics series data
	 *
	 * @var WP_Term
	 * @see https://developer.wordpress.org/reference/functions/get_term/
	 */
	public $series_lyrics;

	/**
	 * Background category data
	 *
	 * @var WP_Term
	 * @see https://developer.wordpress.org/reference/functions/get_term/
	 */
	public $category_background;

	/**
	 * Blog category data
	 *
	 * @var WP_Term
	 * @see https://developer.wordpress.org/reference/functions/get_term/
	 */
	public $category_blog;

	/**
	 * React tag data
	 *
	 * @var WP_Term
	 * @see https://developer.wordpress.org/reference/functions/get_term/
	 */
	public $tag_react;

	/**
	 * WordPress tag data
	 *
	 * @var WP_Term
	 * @see https://developer.wordpress.org/reference/functions/get_term/
	 */
	public $tag_wordpress;

	/**
	 * Constructor
	 */
	public function __construct() {
		register_taxonomy( 'series', 'post' );

		Taxonomy::get_instance( 'Category' )->append_to( 'attachment' );

		$this->series_lyrics = wp_insert_term( 'Lyrics', 'series' );
		if ( $this->series_lyrics instanceof WP_Error ) {
			$this->series_lyrics = array(
				'term_id' => $this->series_lyrics->error_data['term_exists'],
			);
		}
		$this->series_lyrics = get_term( $this->series_lyrics['term_id'] );

		$this->category_background = wp_insert_term( 'Background', 'category' );
		if ( $this->category_background instanceof WP_Error ) {
			$this->category_background = array(
				'term_id' => $this->category_background->error_data['term_exists'],
			);
		}
		$this->category_background = get_term( $this->category_background['term_id'] );

		$this->category_blog = wp_insert_term( 'Blog', 'category' );
		if ( $this->category_blog instanceof WP_Error ) {
			$this->category_blog = array(
				'term_id' => $this->category_blog->error_data['term_exists'],
			);
		}
		$this->category_blog = get_term( $this->category_blog['term_id'] );

		$this->tag_react = wp_insert_term( 'React', 'post_tag' );
		if ( $this->tag_react instanceof WP_Error ) {
			$this->tag_react = array(
				'term_id' => $this->tag_react->error_data['term_exists'],
			);
		}
		$this->tag_react = get_term( $this->tag_react['term_id'] );

		$this->tag_wordpress = wp_insert_term( 'WordPress', 'post_tag' );
		if ( $this->tag_wordpress instanceof WP_Error ) {
			$this->tag_wordpress = array(
				'term_id' => $this->tag_wordpress->error_data['term_exists'],
			);
		}
		$this->tag_wordpress = get_term( $this->tag_wordpress['term_id'] );
	}
}
