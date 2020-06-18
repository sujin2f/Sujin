<?php
/**
 * Menu Rest Controller
 *
 * @package sujinc.com
 * @since   8.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Sujin\V1;

use Sujin\Wordpress\Theme\Sujin\{
	Rest_Endpoints\Sujin\V1,
	Rest_Endpoints\Items\Menu_Item,
};

use Sujin\Wordpress\WP_Express\{
	Helpers\Trait_Singleton,
	Helpers\Transient,
};

// phpcs:disable Generic.WhiteSpace.DisallowSpaceIndent.SpacesUsed
use WP_REST_Server,
    WP_Error;
// phpcs:enable Generic.WhiteSpace.DisallowSpaceIndent.SpacesUsed

/**
 * Menu Rest Controller
 */
class Menu_Endpoint extends V1 {
	use Trait_Singleton;

	/**
	 * The namespace of this controller's route.
	 *
	 * @var string
	 */
	protected $namespace = 'menu';

	protected const ITEM_NAME = 'Menu_Item';

	/**
	 * Constructor
	 *
	 * @visibility protected
	 */
	protected function __construct() {
		parent::__construct();
		add_action( 'wp_update_nav_menu', array( $this, 'remove_all_transients' ) );
	}

	/**
	 * Registers the routes for the objects of the controller.
	 * /wp-json/sujin/v1/archive/menu/slug
	 */
	public function register_routes() {
		register_rest_route(
			$this->rest_base,
			'/' . $this->namespace . '/(?P<slug>[\w-]+)',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_items' ),
					'permission_callback' => array( $this, 'get_items_permissions_check' ),
					'args'                => array(
						'slug' => array(
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

	/**
	 * Get items
	 *
	 * @param WP_REST_Request $request Request object.
	 */
	public function get_items( $request ) {
		$slug = $request->get_param( 'slug' );

		$transient_key = $this->get_transient_key() . '-' . $slug;
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
		$response   = array(); // Key is term ID.
		$menu_items = array(); // Key is post ID.

		foreach ( $nav_menu as $wp_menu_item ) {
			$menu_items[ $wp_menu_item->ID ] = Menu_Item::get_instance( 'menu item - ' . $wp_menu_item->ID, $wp_menu_item );

			if ( ! empty( $wp_menu_item->menu_item_parent ) ) {
				$menu_items[ $wp_menu_item->menu_item_parent ]->append_children( $menu_items[ $wp_menu_item->ID ] );
			} else {
				$response[] = $menu_items[ $wp_menu_item->ID ];
			}
		}

		// Object to Array.
		$response = json_decode( wp_json_encode( $response ), true );
		$response = array_values( $response );

		// Transient.
		$transient = new Transient( $response, self::CACHE_TTL );
		$transient->set_transient( $transient_key );
		$this->add_transient_key_to_group( $transient_key );

		return rest_ensure_response( $response );
	}

	/**
	 * Returns an error when menu doesn't exist
	 *
	 * @return WP_Error
	 */
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
