<?php
/**
 * Class Autoloader
 *
 * @project WP Express
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin;

use Sujin\Wordpress\Theme\Sujin\Exceptions\Not_Found_Exception;

if ( ! defined( 'ABSPATH' ) ) {
	header( 'Status: 404 Not Found' );
	header( 'HTTP/1.1 404 Not Found' );
	exit();
}

class Autoloader {
	private $namespace = 'Sujin\\Wordpress\\Theme\\Sujin\\';
	private $source_dir;

	public function __construct() {
		$this->source_dir = dirname( __FILE__ );
	}

	private function get_class_path( string $class_name ): ?array {
		if ( stripos( $class_name, $this->namespace ) === false ) {
			return null;
		}

		$path = array(
			'extension' => '.php',
			// Delete Namespace and divide
			'path' => explode( '\\', str_replace( $this->namespace, '', $class_name ) ),
		);

		// Unit test file
		if ( strpos( $class_name, '\\Unit_Test' ) === strlen( $class_name ) - 10 ) {
			$path['extension']  = '.spec.php';
			array_pop( $path['path'] );
		}

		$path['path'] = array_map( array( $this, 'map_convert_path' ), $path['path'] );
		array_unshift( $path['path'], $this->source_dir );

		return $path;
	}

	public function load_class_file( string $class_name ): void {
		$path = $this->get_class_path( $class_name );

		if ( ! $path ) {
			return;
		}

		$index = implode( DIRECTORY_SEPARATOR, $path['path'] ) . DIRECTORY_SEPARATOR . 'index' . $path['extension'];
		$file  = array_pop( $path['path'] );
		$file  = implode( DIRECTORY_SEPARATOR, $path['path'] ) . DIRECTORY_SEPARATOR . 'class-' . $file . $path['extension'];

		if ( is_readable( $file ) ) {
			include_once( $file );
			return;
		}

		if ( is_readable( $index ) ) {
			include_once( $index );
			return;
		}
	}

	public function map_convert_path( string $string ): string {
		$segments = array();

		preg_match_all( '/((?:^|[A-Z])[a-z0-9]+)/', $string, $matches );

		return strtolower( implode( '-', $matches[0] ) );
	}

	public function register(): void {
		spl_autoload_register( array( $this, 'load_class_file' ) );
	}
}
