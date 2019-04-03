<?php
/**
 * Admin Class
 *
 * @project WP-Express
 * @since   1.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\WP_Express;

use Sujin\Wordpress\WP_Express\Helpers\Multiton;
use WP_REST_Controller;

if ( !defined( "ABSPATH" ) ) {
	header( "Status: 404 Not Found" );
	header( "HTTP/1.1 404 Not Found" );
	exit();
}

class Simple_Rest_API extends WP_REST_Controller {
	use Multiton;

	protected $namespace = '';
	private $rest_bases = array();
	private $current_rest_base = '';

	public function __construct( $name ) {
		add_action( 'rest_api_init', array( $this, 'create_rest_routes' ), 10, 0 );
		$this->namespace = $name;
	}

	public function set_base( $base ) {
		$this->rest_bases[ $base ] = array();
		$this->current_rest_base = '/' . $base;
		return $this;
	}

	public function set_methods( $methods ) {
		$this->rest_bases[ $this->current_rest_base ]['methods'] = $methods;
		return $this;
	}

	public function set_callback( $callback ) {
		$this->rest_bases[ $this->current_rest_base ]['callback'] = $callback;
		return $this;
	}

	public function create_rest_routes() {
		foreach ( $this->rest_bases as $rest_base => $options ) {
			register_rest_route( $this->namespace, '/' . $rest_base, $options );
		}
	}
}

