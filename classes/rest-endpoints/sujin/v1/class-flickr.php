<?php
namespace Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Sujin\V1;

use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Abs_Rest_Base;
use Sujin\Wordpress\Theme\Sujin\Helpers\Utilities;
use Sujin\Wordpress\WP_Express\Fields\Settings\Input;

// phpcs:disable Generic.WhiteSpace.DisallowSpaceIndent.SpacesUsed
use WP_REST_Controller,
    WP_REST_Server,
    WP_REST_Response,
    WP_REST_Request,
    WP_Error;
// phpcs:enable Generic.WhiteSpace.DisallowSpaceIndent.SpacesUsed

if ( ! defined( 'ABSPATH' ) ) {
	header( 'Status: 404 Not Found' );
	header( 'HTTP/1.1 404 Not Found' );
	exit();
}

class Flickr extends Abs_Rest_Base {
	protected const CACHE_TTL     = 12 * HOUR_IN_SECONDS;
	protected const RESOURCE_NAME = 'flickr';

	public function __construct() {
		parent::__construct();

		$option = Input::get_instance( 'Flicker ID' )->get_id();
		add_action( "update_option_{$option}", array( $this, 'delete_transient' ) );
	}

	public function create_rest_routes() {
		register_rest_route(
			self::NAMESPACE,
			'/' . self::RESOURCE_NAME,
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_items' ),
					'permission_callback' => array( $this, 'get_items_permissions_check' ),
				),
				'schema' => array( $this, 'get_item_schema' ),
			)
		);
	}

	public function get_items_permissions_check( $request ): bool {
		return true;
	}

	public function get_items( $request ) {
		$this->request = $request;
		$transient     = $this->get_transient();

		if ( $transient[ self::KEY_RETURN ] ) {
			return rest_ensure_response( $transient[ self::KEY_ITEMS ] );
		}

		$url = $this->get_request_url();

		if ( is_null( $url ) ) {
			return rest_ensure_response( $this->error_no_id() );
		}

		$response = wp_remote_get( $url );

		if ( ! $this->is_success( $response ) ) {
			if ( $transient[ self::KEY_ITEMS ] ) {
				return rest_ensure_response( $transient[ self::KEY_ITEMS ] );
			}

			return rest_ensure_response( $this->error_request_fail() );
		}

		$body  = Utilities::get_item( $response, 'body' ) ?? array();
		$body  = json_decode( $body, true );
		$items = Utilities::get_item( $body, 'items' );

		foreach ( array_keys( $items ) as $arr_key ) {
			$items[ $arr_key ] = $this->prepare_item_for_response( $items[ $arr_key ], $request )->data;
		}

		$this->set_transient( $items );

		return rest_ensure_response( $items );
	}

	private function get_request_url(): ?string {
		$flickr_id = Input::get_instance( 'Flicker ID' )->get();

		if ( ! $flickr_id ) {
			return null;
		}

		return sprintf(
			'http://api.flickr.com/services/feeds/photos_public.gne?id=%s&format=json&nojsoncallback=1',
			$flickr_id
		);
	}

	private function error_no_id(): WP_Error {
		return new WP_Error(
			'empty_setting',
			'You must input the Flickr ID in the setting.',
			array(
				'status' => self::STATUS_CODE_NOT_IMPLEMENTED,
			)
		);
	}

	private function error_request_fail(): WP_Error {
		return new WP_Error(
			'no_content',
			'The account has no photo.',
			array(
				'status' => self::STATUS_CODE_NO_CONTENT,
			)
		);
	}

	public function prepare_item_for_response( $item, $request ): WP_REST_Response {
		$item          = (array) $item;
		$item['media'] = array(
			'origin' => str_replace( '_m.', '.', $item['media']['m'] ),
			's'      => str_replace( '_m.', '_s.', $item['media']['m'] ),
			't'      => str_replace( '_m.', '_t.', $item['media']['m'] ),
			'b'      => str_replace( '_m.', '_b.', $item['media']['m'] ),
			'm'      => $item['media']['m'],
		);

		$item = array_filter( $item, array( $this, 'filter_schema' ), ARRAY_FILTER_USE_KEY );
		return rest_ensure_response( $item );
	}

	// TODO
	public function prepare_response_for_collection( $response ): array {
		if ( ! ( $response instanceof WP_REST_Response ) ) {
			return $response;
		}

		return (array) $response->get_data();
	}

	public function get_item_schema(): array {
		return array(
			'$schema'    => 'http://json-schema.org/draft-04/schema#',
			'title'      => 'flickr',
			'type'       => 'object',
			'properties' => array(
				'title' => array(
					'description' => 'The title of the photo.',
					'type'        => 'string',
					'context'     => array( 'view', 'edit', 'embed' ),
					'readonly'    => true,
				),
				'link'  => array(
					'description' => 'Flickr URL for the image',
					'type'        => 'string',
					'context'     => array( 'view', 'edit', 'embed' ),
					'readonly'    => true,
				),
				'media' => array(
					'description' => 'Image URLs',
					'type'        => 'array',
					'context'     => array( 'view', 'edit', 'embed' ),
					'readonly'    => true,
				),

			),
		);
	}
}
