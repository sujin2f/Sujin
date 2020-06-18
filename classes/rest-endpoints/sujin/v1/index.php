<?php // phpcs:ignore WordPress.Files.FileName.InvalidClassFileName
/**
 * Endpoints of sujin/v1 abstraction
 *
 * @package sujinc.com
 * @since   8.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Sujin;

// phpcs:disable Generic.WhiteSpace.DisallowSpaceIndent.SpacesUsed
use WP_REST_Controller,
	WP_REST_Response,
	WP_REST_Request,
    WP_HTTP_Requests_Response;
// phpcs:enable Generic.WhiteSpace.DisallowSpaceIndent.SpacesUsed

if ( ! defined( 'ABSPATH' ) ) {
	header( 'Status: 404 Not Found' );
	header( 'HTTP/1.1 404 Not Found' );
	exit();
}

/**
 * Endpoints of sujin/v1 abstraction
 */
abstract class V1 extends WP_REST_Controller {
	/**
	 * The base of this controller's route.
	 *
	 * @var string
	 */
	protected $rest_base = 'sujin/v1';

	protected const STATUS_CODE_NO_CONTENT      = 204;
	protected const STATUS_CODE_NOT_IMPLEMENTED = 501;
	protected const STATUS_CODE_NOT_FOUND       = 404;

	// Transient and schema.
	protected const CACHE_TTL = 12 * HOUR_IN_SECONDS;
	protected const ITEM_NAME = '';

	/**
	 * Constructor
	 *
	 * @visibility protected
	 */
	protected function __construct() {
		add_action( 'rest_api_init', array( $this, 'register_routes' ), 10, 0 );
	}

	/**
	 * Checks if a given request has access to get items.
	 *
	 * @param  WP_REST_Request $request Full data about the request.
	 * @return WP_Error|bool   True if the request has read access, WP_Error object otherwise.
	 */
	public function get_items_permissions_check( $request ) {
		return $this->get_permissions_check( $request );
	}

	/**
	 * Checks if a given request has access to get a specific item.
	 *
	 * @param  WP_REST_Request $request Full data about the request.
	 * @return WP_Error|bool   True if the request has read access for the item, WP_Error object otherwise.
	 */
	public function get_item_permissions_check( $request ) {
		return $this->get_permissions_check( $request );
	}

	/**
	 * Checks if a given request has access to get.
	 *
	 * @param  WP_REST_Request $request Full data about the request.
	 * @return WP_Error|bool   True if the request has read access for the item, WP_Error object otherwise.
	 *
	 * @visibility protected
	 */
	private function get_permissions_check( WP_REST_Request $request ): bool {
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

	/**
	 * Checks if a given response has access to get.
	 *
	 * @param  WP_Error|WP_HTTP_Requests_Response|WP_REST_Response|array $response Response to be checkd.
	 * @return bool
	 *
	 * @visibility protected
	 */
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

	/**
	 * Returns a single transient key
	 *
	 * @return string
	 *
	 * @visibility protected
	 */
	protected function get_transient_key(): string {
		return 'rest-' . $this->rest_base . '-' . $this->namespace;
	}

	/**
	 * Returns transient key array
	 *
	 * @return array
	 *
	 * @visibility protected
	 */
	protected function get_transient_keys(): array {
		return get_option( $this->get_transient_group_key(), array() );
	}

	/**
	 * Returns a transient group key
	 *
	 * @return string
	 *
	 * @visibility private
	 */
	private function get_transient_group_key(): string {
		return 'transient-group-' . $this->get_transient_key();
	}

	/**
	 * Add a single transient key to transient group
	 *
	 * @param string $key The key to add.
	 *
	 * @visibility protected
	 */
	protected function add_transient_key_to_group( string $key ): void {
		$keys   = $this->get_transient_keys();
		$keys[] = $key;
		$keys   = array_unique( $keys );

		update_option( $this->get_transient_group_key(), $keys );
	}

	/**
	 * Remove a single transient
	 *
	 * @param string $key The key to remove.
	 *
	 * @visibility protected
	 */
	protected function remove_single_transient( string $key ): void {
		$keys = $this->get_transient_keys();
		$keys = array_flip( $keys );
		unset( $keys[ $key ] );
		$keys = array_keys( $keys );

		delete_transient( $key );
		update_option( $this->get_transient_group_key(), $keys );
	}

	/**
	 * Remove all transient
	 */
	public function remove_all_transients(): void {
		foreach ( $this->get_transient_keys() as $key ) {
			delete_transient( $key );
		}

		delete_option( $this->get_transient_group_key() );
	}

	/**
	 * Retrieves the item's schema, conforming to JSON Schema.
	 *
	 * @return array Item schema data.
	 */
	public function get_item_schema() {
		$schema_name = '';

		if ( static::ITEM_NAME ) {
			$schema_name = static::ITEM_NAME;
		} else {
			$called_class = explode( '\\', get_called_class() );
			$schema_name  = strtolower( array_pop( $called_class ) );
			$schema_name  = str_replace( '_endpoint', '', $schema_name );
		}

		if ( ! $schema_name ) {
			return parent::get_item_schema();
		}

		$class_name = '\\Sujin\\Wordpress\\Theme\\Sujin\\Rest_Endpoints\\Items\\' . $schema_name;
		$json_path  = call_user_func( $class_name . '::get_item_json_path' );
		$json       = call_user_func( $class_name . '::from_file', $json_path );

		return $json->get_json();
	}
}
