<?php
/**
 * Auto-Loading
 *
 * @project Sujin
 * @since   7.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

if ( !defined( "ABSPATH" ) ) {
	header( "Status: 404 Not Found" );
	header( "HTTP/1.1 404 Not Found" );
	exit();
}

if ( !function_exists( 'load_sujin_mk7' ) ) {
	function load_sujin_mk7() {
		spl_autoload_register( function( $className ) {
			$namespace = 'Sujin\\';
			if ( stripos( $className, $namespace ) === false ) {
		        	return;
			}

			$sourceDir = __DIR__ . DIRECTORY_SEPARATOR . 'classes' . DIRECTORY_SEPARATOR;
			$fileName  = str_replace( [ $namespace, '\\' ], [ $sourceDir, DIRECTORY_SEPARATOR ], $className ) . '.php';

			if ( is_readable( $fileName ) ) {
				include $fileName;
			}
		});
	}

	load_sujin_mk7();
}

if ( !class_exists('WE_Redirect' ) ) {
	class WE_Redirect {
		public function __construct() {
			add_filter( 'wp_redirect', array( $this, 'wp_redirect' ) );
		}

		public function wp_redirect( $location = false ) {
			if ( !$location ) $location = $_SERVER[ 'REQUEST_URI' ];

			if ( headers_sent() ) {
				printf( '<meta http-equiv="refresh" content="0; url=%s">', $location );
				printf( '<script>window.location="%s"</script>', $location );

				die;
			}

			return $location;
		}

	}
	new WE_Redirect;
}
