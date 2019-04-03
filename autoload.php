<?php
/**
 * Autoload
 *
 * @project Sujin
 * @since   8.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

if ( !function_exists( 'sujin_autoloader' ) ) {
	function sujin_autoloader() {
		spl_autoload_register( function( $class_name ) {
			$namespace = 'Sujin\\Wordpress\\Theme\\Sujin\\';

			if ( stripos( $class_name, $namespace ) === false ) {
				return;
			}

			$source_dir = __DIR__ . DIRECTORY_SEPARATOR . 'classes';

			// Delete Namespace
			$path = str_replace( $namespace, '', $class_name ) . '.php';
			$path = explode( '\\', $path );

			// Separate Filename and Path
			$file_name = array_pop( $path );

			// Change Path to path-name/path-name
			$path = array_map( 'sujin_autoloader_callback', $path );
			$path = implode( DIRECTORY_SEPARATOR, $path );

			// Change Filename to class-class-name.php
			$file_name = strtolower( $file_name );
			$file_name = str_replace( '_', '-', $file_name );
			$file_name = 'class-' . $file_name;

			$file_segs = array( $source_dir, $path, $file_name );
			$file_segs = array_filter( $file_segs );
			$file_name = implode( DIRECTORY_SEPARATOR, $file_segs );

			if ( is_readable( $file_name ) ) {
				include_once( $file_name );
			}
		});
	}

	function sujin_autoloader_callback( $string ) {
		$out = array();

		preg_match_all( '/((?:^|[A-Z])[a-zA-Z-0-9]+)/', $string, $matches );

		foreach( $matches[0] as $match ) {
			$out[] = strtolower( $match );
		}

		return implode( '-', $out );
	}

	sujin_autoloader();
}
