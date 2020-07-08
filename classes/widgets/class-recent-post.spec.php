<?php // phpcs:ignore WordPress.Files.FileName.InvalidClassFileName
/**
 * Recent_Post Widget Unit Test
 *
 * @package sujinc.com
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */
namespace Sujin\Wordpress\Theme\Sujin\Widgets\Recent_Post;

use Test_Case_Theme_Sujin;
use Sujin\Wordpress\Theme\Sujin\Widgets\Recent_Post;

/**
 * Recent_Post Widget Unit Test
 */
class Unit_Test extends Test_Case_Theme_Sujin {
	/**
	 * Passed case
	 */
	public function test_shortcode(): void {
		$object = Recent_Post::get_instance();
		$actual = $object->widget(
			array(
				'title'  => 'title',
				'small'  => 'small',
				'medium' => 'medium',
				'large'  => 'large',
			),
			array(),
		);

		$this->assertEquals(
			array(
				'title'  => 'title',
				'small'  => 'small',
				'medium' => 'medium',
				'large'  => 'large',
				'widget' => 'recent-post',
			),
			$actual,
		);
	}

	/**
	 * Default case
	 */
	public function test_shortcode_default(): void {
		$object = Recent_Post::get_instance();
		$actual = $object->widget(
			array(),
			array(),
		);

		$this->assertEquals(
			array(
				'title'  => null,
				'small'  => '12',
				'medium' => '6',
				'large'  => '4',
				'widget' => 'recent-post',
			),
			$actual,
		);
	}
}
