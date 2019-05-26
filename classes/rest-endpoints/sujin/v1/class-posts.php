<?php
namespace Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Sujin\V1;

use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Abs_Rest_Base;
use Sujin\Wordpress\Theme\Sujin\Helpers\Rest_Helper;

use Sujin\Wordpress\WP_Express\Fields\Term_Meta\Attachment as Term_Meta_Attachment;

use WP_REST_Controller, WP_REST_Server, WP_REST_Response, WP_REST_Request, WP_Error, WP_Query;

if ( ! defined( 'ABSPATH' ) ) {
	header( 'Status: 404 Not Found' );
	header( 'HTTP/1.1 404 Not Found' );
	exit();
}

class Posts extends Abs_Rest_Base {
	use Rest_Helper;

	public function __construct() {
		parent::__construct();
		$this->resource_name = 'posts';
	}

	public function create_rest_routes() {
		register_rest_route(
			$this->namespace,
			'/' . $this->resource_name,
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_items' ),
					'permission_callback' => array( $this, 'get_items_permissions_check' ),
				),
				'schema' => array( $this, 'get_item_schema' ),
			)
		);

		register_rest_route(
			$this->namespace,
			'/' . $this->resource_name . '/(?P<slug>[\w-]+)',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_item' ),
					'permission_callback' => array( $this, 'get_items_permissions_check' ),
				),
				'schema' => array( $this, 'get_item_schema' ),
			)
		);

		register_rest_route(
			$this->namespace,
			'/' . $this->resource_name . '/category/(?P<slug>[\w-]+)/page/(?P<page>[0-9]+)',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_items_by_term' ),
					'permission_callback' => array( $this, 'get_items_permissions_check' ),
				),
				'schema' => array( $this, 'get_item_schema' ),
			)
		);

		register_rest_route(
			$this->namespace,
			'/' . $this->resource_name . '/tag/(?P<slug>[\w-]+)/page/(?P<page>[0-9]+)',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_items_by_term' ),
					'permission_callback' => array( $this, 'get_items_permissions_check' ),
				),
				'schema' => array( $this, 'get_item_schema' ),
			)
		);

		register_rest_route(
			$this->namespace,
			'/' . $this->resource_name . '/search/(?P<search>[\w-]+)/page/(?P<page>[0-9]+)',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_search_items' ),
					'permission_callback' => array( $this, 'get_items_permissions_check' ),
				),
				'schema' => array( $this, 'get_item_schema' ),
			)
		);

		register_rest_route(
			$this->namespace,
			'/' . $this->resource_name . '/related/(?P<post_id>[\d]+)',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_related' ),
					'permission_callback' => array( $this, 'get_items_permissions_check' ),
				),
				'schema' => array( $this, 'get_item_schema' ),
			)
		);
	}

	public function get_items_permissions_check( $request ): bool {
		return true;
	}

	public function get_item( $request ) {
		$name = $request->get_param( 'slug' );
		$args = array(
			'name'        => $name,
			'post_type'   => 'post',
			'post_status' => 'publish',
			'numberposts' => 1
		);
		$posts = get_posts( $args );

		if ( $posts ) {
			$response = $this->remote_get( $posts[0]->ID );
		} else {
			$response = array();
		}

		return rest_ensure_response( $response );
	}

	public function get_items( $request ) {
		$url = '';

		$per_page = $request->get_param( 'per_page' );
		if ( $per_page ) {
			$url = '?per_page=' . $per_page;
		}

		$response = $this->remote_get( $url );
		return rest_ensure_response( $response );
	}

	public function get_items_by_term( $request ) {
		$route     = $request->get_route();
		$taxonomy  = 'post_tag';
		$url_param = 'tags';

		if ( false !== strpos( $route, '/posts/category/' ) ) {
			$taxonomy  = 'category';
			$url_param = 'categories';
		}

		$term = $request->get_param( 'slug' );
		$term = get_term_by( 'slug', $term, $taxonomy );

		if ( ! $term ) {
			return rest_ensure_response( array() );
		}

		$url = '?' . $url_param . '[]=' . $term->term_id;
		$url .= $request->get_param( 'page' ) ? '&page=' . $request->get_param( 'page' ) : '';

		$per_page = $request->get_param( 'per_page' );
		if ( $per_page ) {
			$url.= '&per_page=' . $per_page;
		}

		$page = $request->get_param( 'page' );
		if ( $page ) {
			$url.= '&page=' . $page;
		}

		$response = $this->remote_get( $url );

		$response->header( 'x-wp-term-description', urlencode( $term->description ) );
		$response->header( 'x-wp-term-name', urlencode( $term->name ) );

		$thumbnail = Term_Meta_Attachment::get_instance( 'Thumbnail' )
			->get( $term->term_id );
		$thumbnail = wp_get_attachment_image_src( $thumbnail, 'full' )[0];
		$response->header( 'x-wp-term-thumbnail', $thumbnail );

		return rest_ensure_response( $response );
	}

	public function get_search_items( $request ) {
		$search = $request->get_param( 'search' );
		$url    = '?search=' . $search;

		$per_page = $request->get_param( 'per_page' );
		if ( $per_page ) {
			$url.= '&per_page=' . $per_page;
		}

		$page = $request->get_param( 'page' );
		if ( $page ) {
			$url.= '&page=' . $page;
		}

		$response = $this->remote_get( $url );
		return rest_ensure_response( $response );
	}

	private function remote_get( string $url ) {
		$response = wp_remote_get( 'http://localhost/wp-json/wp/v2/posts/' . $url );

		if ( is_wp_error( $response ) ) {
			return $response;
		}

		$headers  = $response['headers']->getAll();
		$response = new WP_REST_Response( json_decode( $response['body'] ) );

		$response->header( 'access-control-expose-headers', 'X-WP-Total, X-WP-TotalPages, X-WP-Term-Description, X-WP-Term-Name, X-WP-Term-Thumbnail' );

		if ( array_key_exists( 'x-wp-total', $headers ) ) {
			$response->header( 'x-wp-total', $headers['x-wp-total'] );
		}

		if ( array_key_exists( 'x-wp-totalpages', $headers ) ) {
			$response->header( 'x-wp-totalpages', $headers['x-wp-totalpages'] );
		}

		return $response;

	}
}
