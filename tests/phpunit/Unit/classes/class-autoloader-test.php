<?php
namespace Sujin\Wordpress\Theme\Sujin\Tests\Unit;

use Sujin\Wordpress\Theme\Sujin\Autoloader;

class Autoloader_Test extends Test_Case {
	function provider_load_class_file(): array {
		return array(
			'Sujin\Wordpress\Theme\Sujin\Test'            => array(
				'class'    => 'Sujin\\Wordpress\\Theme\\Sujin\\Test',
				'expected' => '/classes/class-test.php',
			),
			'Sujin\Wordpress\Theme\Sujin\Test_Underscore' => array(
				'class'    => 'Sujin\\Wordpress\\Theme\\Sujin\\Test_Underscore',
				'expected' => '/classes/class-test-underscore.php',
			),
			'Sujin\Wordpress\Theme\Sujin\Other_Path\Test_Underscore' => array(
				'class'    => 'Sujin\\Wordpress\\Theme\\Sujin\\Other_Path\\Test_Underscore',
				'expected' => '/classes/other-path/class-test-underscore.php',
			),
		);
	}

	/**
	 * @dataProvider provider_load_class_file
	 */
	public function test_load_class_file( string $class, string $expected ): void {
		$autoloader = new Autoloader();
		$actual     = $this->call_private_method( $autoloader, 'get_class_path', array( $class ) );
		$this->assertContains( $expected, $actual );
	}
}
