<?php
namespace Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Sujin\V1;

use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Abs_Rest_Base;
use Sujin\Wordpress\WP_Express\Fields\Settings\Input as Option_Input;

use WP_REST_Controller, WP_REST_Server, WP_REST_Response, WP_REST_Request, WP_Error;

if ( ! defined( 'ABSPATH' ) ) {
	header( 'Status: 404 Not Found' );
	header( 'HTTP/1.1 404 Not Found' );
	exit();
}

class Flickr extends Abs_Rest_Base {
	public function __construct() {
		parent::__construct();
		$this->resource_name = 'flickr';
	}

	public function create_rest_routes() {
		register_rest_route(
			$this->namespace,
			'/' . $this->resource_name,
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
		if ( $contents = get_transient( 'flickr' ) ) {
			return rest_ensure_response( $contents );
		}

		$flickr_id = Option_Input::get_instance( 'Flicker ID' )->get();

		if ( ! $flickr_id ) {
			return new WP_Error(
				'empty_setting',
				'You must input the Flickr ID in the setting.',
				array(
					'status' => self::STATUS_CODE_NOT_IMPLEMENTED,
				)
			);
		}

		$url = sprintf(
			'http://api.flickr.com/services/feeds/photos_public.gne?id=%s&format=json&nojsoncallback=1',
			$flickr_id
		);

		$conn = curl_init( $url );
		curl_setopt( $conn, CURLOPT_SSL_VERIFYPEER, true );
		curl_setopt( $conn, CURLOPT_FRESH_CONNECT,  true );
		curl_setopt( $conn, CURLOPT_RETURNTRANSFER, 1 );
		$response = curl_exec( $conn );
		curl_close( $conn );

		$response = json_decode( str_replace( "\\'", "'", $response ) );
		$data     = array();

		if ( is_object( $response ) && ! $response->items ) {
			return rest_ensure_response( $data );
		}

		foreach ( $response->items as $item ) {
			$item   = $this->prepare_item_for_response( $item, $request );
			$data[] = $this->prepare_response_for_collection( $item );
		}

		$data = rest_ensure_response( $data );

		set_transient( 'flickr', $data, 12 * HOUR_IN_SECONDS );

		return rest_ensure_response( $data );
	}

	public function prepare_item_for_response( $item, $request ): WP_REST_Response {
		$item = (array) $item;
		$item['media'] = array(
			'origin' => str_replace( '_m.', '.', $item['media']->m ),
			's'      => str_replace( '_m.', '_s.', $item['media']->m ),
			't'      => str_replace( '_m.', '_t.', $item['media']->m ),
			'b'      => str_replace( '_m.', '_b.', $item['media']->m ),
			'm'      => $item['media']->m,
		);

		$item = array_filter( $item, array( $this, 'filter_schema'), ARRAY_FILTER_USE_KEY );
		return rest_ensure_response( $item );
	}

	public function filter_schema( string $key ): bool {
		$schema = $this->get_item_schema();
		return array_key_exists( $key, $schema['properties'] );
	}

	public function prepare_response_for_collection( $response ): array {
		if ( ! ( $response instanceof WP_REST_Response ) ) {
			return $response;
		}

		return (array) $response->get_data();
	}

	public function get_item_schema(): array {
		$schema = array(
			'$schema'              => 'http://json-schema.org/draft-04/schema#',
			'title'                => 'flicr',
			'type'                 => 'object',
			'properties'           => array(
				'title' => array(
					'description'  => 'The title of the photo.',
					'type'         => 'string',
					'context'      => array( 'view', 'edit', 'embed' ),
					'readonly'     => true,
				),
				'link' => array(
					'description'  => 'Flickr URL for the image',
					'type'         => 'string',
					'context'      => array( 'view', 'edit', 'embed' ),
					'readonly'     => true,
				),
				'media' => array(
					'description'  => 'Image URLs',
					'type'         => 'array',
					'context'      => array( 'view', 'edit', 'embed' ),
					'readonly'     => true,
				),

			),
		);

		return $schema;
	}
}
