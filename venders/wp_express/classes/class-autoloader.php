<?php
/**
 * Class Autoloader
 *
 * @project WP Express
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\WP_Express;

if ( ! defined( 'ABSPATH' ) ) {
	header( 'Status: 404 Not Found' );
	header( 'HTTP/1.1 404 Not Found' );
	exit();
}

class Autoloader {
	private $namespace = 'Sujin\\Wordpress\\WP_Express\\';
	private $source_dir;

	public function __construct() {
		$this->source_dir = dirname( __FILE__ );
	}

	public function load_class_file( string $class_name ) {
		if ( stripos( $class_name, $this->namespace ) === false ) {
			return;
		}

		// Delete Namespace and divide
		$path      = str_replace( $this->namespace, '', $class_name ) . '.php';
		$path      = explode( '\\', $path );
		$file_name = array_pop( $path );

		// Change Path to path-name/path-name
		$path = array_map( array( $this, 'map_convert_path' ), $path );
		$path = implode( DIRECTORY_SEPARATOR, $path );

		// Change Filename to class-class-name.php
		$file_name = strtolower( $file_name );
		$file_name = str_replace( '_', '-', $file_name );
		$file_name = 'class-' . $file_name;

		$path = array( $this->source_dir, $path, $file_name );
		$path = array_filter( $path );
		$path = implode( DIRECTORY_SEPARATOR, $path );

		if ( is_readable( $path ) ) {
			include_once( $path );
		}
	}

	public function map_convert_path( string $string ): string {
		$segments = array();

		preg_match_all( '/((?:^|[A-Z])[a-z]+)/', $string, $matches );
		foreach ( $matches[0] as $match ) {
			$segments[] = strtolower( $match );
		}

		return implode( '-', $segments );
	}

	public function register() {
		spl_autoload_register( array( $this, 'load_class_file' ) );
	}
}
