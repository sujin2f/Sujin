<?php
/**
 * Post Item
 *
 * @project Sujinc.com
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
*/

namespace Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Items;

use WP_Post, WP_Query;

// phpcs:disable WordPress.NamingConventions.ValidVariableName.MemberNotSnakeCase
// phpcs:disable WordPress.NamingConventions.ValidVariableName.NotSnakeCaseMemberVar
final class Post extends Simple_Post {
	public $content;
	public $excerpt;
	public $commentStatus;
	public $tags     = array();
	public $series   = array();
	public $prevNext = array();
	public $related  = array();
	public $type;

	private const BREAKS      = array( '<br />', '<br/>', '<br>', '&lt;br /&gt;', '&lt;br/&gt;', '&lt;br&gt;' );
	protected const ITEM_NAME = 'post';

	/**
	 * Create MenuItem from WP_Post
	*/
	public function __construct( WP_Post $post ) {
		parent::__construct( $post );

		$this->content = do_shortcode( wpautop( $post->post_content ) );
		$this->type    = $post->post_type;

		// Excerpt
		$this->excerpt = str_replace( self::BREAKS, "\r\n\r\n", $post->post_excerpt );
		$this->excerpt = wpautop( $this->excerpt );

		// Tags
		$this->tags = wp_get_post_tags( $post->ID );
		foreach ( array_keys( $this->tags ) as $key ) {
			$this->tags[ $key ] = new Tag( $this->tags[ $key ] );
		}

		// Series / PrevNext / Related
		$this->series   = $this->get_series( $post );
		$this->prevNext = array(
			'prev' => $this->get_prevnext( $post, true ),
			'next' => $this->get_prevnext( $post, false ),
		);
		$this->related  = $this->get_related( $post );
	}

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
					'tax_query'      => array(
						array(
							'taxonomy' => 'series',
							'terms'    => $terms->term_id,
						),
					),
					'posts_per_page' => -1,
				)
			);

			foreach ( $query->posts as $post ) {
				$series[] = new Simple_Post( $post );
			}
		}

		return $series;
	}

	private function get_prevnext( WP_Post $item, bool $previous ): ?Simple_Post {
		global $post;
		$post   = $item;
		$result = get_adjacent_post( true, '', $previous, 'category' );

		if ( ! $result ) {
			return null;
		}

		return new Simple_Post( $result );
	}

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
					'taxonomy' => 'category',
					'field'    => 'id',
					'terms'    => array_map(
						function( $term ) {
							return $term->term_id;
						},
						wp_get_object_terms( $post_id, 'category' )
					),
				),
			)
		);

		$query_args = array(
			'posts_per_page'      => 4,
			'ignore_sticky_posts' => 1,
			'post__not_in'        => array( $post_id ),
			'tax_query'           => $tax_query,
		);

		$query = new WP_Query( $query_args );
		$posts = array();

		foreach ( $query->posts as $post ) {
			$posts[] = new Simple_Post( $post );
		}

		return $posts;
	}
}
// phpcs:enable
