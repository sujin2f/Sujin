<?php
/**
 * Autoload
 *
 * @project WP-Express 2
 * @since   1.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

if ( ! defined( 'WP_EXPRESS_ASSET_URL' ) ) {
	$dir = __DIR__ . '/assets/dist';
	$dir = explode( '/wp-content', $dir );
	array_shift( $dir );
	$baseurl = content_url() . implode( '', $dir );

	define( 'WP_EXPRESS_ASSET_URL', $baseurl );
}

if ( !function_exists( 'sujin_wp_express_2_autoloader' ) ) {
	function sujin_wp_express_2_autoloader() {
		spl_autoload_register( function( $class_name ) {
			$namespace = 'Sujin\\Wordpress\\WP_Express\\';

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
			$path = array_map( 'sujin_wp_express_2_autoloader_callback', $path );
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

	function sujin_wp_express_2_autoloader_callback( $string ) {
		$out = array();

		preg_match_all( '/((?:^|[A-Z])[a-z]+)/', $string, $matches );
		foreach( $matches[0] as $match ) {
			$out[] = strtolower( $match );
		}

		return implode( '-', $out );
	}

	sujin_wp_express_2_autoloader();
}
