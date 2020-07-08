<?php // phpcs:ignore WordPress.Files.FileName.InvalidClassFileName
/**
 * Google_Advert Widget Unit Test
 *
 * @package sujinc.com
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */
namespace Sujin\Wordpress\Theme\Sujin\Widgets\Google_Advert;

use Test_Case_Theme_Sujin;
use Sujin\Wordpress\Theme\Sujin\Widgets\Google_Advert;

/**
 * Google_Advert Widget Unit Test
 */
class Unit_Test extends Test_Case_Theme_Sujin {
	/**
	 * Passed case
	 */
	public function test_shortcode(): void {
		$object = Google_Advert::get_instance();
		$actual = $object->widget(
			array(
				'client'     => 'client',
				'slot'       => 'slot',
				'responsive' => 'responsive',
			),
			array(),
		);

		$this->assertEquals(
			array(
				'client'     => 'client',
				'slot'       => 'slot',
				'responsive' => 'responsive',
				'widget'     => 'google-advert',
			),
			$actual,
		);
	}
}
