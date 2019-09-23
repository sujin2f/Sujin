<?php
namespace Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Sujin\V1;

use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Abs_Rest_Base;

// phpcs:disable Generic.WhiteSpace.DisallowSpaceIndent.SpacesUsed
use WP_REST_Server,
    WP_REST_Response,
    WP_Error;
// phpcs:enable Generic.WhiteSpace.DisallowSpaceIndent.SpacesUsed

if ( ! defined( 'ABSPATH' ) ) {
	header( 'Status: 404 Not Found' );
	header( 'HTTP/1.1 404 Not Found' );
	exit();
}

class Menu extends Abs_Rest_Base {
	protected const CACHE_TTL     = null;
	protected const RESOURCE_NAME = 'menu';

	public function __construct() {
		parent::__construct();
		add_action( 'wp_update_nav_menu', array( $this, 'delete_transient' ) );
	}

	public function create_rest_routes() {
		register_rest_route(
			self::NAMESPACE,
			'/' . self::RESOURCE_NAME . '/(?P<menu>[\w-]+)',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_items' ),
					'permission_callback' => array( $this, 'permissions_check' ),
					'args'                => array(
						'menu' => array(
							'description'       => 'Menu Slug',
							'type'              => 'string',
							'required'          => true,
							'sanitize_callback' => 'sanitize_text_field',
						),
					),
				),
				'schema' => array( $this, 'get_item_schema' ),
			)
		);
	}

	public function get_items( $request ) {
		$slug = $request->get_param( 'menu' );
		$this->set_transient_suffix( $slug );

		$transient = $this->get_transient();
		if ( $transient[ self::KEY_RETURN ] ) {
			return rest_ensure_response( $transient[ self::KEY_ITEMS ] );
		}

		$locations = get_nav_menu_locations();
		$id        = $locations[ $slug ] ?? null;

		if ( is_null( $id ) ) {
			if ( $transient[ self::KEY_ITEMS ] ) {
				return rest_ensure_response( $transient[ self::KEY_ITEMS ] );
			}

			$this->set_transient( $this->error_no_menu() );
			return rest_ensure_response( $this->error_no_menu() );
		}

		$_nav_menu = wp_get_nav_menu_object( $id );
		$_nav_menu = wp_get_nav_menu_items( $_nav_menu->term_id );
		$nav_menu  = array();

		foreach ( $_nav_menu as $menu_item ) {
			$menu_item             = $this->prepare_item_for_response( $menu_item, $request )->data;
			$menu_item['children'] = array();
			$menu_item_parent      = $menu_item['menu_item_parent'];

			unset( $menu_item['menu_item_parent'] );

			if ( ! empty( $menu_item_parent ) ) {
				$nav_menu[ $menu_item_parent ]['children'][] = $menu_item;
			} else {
				$nav_menu[ $menu_item['ID'] ] = $menu_item;
			}
		}

		$nav_menu = array_values( $nav_menu );

		$this->set_transient( $nav_menu );

		return rest_ensure_response( $nav_menu );
	}

	public function prepare_item_for_response( $item, $request ): WP_REST_Response {
		$item = parent::prepare_item_for_response( (array) $item, $request );
		return rest_ensure_response( $item );
	}

	public function get_item_schema(): array {
		return array(
			'$schema'    => 'http://json-schema.org/draft-04/schema#',
			'title'      => 'media',
			'type'       => 'object',
			'properties' => array(
				'ID'               => array(
					'description' => 'Unique ID',
					'type'        => 'integer',
					'context'     => array( 'view', 'edit', 'embed' ),
					'readonly'    => true,
				),
				'title'            => array(
					'description' => 'The title of the menu item.',
					'type'        => 'string',
					'context'     => array( 'view', 'edit', 'embed' ),
					'readonly'    => true,
				),
				'url'              => array(
					'description' => 'Link URL',
					'type'        => 'string',
					'context'     => array( 'view', 'edit', 'embed' ),
					'readonly'    => true,
				),
				'target'           => array(
					'description' => 'Link target',
					'type'        => 'string',
					'context'     => array( 'view', 'edit', 'embed' ),
					'readonly'    => true,
				),
				'menu_item_parent' => array(
					'description' => 'Parent ID',
					'type'        => 'integer',
					'context'     => array( 'view', 'edit', 'embed' ),
					'readonly'    => true,
				),
				'classes'          => array(
					'description' => 'HTML class',
					'type'        => 'array',
					'context'     => array( 'view', 'edit', 'embed' ),
					'readonly'    => true,
				),
			),
		);
	}

	private function error_no_menu(): WP_Error {
		return new WP_Error(
			'NO_MENU',
			'The menu is not exist.',
			array(
				'status' => self::STATUS_CODE_NOT_FOUND,
			)
		);
	}
}
