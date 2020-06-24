<?php // phpcs:ignore WordPress.Files.FileName.InvalidClassFileName
/**
 * Menu Item Rest Item Unit Test
 *
 * @package sujinc.com
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Items\Menu_Item;

use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Items\Menu_Item;

use Test_Case_Theme_Sujin;
use Data_Nav_Menu;

/**
 * Menu Item Rest Item Unit Test
 */
class Unit_Test extends Test_Case_Theme_Sujin {
	/**
	 * Test object construction and Schema validator
	 */
	public function test_schema_decode(): void {
		$data      = new Data_Nav_Menu();
		$nav_menus = array(
			Menu_Item::get_instance( 'menu-01', $data->nav_menu[0] ),
			Menu_Item::get_instance( 'menu-02', $data->nav_menu[1] ),
		);
		$nav_menus = json_decode( wp_json_encode( $nav_menus ), true );

		$this->assertEquals(
			'Home',
			$nav_menus[0]['title']
		);
		$this->assertEquals(
			'Blog',
			$nav_menus[1]['title']
		);
	}
}
