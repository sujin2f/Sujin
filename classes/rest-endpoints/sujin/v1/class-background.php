<?php
namespace Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Sujin\V1;

use Sujin\Wordpress\Theme\Sujin\Transient;
use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Abs_Rest_Base;
use Sujin\Wordpress\Theme\Sujin\Helpers\Rest_Helper;
use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Items\Background as BackgroundItem;

use Sujin\Wordpress\WP_Express\Fields\Post_Meta\Attachment as Post_Meta_Attachment;
use Sujin\Wordpress\WP_Express\Fields\Term_Meta\Attachment as Term_Meta_Attachment;
use Sujin\Wordpress\WP_Express\Meta_Box;

// phpcs:disable Generic.WhiteSpace.DisallowSpaceIndent.SpacesUsed
use WP_REST_Controller,
    WP_REST_Server,
    WP_REST_Response,
    WP_Error,
    WP_Query;
// phpcs:enable Generic.WhiteSpace.DisallowSpaceIndent.SpacesUsed

if ( ! defined( 'ABSPATH' ) ) {
	header( 'Status: 404 Not Found' );
	header( 'HTTP/1.1 404 Not Found' );
	exit();
}

class Background extends Abs_Rest_Base {
	protected const RESOURCE_NAME = 'background';

	public function __construct() {
		parent::__construct();

		add_action( 'attachment_updated', array( $this, 'delete_transient' ) );
		add_action( 'add_attachment', array( $this, 'delete_transient' ) );
	}

	public function delete_transient() {
		delete_transient( $this->get_transient_key() );
	}

	public function create_rest_routes() {
		register_rest_route(
			self::NAMESPACE,
			'/' . self::RESOURCE_NAME . '/random',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_items' ),
					'permission_callback' => array( $this, 'permissions_check' ),
				),
				'schema' => array( $this, 'get_item_schema' ),
			)
		);
	}

	public function get_items( $_ ) {
		// Get transient
		$transient = Transient::get_transient( $this->get_transient_key() );

		if ( $transient && ! $transient->is_expired() && ! self::DEV_MODE ) {
			return rest_ensure_response( $transient->items );
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
			$posts[ $arr_key ] = new BackgroundItem( $posts[ $arr_key ] );
		}

		$posts = json_decode( wp_json_encode( $posts ), true );
		$posts = array_values( $posts );

		$transient = new Transient( $posts, self::CACHE_TTL );
		set_transient( $this->get_transient_key(), wp_json_encode( $transient ) );

		return rest_ensure_response( $posts );
	}

	private function error_no_content(): WP_Error {
		return new WP_Error(
			'NO_CONTENT',
			'No attachment matched.',
			array(
				'status' => self::STATUS_CODE_NO_CONTENT,
			)
		);
	}
}
