<?php
namespace Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Sujin\V1;

use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Abs_Rest_Base;
use Sujin\Wordpress\Theme\Sujin\Helpers\Rest_Helper;
use Sujin\Wordpress\Theme\Sujin\Theme_Customizer;

use Sujin\Wordpress\WP_Express\Fields\Term_Meta\Attachment as Term_Meta_Attachment;
use Sujin\Wordpress\WP_Express\Fields\Post_Meta\Attachment as Post_Meta_Attachment;

// phpcs:disable Generic.WhiteSpace.DisallowSpaceIndent.SpacesUsed
use WP_Post,
    WP_REST_Controller,
    WP_REST_Server,
    WP_REST_Response,
    WP_REST_Request,
    WP_Error,
    WP_Query;
// phpcs:enable Generic.WhiteSpace.DisallowSpaceIndent.SpacesUsed

if ( ! defined( 'ABSPATH' ) ) {
	header( 'Status: 404 Not Found' );
	header( 'HTTP/1.1 404 Not Found' );
	exit();
}

class Posts extends Abs_Rest_Base {
	protected const CACHE_TTL     = 'never';
	protected const RESOURCE_NAME = 'posts';

	public function create_rest_routes() {
		register_rest_route(
			self::NAMESPACE,
			'/' . self::RESOURCE_NAME,
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_items' ),
					'permission_callback' => array( $this, 'permissions_check' ),
					'args'                => array(
						'slug' => array(
							'description'       => 'Post Slug',
							'type'              => 'string',
							'required'          => false,
							'sanitize_callback' => 'sanitize_text_field',
						),
						'list_type' => array(
							'description'       => 'List Type',
							'type'              => 'string',
							'required'          => false,
							'sanitize_callback' => 'sanitize_text_field',
						),
						'keyword' => array(
							'description'       => 'Keyword',
							'type'              => 'string',
							'required'          => false,
							'sanitize_callback' => 'sanitize_text_field',
						),
						'page' => array(
							'description'       => 'Page Number',
							'type'              => 'string',
							'required'          => false,
							'sanitize_callback' => 'sanitize_text_field',
						),
						'per_page' => array(
							'description'       => 'Posts per page',
							'type'              => 'string',
							'required'          => false,
							'sanitize_callback' => 'sanitize_text_field',
						),
					),
				),
				'schema' => array( $this, 'get_item_schema' ),
			)
		);
	}

	public function get_item( $request ) {
		$name = $request->get_param( 'slug' );
		$this->set_transient_suffix( $name );
		$transient = $this->get_transient();

		if ( $transient[ self::KEY_RETURN ] && ! self::DEV_MODE ) {
			return rest_ensure_response( $transient[ self::KEY_ITEMS ] );
		}

		$args = array(
			'name'        => $name,
			'post_type'   => array( 'post', 'page' ),
			'post_status' => 'publish',
			'posts_per_page' => 1,
		);
		$post = new WP_Query( $args );
		$post = $post->posts;

		if ( empty( $post ) ) {
			return $this->error_not_found();
		}

		$post = array_pop( $post );
		$post = $this->prepare_item_for_response( $post, $request )->data;

		$this->set_transient( $post );


		return rest_ensure_response( $post );
	}

	public function get_items( $request ) {
		// Single
		$slug = $request->get_param( 'slug' );

		if ( $slug ) {
			return $this->get_item( $request );
		}

		// Multiple
		$list_type = $request->get_param( 'list_type' );
		$keyword   = $request->get_param( 'keyword' );
		$page      = $request->get_param( 'page' ) ?? 1;
		$per_page  = $request->get_param( 'per_page' ) ?? 12;
		$taxonomy  = null;

		$this->set_transient_suffix( $list_type . $keyword . $page . $per_page );
		$transient = $this->get_transient();

		if ( $transient[ self::KEY_RETURN ] && ! self::DEV_MODE ) {
			return $transient[ self::KEY_ITEMS ];
		}

		$args = array(
			'post_type'      => 'post',
			'post_status'    => 'publish',
			'posts_per_page' => $per_page,
			'paged'          => $page,
		);

		switch ( $list_type ) {
			case 'category':
				$args['category_name'] = $keyword;
				$taxonomy              = 'category';
				break;

			case 'tag':
				$args['tag'] = $keyword;
				$taxonomy    = 'post_tag';
				break;

			case 'search':
				$args['s'] = $keyword;
				$taxonomy  = 'search';
				break;
		}

		$term  = 'search' === $taxonomy ? $taxonomy : get_term_by( 'slug', $keyword, $taxonomy );
		$posts = new WP_Query( $args );
		$posts = $posts->posts;

		if ( empty( $posts ) ) {
			return $this->error_not_found();
		}

		foreach ( array_keys( $posts ) as $key ) {
			$posts[ $key ] = $this->prepare_item_for_response( $posts[ $key ], $request )->data;
		}

		$return = rest_ensure_response( $posts );

		if ( 'search' !== $term ) {
			$return->header(
				'x-wp-term-description',
				urlencode(
					Theme_Customizer::get_instance()
						->the_excerpt( wpautop( $term->description ) )
				)
			);
			$return->header( 'x-wp-term-name', urlencode( $term->name ) );

			$thumbnail = Term_Meta_Attachment::get_instance( 'Thumbnail' )
				->get( $term->term_id );
			$thumbnail = wp_get_attachment_image_src( $thumbnail, 'full' )[0];
			$return->header( 'x-wp-term-thumbnail', $thumbnail );
		}

		$this->set_transient( $return );

		return $return;
	}

	private function error_not_found(): WP_Error {
		return new WP_Error(
			'not_found',
			'Endpoint has no content',
			array(
				'status' => self::STATUS_CODE_NOT_FOUND,
			)
		);
	}

	public function prepare_item_for_response( $item, $request ): WP_REST_Response {
		$tags = wp_get_post_tags( $item->ID );

		foreach( array_keys( $tags ) as $key ) {
			$tags[ $key ] = array(
				'name'    => $tags[ $key ]->name,
				'term_id' => $tags[ $key ]->term_id,
				'slug'    => $tags[ $key ]->slug,
			);
		}

		$item = array(
			'id'        => $item->ID,
			'date'      => $item->post_date,
			'link'      => get_permalink( $item ),
			'title'     => $item->post_title,
			'content'   => wpautop( do_shortcode( $item->post_content ) ),
			'excerpt'   => $item->post_excerpt,
			'meta'      => array(
				'list'                 => Post_Meta_Attachment::get_instance( 'List' )->get( $item->ID ),
				'icon'                 => Post_Meta_Attachment::get_instance( 'Icon' )->get( $item->ID ),
				'title'                => Post_Meta_Attachment::get_instance( 'Title' )->get( $item->ID ),
				'background'           => Post_Meta_Attachment::get_instance( 'Background' )->get( $item->ID ),
				'use-background-color' => (bool) Post_Meta_Attachment::get_instance( 'Use Background Color' )->get( $item->ID ),
				'background-color'     => Post_Meta_Attachment::get_instance( 'Background Color' )->get( $item->ID ),
				'thumbnail'            => Post_Meta_Attachment::get_instance( 'Thumbnail' )->get( $item->ID ),
			),
			'tags'      => $tags,
			'series'    => array(),
			'thumbnail' => wp_get_attachment_image_src( get_post_thumbnail_id( $item->ID ), 'post-thumbnail' )[0] ?? null,
			'prevnext'  => array(
				'prev' => $this->get_prev_next( $item ),
				'next' => $this->get_prev_next( $item, false ),
			),
			'related'   => $this->get_related( $item->ID ),
		);
		$item = parent::prepare_item_for_response( $item, $request );
		return rest_ensure_response( $item );
	}

	private function get_prev_next( WP_Post $item, bool $previous = true ): ?array {
		global $post;
		$post           = $item;
		$in_same_term   = false;
		$excluded_terms = '';

		$result = get_adjacent_post( $in_same_term, $excluded_terms, $previous );

		if ( ! $result ) {
			return null;
		}

		$result = array(
			'id'    => $result->ID,
			'link'  => get_permalink( $result ),
			'title' => $result->post_title,
			'slug'  => $result->post_name,
		);

		return $result;
	}

	private function get_related( int $post_id ): array {
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
			$posts[] = array(
				'id'        => $post->ID,
				'title'     => $post->post_title,
				'excerpt'   => $post->post_excerpt,
				'date'      => $post->post_date,
				'meta'      => array(
					'list' => Post_Meta_Attachment::get_instance( 'List' )->get( $post->ID ),
				),
				'thumbnail' => wp_get_attachment_image_src( get_post_thumbnail_id( $post->ID ), 'post-thumbnail' )[0] ?? null,
				'link'      => get_permalink( $post->ID ),
			);
		}

		return $posts;
	}

	public function get_item_schema(): array {
		return array(
			'$schema'    => 'http://json-schema.org/draft-04/schema#',
			'title'      => 'post',
			'type'       => 'object',
			'properties' => array(
				'id' => array(
					'description' => 'Unique ID',
					'type'        => 'integer',
					'context'     => array( 'view', 'edit', 'embed' ),
					'readonly'    => true,
				),
				'date' => array(
					'description' => 'Date',
					'type'        => 'string',
					'context'     => array( 'view', 'edit', 'embed' ),
					'readonly'    => true,
				),
				'link'  => array(
					'description' => 'Link URL',
					'type'        => 'string',
					'context'     => array( 'view', 'edit', 'embed' ),
					'readonly'    => true,
				),
				'title' => array(
					'description' => 'Title',
					'type'        => 'string',
					'context'     => array( 'view', 'edit', 'embed' ),
					'readonly'    => true,
				),
				"content" => array(
					'description' => 'Content',
					'type'        => 'string',
					'context'     => array( 'view', 'edit', 'embed' ),
					'readonly'    => true,
				),
				"excerpt" => array(
					'description' => 'Excerpt',
					'type'        => 'string',
					'context'     => array( 'view', 'edit', 'embed' ),
					'readonly'    => true,
				),
				"comment_status" => array(
					'description' => 'Comment status',
					'type'        => 'string',
					'context'     => array( 'view', 'edit', 'embed' ),
					'readonly'    => true,
				),
				"meta" => array(
					'description' => 'Meta data',
					'type'        => 'array',
					'context'     => array( 'view', 'edit', 'embed' ),
					'readonly'    => true,
				),
				"tags" => array(
					'description' => 'Tags',
					'type'        => 'array',
					'context'     => array( 'view', 'edit', 'embed' ),
					'readonly'    => true,
				),
				"series" => array(
					'description' => 'Series',
					'type'        => 'array',
					'context'     => array( 'view', 'edit', 'embed' ),
					'readonly'    => true,
				),
				"thumbnail" => array(
					'description' => 'Thumbnail',
					'type'        => 'string',
					'context'     => array( 'view', 'edit', 'embed' ),
					'readonly'    => true,
				),
				'prevnext' => array(
					'description' => 'Prev / Next',
					'type'        => 'array',
					'context'     => array( 'view', 'edit', 'embed' ),
					'readonly'    => true,
				),
				'related' => array(
					'description' => 'Related contents',
					'type'        => 'array',
					'context'     => array( 'view', 'edit', 'embed' ),
					'readonly'    => true,
				),
			),
		);
	}
}
