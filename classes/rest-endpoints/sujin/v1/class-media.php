<?php
namespace Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Sujin\V1;

use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Abs_Rest_Base;
use Sujin\Wordpress\Theme\Sujin\Helpers\Rest_Helper;

use Sujin\Wordpress\WP_Express\Fields\Post_Meta\Attachment as Post_Meta_Attachment;
use Sujin\Wordpress\WP_Express\Fields\Term_Meta\Attachment as Term_Meta_Attachment;
use Sujin\Wordpress\WP_Express\Meta_Box;

use WP_REST_Controller, WP_REST_Server, WP_REST_Response, WP_Error, WP_Query;

if ( ! defined( 'ABSPATH' ) ) {
	header( 'Status: 404 Not Found' );
	header( 'HTTP/1.1 404 Not Found' );
	exit();
}

class Media extends Abs_Rest_Base {
	use Rest_Helper;

	protected const RESOURCE_NAME = 'media';

	public function __construct() {
		parent::__construct();

		add_action( 'attachment_updated', array( $this, 'delete_transient' ) );
		add_action( 'add_attachment', array( $this, 'delete_transient' ) );
	}

	public function create_rest_routes() {
		register_rest_route(
			self::NAMESPACE,
			'/' . self::RESOURCE_NAME . '/random',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_random_items' ),
					'permission_callback' => array( $this, 'get_items_permissions_check' ),
				),
				'schema' => array( $this, 'get_item_schema' ),
			)
		);
	}

	public function get_items_permissions_check( $request ): bool {
		return true;
	}

	public function get_random_items( $request ) {
		$this->request = $request;
		$transient     = $this->get_transient();

		if ( $transient[ self::KEY_RETURN ] ) {
			return rest_ensure_response( $transient[ self::KEY_ITEMS ] );
		}

		$posts = get_posts(
			array(
				'posts_per_page' => 10,
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

		if ( empty( $posts ) ) {
			return rest_ensure_response( $this->error_no_content() );
		}

		foreach ( array_keys( $posts ) as $arr_key ) {
			$posts[ $arr_key ] = $this->prepare_item_for_response( $posts[ $arr_key ], $request )->data;
		}

		$this->set_transient( $posts );

		return rest_ensure_response( $posts );
	}

	private function error_no_content(): WP_Error {
		return new WP_Error(
			'no_content',
			'The account has no photo.',
			array(
				'status' => self::STATUS_CODE_NO_CONTENT,
			)
		);
	}

	public function prepare_item_for_response( $item, $request ): WP_REST_Response {
		$fields = $this->get_fields_for_response( $request );
		$item   = array(
			'title'   => $item->post_title,
			'desktop' => wp_get_attachment_image_src( $item->ID, 'large' )[0],
			'mobile'  => wp_get_attachment_image_src( $item->ID, 'medium_large' )[0],
		);
		$item   = array_filter( $item, array( $this, 'filter_schema' ), ARRAY_FILTER_USE_KEY );
		return rest_ensure_response( $item );
	}

	public function get_item_schema(): array {
		return array(
			'$schema'    => 'http://json-schema.org/draft-04/schema#',
			'title'      => 'media',
			'type'       => 'object',
			'properties' => array(
				'title' => array(
					'description' => 'The title of the photo.',
					'type'        => 'string',
					'context'     => array( 'view', 'edit', 'embed' ),
					'readonly'    => true,
				),
				'desktop'  => array(
					'description' => 'URL for desktop',
					'type'        => 'string',
					'context'     => array( 'view', 'edit', 'embed' ),
					'readonly'    => true,
				),
				'mobile' => array(
					'description' => 'URL for mobile',
					'type'        => 'string',
					'context'     => array( 'view', 'edit', 'embed' ),
					'readonly'    => true,
				),
			),
		);
	}
}
