<?php
namespace Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Sujin;

use Sujin\Wordpress\Theme\Sujin\Helpers\Schema\Response_Schema;

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

abstract class V1 extends WP_REST_Controller {
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
		if ( SUJIN_DEV_MODE ) {
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

	public function get_item_schema() {
		$schema_name = '';

		if ( static::ITEM_NAME ) {
			$schema_name = static::ITEM_NAME;
		} else {
			$called_class = explode( '\\', get_called_class() );
			$schema_name  = strtolower( array_pop( $called_class ) );
		}

		if ( ! $schema_name ) {
			return parent::get_item_schema();
		}

		return Response_Schema::from_file( $schema_name . '.json' )->get_json();
	}
}