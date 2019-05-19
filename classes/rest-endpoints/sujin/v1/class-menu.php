<?php
namespace Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Sujin\V1;

use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Abs_Rest_Base;

use WP_REST_Server;

if ( ! defined( 'ABSPATH' ) ) {
	header( 'Status: 404 Not Found' );
	header( 'HTTP/1.1 404 Not Found' );
	exit();
}

class Menu extends Abs_Rest_Base {
	public function __construct() {
		parent::__construct();
		$this->resource_name = 'menu';
	}

	public function create_rest_routes() {
		register_rest_route(
			$this->namespace,
			'/' . $this->resource_name . '/(?P<menu>[\w-]+)',
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
		$locations = get_nav_menu_locations();
		$slug      = $request->get_param( 'menu' );
		$id        = $locations[ $slug ] ?? null;

		if ( is_null( $id ) ) {
			return rest_ensure_response( array() );
		}

		$nav_menu = wp_get_nav_menu_object( $id );

		return rest_ensure_response( wp_get_nav_menu_items( $nav_menu->term_id ) );
	}
}
