<?php // phpcs:ignore WordPress.Files.FileName.InvalidClassFileName
/**
 * [about-item] shortcode Unit Test
 *
 * @package sujinc.com
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */
namespace Sujin\Wordpress\Theme\Sujin\Shortcode\About_Item;

use Test_Case_Theme_Sujin;
use Sujin\Wordpress\Theme\Sujin\Shortcode\About_Item;

/**
 * [about-item] shortcode Unit Test
 */
class Unit_Test extends Test_Case_Theme_Sujin {
	private const SHORTCODE = 'about-item';

	/**
	 * Passed case
	 */
	public function test_shortcode(): void {
		About_Item::get_instance();

		$shortcode_exists = shortcode_exists( self::SHORTCODE );
		$this->assertEquals( true, $shortcode_exists );

		$empty = do_shortcode( '[about-item]' );
		$this->assertEquals( '', $empty );

		$from = do_shortcode( '[about-item from="1977"]' );
		$this->assertContains( 'flex-container-row', $from );
		$this->assertContains( '<div>1977</div>', $from );
		$this->assertContains( '<div class="detail"></div>', $from );

		$from_to = do_shortcode( '[about-item from="1977" to="2092"]' );
		$this->assertContains( 'flex-container-row', $from_to );
		$this->assertContains( '<div>1977</div>', $from_to );
		$this->assertContains( '<div class="separator"></div>', $from_to );
		$this->assertContains( '<div>2092</div>', $from_to );
		$this->assertContains( '<div class="detail"></div>', $from_to );

		$with_content = do_shortcode( '[about-item from="1977" to="2092"]content[/about-item]' );
		$this->assertContains( 'flex-container-row', $with_content );
		$this->assertContains( '<div>1977</div>', $with_content );
		$this->assertContains( '<div class="separator"></div>', $with_content );
		$this->assertContains( '<div>2092</div>', $with_content );
		$this->assertContains( '<div class="detail">content</div>', $with_content );
	}
}
