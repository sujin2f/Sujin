<?php
/**
 * Rest API
 *
 * @package sujinc.com
 * @since   12.3.0
 * @author  Sujin 수진 Choi
 */

namespace Sujin\Theme;

use Sujin\Theme\Redis;

/**
 * Secure WP RestAPI
 *
 * 1. Block RestAPI
 */
class Menu {
	/**
	 * Constructor
	 */
	public function __construct() {
		add_filter( 'rest_menu_read_access', '__return_true' );
		add_action( 'wp_update_nav_menu', array( $this, 'save_post' ) );
	}

	/**
	 * When save menu,
	 *
	 * @param int $menu_id Menu ID.
	 */
	public function save_post( int $menu_id ): void {
		$locations = array_flip( get_nav_menu_locations() );
		$location  = array_key_exists( $menu_id, $locations ) ? $locations[ $menu_id ] : '';
		if ( ! $location ) {
			return;
		}

		$redis = new Redis();
		$redis->publish(
			'wordpress', // phpcs:ignore WordPress.WP.CapitalPDangit.MisspelledInText
			array(
				'type'   => 'menu',
				'action' => 'update',
				'slug'   => $location,
			)
		);
		$redis->quit();
	}
}
