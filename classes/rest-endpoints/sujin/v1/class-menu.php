<?php
/**
 * Menu Rest Controller
 *
 * @project Sujinc.com
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
*/

namespace Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Sujin\V1;

use Sujin\Wordpress\Theme\Sujin\Helpers\{
	Transient,
	Singleton,
};
use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\V1;
use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Items\Menu as Menu_Item;

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

class Menu extends V1 {
	use Singleton;

	protected const RESOURCE_NAME = 'menu';

	public function __construct() {
		parent::__construct();
		add_action( 'wp_update_nav_menu', array( $this, 'delete_transient' ) );
	}

	public function delete_transient( int $menu_id ): void {
		$locations = get_terms( 'nav_menu', array( 'hide_empty' => true ) );
		foreach ( $locations as $location ) {
			if ( $menu_id === $location->term_id ) {
				delete_transient( $this->get_transient_key( $location->slug ) );
			}
		}
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

		$transient_key = $this->get_transient_key( $slug );
		$transient     = Transient::get_transient( $transient_key );

		if ( $transient && ! $transient->is_expired() && ! SUJIN_DEV_MODE ) {
			return rest_ensure_response( $transient->items );
		}

		$locations = get_nav_menu_locations();
		$menu_id   = $locations[ $slug ] ?? null;

		if ( is_null( $menu_id ) ) {
			return rest_ensure_response( $this->error_no_menu() );
		}

		$nav_menu   = wp_get_nav_menu_items( $menu_id );
		$response   = array(); // Key is term ID
		$menu_items = array(); // Key is post ID

		foreach ( $nav_menu as $menu_item ) {
			$menu_items[ $menu_item->ID ] = new Menu_Item( $menu_item );

			if ( ! empty( $menu_item->menu_item_parent ) ) {
				$menu_items[ $menu_item->menu_item_parent ]->append_children( $menu_items[ $menu_item->ID ] );
			} else {
				$response[] = $menu_items[ $menu_item->ID ];
			}
		}

		// Object to Array
		$response = json_decode( wp_json_encode( $response ), true );
		$response = array_values( $response );

		// Transient
		$transient = new Transient( $response, self::CACHE_TTL );
		$transient->set_transient( $transient_key );

		return rest_ensure_response( $response );
	}

	protected function get_transient_key( string $slug = '' ): string {
		return parent::get_transient_key() . '-' . $slug;
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
