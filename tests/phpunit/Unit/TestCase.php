<?php
namespace Sujin\Wordpress\Theme\Sujin\Tests\Unit;

use WP_UnitTestCase;
use ReflectionClass;

abstract class TestCase extends WP_UnitTestCase {
	protected static $home_dir = '';
	protected static $test_dir = '';

	/**
	 * Register the base theme and classes from the library
	 */
	public function setUp() {
		parent::setUp();
	}

	protected function call_private_method( $obj, string $name, array $args = array() ) {
		$class  = new ReflectionClass( $obj );
		$method = $class->getMethod( $name );
		$method->setAccessible( true );
		return $method->invokeArgs( $obj, $args );
	}

	protected function get_private_property( $obj, string $name ) {
		$class    = new ReflectionClass( $obj );
		$property = $this->get_private_property_reculsion( $class, $name );

		if ( ! $property ) {
			return null;
		}

		$property->setAccessible( true );
		return $property->getValue( $obj );
	}

	private function get_private_property_reculsion( ReflectionClass $class, string $name ) {
		if ( $class->hasProperty( $name ) ) {
			return $class->getProperty( $name );
		}

		$parent = $class->getParentClass();

		if ( $parent ) {
			return $this->get_private_property_reculsion( $parent, $name );
		}

		return false;
	}

	protected function set_private_property( $obj, string $name, $value ) {
		$class    = new ReflectionClass( $obj );
		$property = $class->getProperty( $name );
		$property->setAccessible( true );
		return $property->setValue( $obj, $value );
	}

	protected function get_stylesheet_directory_uri() {
		return get_theme_root_uri( 'twentynineteen' ) . '/twentynineteen';
	}
}
