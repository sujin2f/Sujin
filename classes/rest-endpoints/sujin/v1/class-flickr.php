<?php
namespace Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Sujin\V1;

use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Sujin\V1;
use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Items\Flickr as Flickr_Item;

use Sujin\Wordpress\WP_Express\Fields\Settings\Input;
use Sujin\Wordpress\WP_Express\Helpers\Trait_Singleton;
use Sujin\Wordpress\WP_Express\Helpers\Transient;

// phpcs:disable Generic.WhiteSpace.DisallowSpaceIndent.SpacesUsed
use WP_REST_Controller,
    WP_REST_Server,
    WP_REST_Response,
    WP_REST_Request,
    WP_Error;
// phpcs:enable Generic.WhiteSpace.DisallowSpaceIndent.SpacesUsed

class Flickr extends V1 {
	use Trait_Singleton;

	protected const CACHE_TTL     = 12 * HOUR_IN_SECONDS;
	protected const RESOURCE_NAME = 'flickr';

	public const FLICKR_ID = 'Flicker ID';

	public function __construct() {
		parent::__construct();

		$option = Input::get_instance( self::FLICKR_ID )->get_id();
		add_action( "update_option_{$option}", array( $this, 'delete_transient' ) );
	}

	public function delete_transient() {
		delete_transient( $this->get_transient_key() );
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
				),
				'schema' => array( $this, 'get_item_schema' ),
			)
		);
	}

	public function get_items( $_ ) {
		// Get transient
		$transient = Transient::get_transient( $this->get_transient_key() );

		if ( $transient && ! $transient->is_expired() && ! SUJIN_DEV_MODE ) {
			return rest_ensure_response( $transient->items );
		}

		// Get URL
		$url = $this->get_request_url();

		if ( is_null( $url ) ) {
			return rest_ensure_response( $this->error_no_id() );
		}

		// Request
		$response = wp_remote_get( $url );

		// Request fails
		if ( ! $this->is_success( $response ) ) {
			if ( $transient && $transient->items ) {
				return rest_ensure_response( $transient->items );
			}

			return rest_ensure_response( $this->error_request_fail() );
		}

		$response = json_decode( wp_json_encode( $response ), true );
		$items    = json_decode( $response['body'], true );
		$items    = $items['items'] ?: array();

		foreach ( array_keys( $items ) as $key ) {
			$items[ $key ] = new Flickr_Item( $items[ $key ] );
			$items[ $key ] = json_decode( wp_json_encode( $items[ $key ] ), true );
		}

		shuffle( $items );
		$items = array_slice( $items, 0, 12 );

		$transient = new Transient( $items, self::CACHE_TTL );
		$transient->set_transient( $this->get_transient_key() );

		return rest_ensure_response( $items );
	}

	private function get_request_url(): ?string {
		$flickr_id = Input::get_instance( self::FLICKR_ID )->get();

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
			'EMPTY_SETTING',
			'You must input the Flickr ID in the setting.',
			array(
				'status' => self::STATUS_CODE_NOT_IMPLEMENTED,
			)
		);
	}

	private function error_request_fail(): WP_Error {
		return new WP_Error(
			'NOT_FOUND',
			'The account does not exist.',
			array(
				'status' => self::STATUS_CODE_NOT_FOUND,
			)
		);
	}
}
