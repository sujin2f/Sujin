<?php
namespace Sujin\Wordpress\Theme\Sujin\Rest_Endpoints;

use Sujin\Wordpress\Theme\Sujin\Helpers\Utilities;

// phpcs:disable Generic.WhiteSpace.DisallowSpaceIndent.SpacesUsed
use WP_REST_Controller,
    WP_REST_Response,
    WP_REST_Request;
// phpcs:enable Generic.WhiteSpace.DisallowSpaceIndent.SpacesUsed

if ( ! defined( 'ABSPATH' ) ) {
	header( 'Status: 404 Not Found' );
	header( 'HTTP/1.1 404 Not Found' );
	exit();
}

abstract class Abs_Rest_Base extends WP_REST_Controller {
	protected const DEV_MODE = true;

	protected const NAMESPACE = 'sujin/v1';

	protected const STATUS_CODE_NO_CONTENT      = 204;
	protected const STATUS_CODE_NOT_IMPLEMENTED = 501;
	protected const STATUS_CODE_NOT_FOUND       = 404;

	// Transient
	protected const CACHE_TTL     = HOUR_IN_SECONDS;
	protected const RESOURCE_NAME = '';
	protected const KEY_ITEMS     = 'items';
	protected const KEY_RETURN    = 'return';
	private   const KEY_CACHE     = 'cache_expired';

	protected $transient_suffix = null;

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
		if ( $response instanceof WP_REST_Response ) {
			return 200 === Utilities::get_item( $response, 'status' );
		}

		return ! is_wp_error( $response ) &&
			is_array( Utilities::get_item( $response, 'response' ) ) &&
			200 === ( Utilities::get_item( $response['response'], 'code' ) );
	}

	// Transient
	protected function get_transient(): array {
		$transient     = get_transient( $this->get_transient_key() );
		$items         = $this->get_items_node( $transient );
		$cache_expired = $this->get_cache_expired_node( $transient );

		if ( ! is_null( $items ) && ( 'never' === $cache_expired || $cache_expired > time() ) ) {
			return array(
				self::KEY_RETURN => true,
				self::KEY_ITEMS  => $items,
			);
		}

		return array(
			self::KEY_RETURN => false,
			self::KEY_ITEMS  => $items,
		);
	}

	protected function set_transient( $items ) {
		$transient = array(
			self::KEY_ITEMS => $items,
			self::KEY_CACHE => static::CACHE_TTL === 'never' ? static::CACHE_TTL : time() + static::CACHE_TTL,
		);

		set_transient( $this->get_transient_key(), $transient );
	}

	public function delete_transient() {
		$transient_key  = $this->get_transient_key();

		if ( is_null( $this->transient_suffix ) ) {
			$transient_keys = get_option( 'transient_keys_' . $transient_key, array() );

			foreach ( $transient_keys as $key ) {
				delete_transient( $key );
			}
		}

		delete_transient( $transient_key );
	}

	private function get_transient_key(): string {
		$transient_key = 'rest-sujin-v1-' . static::RESOURCE_NAME;

		if ( is_null( $this->transient_suffix ) ) {
			return $transient_key;
		}

		$with_suffix    = $transient_key . '-' . $this->transient_suffix;
		$transient_keys = get_option( 'transient_keys_' . $transient_key, array() );
		if ( ! in_array( $with_suffix, $transient_keys, true ) ) {
			array_push( $transient_keys, $with_suffix );
		}

		return $with_suffix;
	}

	protected function set_transient_suffix( string $suffix ) {
		$this->transient_suffix = $suffix;
	}

	private function get_items_node( $object ) {
		return Utilities::get_item( $object, self::KEY_ITEMS ) ?? null;
	}

	private function get_cache_expired_node( $object ) {
		return Utilities::get_item( $object, self::KEY_CACHE ) ?? 0;
	}

	// Response
	public function prepare_item_for_response( $item, $request ): WP_REST_Response {
		$this->request = $request;
		$item          = array_filter( $item, array( $this, 'filter_schema' ), ARRAY_FILTER_USE_KEY );
		return rest_ensure_response( $item );
	}

	public function filter_schema( string $key ): bool {
		$fields = $this->get_fields_for_response( null );
		return in_array( $key, $fields );
	}
}
