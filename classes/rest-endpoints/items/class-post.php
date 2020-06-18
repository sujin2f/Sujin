<?php
/**
 * Post RESTful API Item
 *
 * @package sujinc.com
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Items;

use DOMDocument, DOMElement, WP_Post, WP_Query;

// phpcs:disable WordPress.NamingConventions.ValidVariableName
/**
 * Post RESTful API Item
 */
class Post extends Simple_Post {
	/**
	 * Post content
	 *
	 * @var string
	 */
	public $content;

	/**
	 * Is comment allowed
	 *
	 * @var boolean?
	 */
	public $commentStatus;

	/**
	 * Series list
	 *
	 * @var Simple_Post[]
	 */
	public $series = array();

	/**
	 * Prev / Next list
	 *
	 * @var Simple_Post[]
	 */
	public $prevNext = array();

	/**
	 * Related contents
	 *
	 * @var Simple_Post[]
	 */
	public $related = array();

	/**
	 * Post Type
	 *
	 * @var string post|page
	 */
	public $type;

	/**
	 * Table of content
	 *
	 * @var array
	 */
	public $toc = array();

	protected const ITEM_NAME = 'post';

	/**
	 * Constructor
	 *
	 * @param      string   $name Name of the instance.
	 * @param      ?WP_Post $post Post object of the menu item.
	 * @visibility protected
	 */
	protected function __construct( string $name, ?WP_Post $post = null ) {
		parent::__construct( $name, $post );

		if ( ! $post ) {
			return;
		}

		$this->toc      = $this->get_toc( $post->post_content );
		$this->content  = do_shortcode( wpautop( $post->post_content ) );
		$this->type     = $post->post_type;
		$this->series   = $this->get_series( $post );
		$this->prevNext = array(
			'prev' => $this->get_prevnext( $post, true ),
			'next' => $this->get_prevnext( $post, false ),
		);
		$this->related  = $this->get_related( $post );
	}

	/**
	 * Get table of content
	 *
	 * @param  string $content Post content.
	 * @return array
	 * @uses   DOMDocument
	 * @uses   DOMElement
	 */
	private function get_toc( string $content ): array {
		$doc = new DOMDocument();
		$doc->loadHTML( mb_convert_encoding( '<html>' . $content . '</html>', 'HTML-ENTITIES', 'UTF-8' ) );

		$toc = array();
		foreach ( $doc->getElementsByTagName( 'body' )->item( 0 )->childNodes as $child ) {
			if ( $child instanceof DOMElement ) {
				$is_header = 'h1' === $child->tagName || 'h2' === $child->tagName || 'h3' === $child->tagName || 'h4' === $child->tagName;
				if ( $is_header ) {
					$toc[] = array(
						'tag'  => $child->tagName,
						'text' => $child->nodeValue,
					);
				}
			}
		}

		return $toc;
	}

	/**
	 * Get series posts
	 *
	 * @param  WP_Post $post Post instance.
	 * @return Simple_Post[]
	 * @uses   WP_Query
	 * @uses   Simple_Post
	 */
	private function get_series( WP_Post $post ): array {
		$terms  = wp_get_post_terms( $post->ID, 'series' );
		$series = array();

		if ( is_wp_error( $terms ) ) {
			return array();
		}

		$terms = array_pop( $terms );

		if ( $terms ) {
			$query = new WP_Query(
				array(
					'post_type'      => 'post',
					'post_status'    => 'publish',
					'tax_query'      => array(
						array(
							'taxonomy'         => 'series',
							'terms'            => $terms->term_id,
							'include_children' => false,
						),
					),
					'posts_per_page' => -1,
				)
			);

			foreach ( $query->posts as $post ) {
				$series[] = Simple_Post::get_instance( 'simple-post-' . $post->ID, $post );
			}
		}

		return $series;
	}

	/**
	 * Get series posts
	 *
	 * @param  WP_Post $item     Post instance.
	 * @param  bool    $previous Is previous post.
	 * @return ?Simple_Post
	 * @uses   Simple_Post
	 */
	private function get_prevnext( WP_Post $item, bool $previous ): ?Simple_Post {
		// phpcs:disable WordPress.WP.GlobalVariablesOverride.OverrideProhibited
		global $post;
		$gpost  = $post;
		$post   = $item;
		$result = get_adjacent_post( true, '', $previous, 'category' );
		$post   = $gpost;
		// phpcs:enable WordPress.WP.GlobalVariablesOverride.OverrideProhibited

		if ( ! $result ) {
			return null;
		}

		return Simple_Post::get_instance( 'simple-post-' . $result->ID, $result );
	}

	/**
	 * Get related posts
	 *
	 * @param  WP_Post $post Post instance.
	 * @return Simple_Post[]
	 * @uses   WP_Query
	 * @uses   Simple_Post
	 */
	private function get_related( WP_Post $post ): array {
		$post_id   = $post->ID;
		$tax_query = array_merge(
			array( 'relation' => 'OR' ),
			array(
				array(
					'taxonomy' => 'post_tag',
					'field'    => 'id',
					'terms'    => array_map(
						function( $term ) {
							return $term->term_id;
						},
						wp_get_post_tags( $post_id )
					),
				),
			),
			array(
				array(
					'taxonomy'         => 'category',
					'field'            => 'id',
					'terms'            => array_map(
						function( $term ) {
							return $term->term_id;
						},
						wp_get_object_terms( $post_id, 'category' )
					),
					'include_children' => false,
				),
			)
		);

		$query_args = array(
			'post_status'         => 'publish',
			'post_type'           => 'post',
			'posts_per_page'      => 4,
			'ignore_sticky_posts' => 1,
			'post__not_in'        => array( $post_id ),
			'tax_query'           => $tax_query,
		);

		$query = new WP_Query( $query_args );
		$posts = array();

		foreach ( $query->posts as $post ) {
			$posts[] = Simple_Post::get_instance( 'simple-post-' . $post->ID, $post );
		}

		return $posts;
	}
}
// phpcs:enable WordPress.NamingConventions.ValidVariableName
