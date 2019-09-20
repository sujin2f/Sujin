<?php
namespace Sujin\Wordpress\Theme\Sujin\Rest_Endpoints;

use Sujin\Wordpress\Theme\Sujin\Helpers\Utilities;
use WP_REST_Controller, WP_REST_Response, WP_REST_Request;

if ( ! defined( 'ABSPATH' ) ) {
	header( 'Status: 404 Not Found' );
	header( 'HTTP/1.1 404 Not Found' );
	exit();
}

abstract class Abs_Rest_Base extends WP_REST_Controller {
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

	protected $request;

	public function __construct() {
		add_action( 'rest_api_init', array( $this, 'create_rest_routes' ), 10, 0 );
	}

	abstract public function create_rest_routes();

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

		if ( ! is_null( $items ) && $cache_expired > time() ) {
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
			self::KEY_CACHE => time() + static::CACHE_TTL,
		);

		set_transient( $this->get_transient_key(), $transient );
	}

	public function delete_transient() {
		delete_transient( $this->get_transient_key() );
	}

	private function get_transient_key(): string {
		return 'rest-sujin-v1-' . static::RESOURCE_NAME;
	}

	private function get_items_node( $object ) {
		return Utilities::get_item( $object, self::KEY_ITEMS ) ?? null;
	}

	private function get_cache_expired_node( $object ): ?int {
		return Utilities::get_item( $object, self::KEY_CACHE ) ?? 0;
	}

	// Schema
	public function filter_schema( string $key ): bool {
		$fields = $this->get_fields_for_response( $this->request );
		return in_array( $key, $fields );
	}
}
