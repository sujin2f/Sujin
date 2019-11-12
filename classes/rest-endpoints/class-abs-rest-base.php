<?php
namespace Sujin\Wordpress\Theme\Sujin\Rest_Endpoints;

use Sujin\Wordpress\Theme\Sujin\Helpers\Utilities;

// phpcs:disable Generic.WhiteSpace.DisallowSpaceIndent.SpacesUsed
use WP_REST_Controller,
    WP_REST_Response,
    WP_HTTP_Requests_Response;
// phpcs:enable Generic.WhiteSpace.DisallowSpaceIndent.SpacesUsed

if ( ! defined( 'ABSPATH' ) ) {
	header( 'Status: 404 Not Found' );
	header( 'HTTP/1.1 404 Not Found' );
	exit();
}

abstract class Abs_Rest_Base extends WP_REST_Controller {
	protected const DEV_MODE  = true;
	protected const NAMESPACE = 'sujin/v1';

	protected const STATUS_CODE_NO_CONTENT      = 204;
	protected const STATUS_CODE_NOT_IMPLEMENTED = 501;
	protected const STATUS_CODE_NOT_FOUND       = 404;

	// Transient
	protected const CACHE_TTL     = HOUR_IN_SECONDS;
	protected const RESOURCE_NAME = '';

	public function __construct() {
		add_action( 'rest_api_init', array( $this, 'create_rest_routes' ), 10, 0 );
	}

	abstract public function create_rest_routes();

	public function permissions_check( $request ): bool {
		if ( self::DEV_MODE ) {
			return true;
		}

		$referer  = $request->get_header( 'referer' );
		$referer  = wp_parse_url( $referer );
		$home_url = wp_parse_url( get_home_url() );

		return ( $referer['host'] ?? null ) === $home_url['host'];
	}

	// Request
	protected function is_success( $response ): bool {
		if ( is_wp_error( $response ) ) {
			return false;
		}

		if ( $response instanceof WP_HTTP_Requests_Response ) {
			return 400 <= $response->get_status();
		}

		if ( $response instanceof WP_REST_Response ) {
			return ! $response->is_error();
		}

		$response = json_decode( wp_json_encode( $response ), true );

		return $response['response'] && $response['response']['code'] && 200 === $response['response']['code'];
	}

	protected function get_transient_key( string $_ = '' ): string {
		return 'rest-sujin-v1-' . static::RESOURCE_NAME;
	}

	// Response
	public function prepare_item_for_response( $item, $request ): WP_REST_Response {
		$this->request = $request;
		$item          = array_filter( $item, array( $this, 'filter_schema' ), ARRAY_FILTER_USE_KEY );
		return rest_ensure_response( $item );
	}

	public function filter_schema( string $key ): bool {
		$fields = $this->get_fields_for_response( null );
		return in_array( $key, $fields, true );
	}

	public function prepare_response_for_collection( $response ): array {
		if ( ! ( $response instanceof WP_REST_Response ) ) {
			return $response;
		}

		return (array) $response->get_data();
	}
}
