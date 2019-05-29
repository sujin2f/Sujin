<?php
namespace Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Sujin\V1;

use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Abs_Rest_Base;
use Sujin\Wordpress\Theme\Sujin\Helpers\Rest_Helper;

use Sujin\Wordpress\WP_Express\Fields\Post_Meta\Attachment as Post_Meta_Attachment;
use Sujin\Wordpress\WP_Express\Fields\Term_Meta\Attachment as Term_Meta_Attachment;
use Sujin\Wordpress\WP_Express\Meta_Box;

use WP_REST_Controller, WP_REST_Server, WP_REST_Response, WP_REST_Request, WP_Error, WP_Query;

if ( ! defined( 'ABSPATH' ) ) {
	header( 'Status: 404 Not Found' );
	header( 'HTTP/1.1 404 Not Found' );
	exit();
}

class Media extends Abs_Rest_Base {
	use Rest_Helper;

	public function __construct() {
		parent::__construct();
		$this->resource_name = 'media';
	}

	public function create_rest_routes() {
		register_rest_route(
			$this->namespace,
			'/' . $this->resource_name . '/random',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_random_background' ),
					'permission_callback' => array( $this, 'get_items_permissions_check' ),
				),
				'schema' => array( $this, 'get_item_schema' ),
			)
		);
	}

	public function get_items_permissions_check( $request ): bool {
		return true;
	}

	public function get_random_background( $request ) {
		$posts = get_posts(
			array(
				'posts_per_page' => 1,
				'tax_query'      => array(
					array(
						'taxonomy' => 'category',
						'field'    => 'slug',
						'terms'    => 'background',
					),
				),
				'orderby'        => 'rand',
				'post_type'      => 'attachment',
			)
		);

		return rest_ensure_response(
			array(
				'large'       => wp_get_attachment_image_src( $posts[0]->ID, 'large' )[0],
				'mediumLarge' => wp_get_attachment_image_src( $posts[0]->ID, 'medium_large' )[0],
			)
		);
	}
}
