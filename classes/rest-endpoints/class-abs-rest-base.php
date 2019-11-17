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

	// Transient and schema
	protected const CACHE_TTL     = HOUR_IN_SECONDS;
	protected const RESOURCE_NAME = '';
	protected const ITEM_NAME     = '';

	public function __construct() {
		add_action( 'rest_api_init', array( $this, 'create_rest_routes' ), 10, 0 );
	}

	abstract public function create_rest_routes();

	public function permissions_check( $request ): bool {
		if ( self::DEV_MODE ) {
			return true;
		}

		if ( defined( 'DIR_TESTDATA' ) && ! empty( DIR_TESTDATA ) ) {
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

	// Transient
	protected function get_transient_key( string $_ = '' ): string {
		return 'rest-sujin-v1-' . static::RESOURCE_NAME;
	}

	protected function get_transient_keys(): array {
		return get_option( 'transient-group-' . $this->get_transient_key(), array() );
	}

	protected function add_transient_keys( string $key ): void {
		$keys   = $this->get_transient_keys();
		$keys[] = $key;
		$keys   = array_unique( $keys );

		update_option( 'transient-group-' . $this->get_transient_key(), $keys );

	}

	protected function delete_transient_keys(): void {
		delete_option( 'transient-group-' . $this->get_transient_key() );

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

	public function get_item_schema() {
		$schema = '';

		if ( static::ITEM_NAME ) {
			$schema = static::ITEM_NAME;
		} else {
			$called_class = explode( '\\', get_called_class() );
			$schema       = strtolower( array_pop( $called_class ) );
		}

		if ( ! $schema ) {
			return parent::get_item_schema();
		}

		return Schema_Valildator::get_instance( $schema )->get_schema();
	}
}
