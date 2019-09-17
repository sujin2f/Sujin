<?php
namespace Sujin\Wordpress\Theme\Sujin\Rest_Endpoints;

use Sujin\Wordpress\Theme\Sujin\Helpers\Utilities;
use WP_REST_Controller, WP_REST_Response;

if ( ! defined( 'ABSPATH' ) ) {
	header( 'Status: 404 Not Found' );
	header( 'HTTP/1.1 404 Not Found' );
	exit();
}

abstract class Abs_Rest_Base extends WP_REST_Controller {
	protected const STATUS_CODE_NO_CONTENT      = 204;
	protected const STATUS_CODE_NOT_IMPLEMENTED = 501;
	protected const STATUS_CODE_NOT_FOUND       = 501;

	public function __construct() {
		$this->namespace = 'sujin/v1';
		add_action( 'rest_api_init', array( $this, 'create_rest_routes' ), 10, 0 );
	}

	abstract public function create_rest_routes();

	protected function is_success( $response ): bool {
		return ! is_wp_error( $response ) &&
		       is_array( Utilities::get_item( $response, 'response' ) ) &&
		       200 === ( Utilities::get_item( $response['response'], 'code' ) );
	}
}
