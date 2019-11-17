<?php
namespace Sujin\Wordpress\Theme\Sujin\Tests\Unit\Shortcode;

use Sujin\Wordpress\Theme\Sujin\Tests\Unit\Test_Case;
use Sujin\Wordpress\Theme\Sujin\Shortcode\About_Item;

class About_Item_Test extends Test_Case {
	private const SHORTCODE = 'about-item';

	public function test_shortcode() {
		$about_item = new About_Item();

		$shortcode_exists = shortcode_exists( self::SHORTCODE );
		$this->assertEquals( true, $shortcode_exists );

		$empty = do_shortcode( '[about-item]' );
		$this->assertEquals( '', $empty );

		$from = do_shortcode( '[about-item from="1977"]' );
		$this->assertContains( '<div class="flex-container-row">', $from );
		$this->assertContains( '<div>1977</div>', $from );
		$this->assertContains( '<div class="detail"></div>', $from );

		$from_to = do_shortcode( '[about-item from="1977" to="2092"]' );
		$this->assertContains( '<div class="flex-container-row">', $from_to );
		$this->assertContains( '<div>1977</div>', $from_to );
		$this->assertContains( '<div class="separator"></div>', $from_to );
		$this->assertContains( '<div>2092</div>', $from_to );
		$this->assertContains( '<div class="detail"></div>', $from_to );

		$with_content = do_shortcode( '[about-item from="1977" to="2092"]content[/about-item]' );
		$this->assertContains( '<div class="flex-container-row">', $with_content );
		$this->assertContains( '<div>1977</div>', $with_content );
		$this->assertContains( '<div class="separator"></div>', $with_content );
		$this->assertContains( '<div>2092</div>', $with_content );
		$this->assertContains( '<div class="detail">content</div>', $with_content );
	}
}
