<?php
namespace Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Sujin\V1;

use Sujin\Wordpress\Theme\Sujin\Transient;
use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Abs_Rest_Base;
use Sujin\Wordpress\Theme\Sujin\Helpers\Rest_Helper;
use Sujin\Wordpress\Theme\Sujin\Theme_Customizer;
use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Items\Post as PostItem;

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
	protected const CACHE_TTL     = 12 * HOUR_IN_SECONDS;
	protected const RESOURCE_NAME = 'posts';
	protected const ITEM_NAME     = 'post';

	public function __construct() {
		parent::__construct();
		add_action( 'save_post', array( $this, 'delete_transient' ) );
	}

	public function delete_transient(): void {
		foreach ( $this->get_transient_keys() as $key ) {
			delete_transient( $key );
		}
	}

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
						'slug'      => array(
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
						'keyword'   => array(
							'description'       => 'Keyword',
							'type'              => 'string',
							'required'          => false,
							'sanitize_callback' => 'sanitize_text_field',
						),
						'page'      => array(
							'description'       => 'Page Number',
							'type'              => 'string',
							'required'          => false,
							'sanitize_callback' => 'sanitize_text_field',
						),
						'per_page'  => array(
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
		$slug = $request->get_param( 'slug' );

		if ( ! $slug ) {
			return null;
		}

		$transient_key = $this->get_transient_key() . '-sinlge-' . $slug;
		$transient     = Transient::get_transient( $transient_key );

		if ( $transient && ! $transient->is_expired() && ! self::DEV_MODE ) {
			return rest_ensure_response( $transient->items );
		}

		$query_args = array(
			'name'           => $slug,
			'post_type'      => array( 'post', 'page' ),
			'post_status'    => 'publish',
			'posts_per_page' => 1,
		);
		$post = new WP_Query( $query_args );
		$post = $post->posts;

		if ( empty( $post ) ) {
			return $this->error_not_found_post();
		}

		$post = array_pop( $post );
		$post = new PostItem( $post );
		$post = json_decode( wp_json_encode( $post ), true );

		$transient = new Transient( $post, self::CACHE_TTL );
		set_transient( $transient_key, wp_json_encode( $transient ) );
		$this->add_transient_keys( $transient_key );

		return rest_ensure_response( $post );
	}

	public function get_items( $request ) {
		// Single
		$single = $this->get_item( $request );
		if ( $single ) {
			return $single;
		}

		$list_type = $request->get_param( 'list_type' );
		$keyword   = $request->get_param( 'keyword' );
		$page      = $request->get_param( 'page' ) ?? 1;
		$per_page  = $request->get_param( 'per_page' ) ?? 12;

		$transient_key = $this->get_transient_key() . '-archive-' . $list_type . '-' . $keyword . '-' . $page . '-' . $per_page;
		$transient     = Transient::get_transient( $transient_key );

		if ( $transient && ! $transient->is_expired() && ! self::DEV_MODE ) {
			return rest_ensure_response( $transient->items );
		}

		$args = $this->get_items_query_args( $request );
		$term = $args[1];
		$args = $args[0];

		// The term is not exist
		if ( false === $term ) {
			return rest_ensure_response( $this->error_not_found_term( $list_type ) );
		}

		// Query posts
		$posts         = new WP_Query( $args );
		$found_posts   = $posts->found_posts;
		$max_num_pages = $posts->max_num_pages;

		$posts = $posts->posts;

		foreach ( array_keys( $posts ) as $key ) {
			$posts[ $key ] = new PostItem( $posts[ $key ] );
			$posts[ $key ] = json_decode( wp_json_encode( $posts[ $key ] ), true );
		}

		$return = rest_ensure_response( $posts );
		$return->header( 'X-WP-Total', $found_posts );
		$return->header( 'X-WP-TotalPages', $max_num_pages );

		if ( 'search' !== $term ) {
			$return->header( 'x-wp-term-description', urlencode( wpautop( $term->description ) ) );
			$return->header( 'x-wp-term-name', urlencode( $term->name ) );

			$thumbnail = Term_Meta_Attachment::get_instance( 'Thumbnail' )
				->get( $term->term_id );
			$thumbnail = wp_get_attachment_image_src( $thumbnail, 'full' )[0];
			$return->header( 'x-wp-term-thumbnail', $thumbnail );

			$transient = new Transient( $return, self::CACHE_TTL );
			set_transient( $transient_key, wp_json_encode( $transient ) );
			$this->add_transient_keys( $transient_key );
			return $return;
		}

		$keyword = $posts ? 'Search result for ' . $keyword : 'No search result';
		$return->header( 'x-wp-term-description', urlencode( wpautop( $keyword ) ) );
		$return->header( 'x-wp-term-name', $keyword );

		$transient = new Transient( $return, self::CACHE_TTL );
		set_transient( $transient_key, wp_json_encode( $transient ) );
		$this->add_transient_keys( $transient_key );

		return $return;
	}

	private function get_items_query_args( WP_REST_Request $request ): array {
		$list_type = $request->get_param( 'list_type' );
		$keyword   = $request->get_param( 'keyword' );
		$page      = $request->get_param( 'page' ) ?? 1;
		$per_page  = $request->get_param( 'per_page' ) ?? 12;
		$taxonomy  = null;
		$term      = 'search';

		// Query args
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
				$term                  = get_term_by( 'slug', $keyword, $taxonomy );
				break;

			case 'tag':
				$args['tag'] = $keyword;
				$taxonomy    = 'post_tag';
				$term        = get_term_by( 'slug', $keyword, $taxonomy );
				break;

			case 'search':
				$args['s'] = $keyword;
				$taxonomy  = 'search';
				break;
		}

		return array( $args, $term, $list_type );
	}

	private function error_not_found_term( string $list_type ): WP_Error {
		return new WP_Error(
			'NOT_FOUND',
			'The ' . $list_type . ' does not exist.',
			array(
				'status' => self::STATUS_CODE_NOT_FOUND,
			)
		);
	}

	private function error_not_found_post(): WP_Error {
		return new WP_Error(
			'NOT_FOUND',
			'The article does not exist.',
			array(
				'status' => self::STATUS_CODE_NOT_FOUND,
			)
		);
	}
}
