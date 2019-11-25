<?php
namespace Sujin\Wordpress\Theme\Sujin\Autoloader;

use Test_Case;
use Sujin\Wordpress\Theme\Sujin\Autoloader;

class Unit_Test extends Test_Case {
	function provider_test_load_class_file(): array {
		return array(
			'Unit test file' => array(
				'class'    => 'Sujin\\Wordpress\\Theme\\Sujin\\Test\\Unit_Test',
				'expected' => array(
					'extension' => '.spec.php',
					'path'      => array( 'test' ),
				),
			),
			'Root file' => array(
				'class'    => 'Sujin\\Wordpress\\Theme\\Sujin\\Test',
				'expected' => array(
					'extension' => '.php',
					'path'      => array( 'test' ),
				),
			),
			'File in a directory' => array(
				'class'    => 'Sujin\\Wordpress\\Theme\\Sujin\\Path\\Test',
				'expected' => array(
					'extension' => '.php',
					'path'      => array( 'path', 'test' ),
				),
			),
			'File has underscore' => array(
				'class'    => 'Sujin\\Wordpress\\Theme\\Sujin\\Test_Underscore',
				'expected' => array(
					'extension' => '.php',
					'path'      => array( 'test-underscore' ),
				),
			),
			'File and path have underscore' => array(
				'class'    => 'Sujin\\Wordpress\\Theme\\Sujin\\Other_Path\\Test_Underscore',
				'expected' => array(
					'extension' => '.php',
					'path'      => array( 'other-path', 'test-underscore' ),
				),
			),
		);
	}

	/**
	 * @dataProvider provider_test_load_class_file
	 */
	public function test_load_class_file( string $class, array $expected ): void {
		$autoloader = new Autoloader();
		$actual     = $this->call_private_method( $autoloader, 'get_class_path', array( $class ) );

		array_shift( $actual['path'] );
		$this->assertEquals( $expected, $actual );
	}

	public function test_call_known(): void {
		$autoloader = new Autoloader();
		$autoloader->load_class_file( 'Sujin\\Wordpress\\Theme\\Sujin\\Assets' );

		$this->assertTrue( class_exists( 'Sujin\\Wordpress\\Theme\\Sujin\\Assets' ) );
	}
}
