<?php // phpcs:ignore WordPress.Files.FileName.InvalidClassFileName
/**
 * [gallery] and [carousel] shortcode Unit Test
 *
 * @package sujinc.com
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */
namespace Sujin\Wordpress\Theme\Sujin\Shortcode\Gallery;

use Test_Case_Theme_Sujin;
use Sujin\Wordpress\Theme\Sujin\Shortcode\Gallery;
use Data_Gallery;

/**
 * [about-item] shortcode Unit Test
 */
class Unit_Test extends Test_Case_Theme_Sujin {
	private const SHORTCODE = 'about-item';

	/**
	 * Passed case
	 */
	public function test_shortcode(): void {
		$data_gallery = new Data_Gallery( $this->factory );
		Gallery::get_instance()->register_shortcode();

		$shortcode_exists = shortcode_exists( self::SHORTCODE );
		$this->assertEquals( true, $shortcode_exists );

		$empty = do_shortcode( '[gallery id=""]' );
		$this->assertEquals( '', $empty );

		$gallery = do_shortcode( '[gallery id="' . $data_gallery->gallery->ID . '"]' );
		$this->assertContains( '<section class="carousel" ref="carousel">', $gallery );
		$this->assertContains( '<section class="arrow-nav">', $gallery );
		$this->assertContains( '<section class="picture-frame">', $gallery );
		$this->assertContains( '<section class="nav" ref="nav">', $gallery );
	}
}
