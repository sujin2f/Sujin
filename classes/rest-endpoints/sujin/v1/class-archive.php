<?php
namespace Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Sujin\V1;

use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\{
	Sujin\V1,
	Items\Archive as Archive_Item,
	Items\Post as Post_Item,
};

use Sujin\Wordpress\WP_Express\Fields\Term_Meta\Attachment as Term_Meta_Attachment;
use Sujin\Wordpress\WP_Express\Helpers\Trait_Singleton;
use Sujin\Wordpress\WP_Express\Helpers\Transient;

// phpcs:disable Generic.WhiteSpace.DisallowSpaceIndent.SpacesUsed
use WP_Post,
	WP_REST_Controller,
	WP_REST_Server,
	WP_REST_Response,
	WP_REST_Request,
	WP_Error,
	WP_Query,
	stdClass;
// phpcs:enable Generic.WhiteSpace.DisallowSpaceIndent.SpacesUsed

if ( ! defined( 'ABSPATH' ) ) {
	header( 'Status: 404 Not Found' );
	header( 'HTTP/1.1 404 Not Found' );
	exit();
}

class Archive extends V1 {
	use Trait_Singleton;

	protected const CACHE_TTL     = 12 * HOUR_IN_SECONDS;
	protected const RESOURCE_NAME = 'archive';

	public function __construct() {
		parent::__construct();
		add_action( 'save_post', array( $this, 'delete_transient' ) );
	}

	public function delete_transient(): void {
		foreach ( $this->get_transient_keys() as $key ) {
			delete_transient( $key );
		}
		$this->delete_transient_keys();
	}

	public function create_rest_routes() {
		register_rest_route(
			self::NAMESPACE,
			'/' . self::RESOURCE_NAME . '/(?P<type>(category|tag|search|recentPosts))/(?P<slug>[\w]+)/(?P<page>[\d]+)',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_items' ),
					'permission_callback' => array( $this, 'permissions_check' ),
					'args'                => array(
						'type' => array(
							'description'       => 'List Type',
							'type'              => 'string',
							'enum'              => array( 'category', 'tag', 'search', 'recentPosts' ),
							'sanitize_callback' => 'sanitize_text_field',
						),
						'slug' => array(
							'description'       => 'Slug',
							'type'              => 'string',
							'sanitize_callback' => 'sanitize_text_field',
						),
						'page' => array(
							'description'       => 'Page Number',
							'type'              => 'integer',
							'sanitize_callback' => 'absint',
							'default'           => 1,
						),
					),
				),
				'schema' => array( $this, 'get_item_schema' ),
			)
		);
	}

	// @todo per_page to option value
	public function get_items( $request ) {
		$type     = $request->get_param( 'type' );
		$slug     = $request->get_param( 'slug' );
		$page     = $request->get_param( 'page' ) ?? 1;
		$per_page = 12;

		$transient_key = $this->get_transient_key() . '-archive-' . $type . '-' . $slug . '-' . $page . '-' . $per_page;
		$transient     = Transient::get_transient( $transient_key );

		if ( $transient && ! $transient->is_expired() && ! SUJIN_DEV_MODE ) {
			return rest_ensure_response( $transient->items );
		}

		if ( 'recentPosts' === $type ) {
			$slug     = null;
			$per_page = 4;
		}

		switch ( $type ) {
			case 'category':
				$term = get_term_by( 'slug', $slug, 'category' );
				break;
			case 'tag':
				$term = get_term_by( 'slug', $slug, 'post_tag' );
				break;
			default:
				$term              = new stdClass();
				$term->description = 'Search result for ' . $slug;
				$term->name        = $slug;
				$term->term_id     = -1;
				break;
		}

		// The term is not exist
		if ( false === $term ) {
			return rest_ensure_response( $this->error_not_found_term( $type ) );
		}

		$args = array(
			'post_type'      => 'post',
			'post_status'    => 'publish',
			'posts_per_page' => $per_page,
			'paged'          => $page,
		);

		if ( 'search' === $type ) {
			$args['s'] = $slug;
		}

		if ( 'category' === $type ) {
			$args['category_name'] = $slug;
		}

		if ( 'tag' === $type ) {
			$args['tag_slug__and'] = $slug;
		}

		// Query posts
		$posts    = new WP_Query( $args );
		$response = new Archive_Item();

		foreach ( $posts->posts as $post ) {
			$response->append_item( new Post_Item( $post ) );
		}

		$thumbnail = Term_Meta_Attachment::get_instance( 'Thumbnail' )->get( $term->term_id ) ?: -1;
		$response->set_thumbnail( $thumbnail );

		$response->title       = $term->name;
		$response->description = $term->description;
		$response->total       = $posts->found_posts;
		$response->totalPages  = $posts->max_num_pages; // phpcs:ignore WordPress.NamingConventions.ValidVariableName.NotSnakeCaseMemberVar

		$response = json_decode( wp_json_encode( $response ), true );

		$transient = new Transient( $response, self::CACHE_TTL );
		$transient->set_transient( $transient_key );
		$this->add_transient_keys( $transient_key );

		return $response;
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
}
