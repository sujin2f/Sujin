<?php
abstract class Test_Case_Theme_Sujin extends WP_UnitTestCase {
	/**
	 * Register the base data
	 */
	public static function setUpBeforeClass() {
		parent::setUpBeforeClass();

		require_once( SJ_PHPUNIT__DIR . '/data-storage/data/php/class-data-attachment.php' );
		require_once( SJ_PHPUNIT__DIR . '/data-storage/data/php/class-data-flickr.php' );
		require_once( SJ_PHPUNIT__DIR . '/data-storage/data/php/class-data-gallery.php' );
		require_once( SJ_PHPUNIT__DIR . '/data-storage/data/php/class-data-nav-menu.php' );
		require_once( SJ_PHPUNIT__DIR . '/data-storage/data/php/class-data-post.php' );
		require_once( SJ_PHPUNIT__DIR . '/data-storage/data/php/class-data-taxonomy.php' );
	}

	public function setUp(): void {
		parent::setUp();
		add_filter( 'stylesheet_directory', array( $this, 'stylesheet_directory' ) );
	}

	public function tearDown(): void {
		parent::tearDown();
		remove_filter( 'stylesheet_directory', array( $this, 'stylesheet_directory' ) );
	}

	public function stylesheet_directory(): string {
		return SJ_BASE__DIR;
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

	public function mock_request() {
		require_once( SJ_PHPUNIT__DIR . '/data-storage/class-http-request.php' );
		Http_Request::get_instance();
	}

	protected function get_error_response( WP_Error $wp_error ): array {
		$code = array_keys( $wp_error->errors )[0];

		return array(
			'code'    => $code,
			'message' => $wp_error->errors[ $code ][0],
			'data'    => $wp_error->error_data[ $code ],
		);
	}
}
