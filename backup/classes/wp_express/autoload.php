<?php
/**
 * WP Express Autoloader & Redirect
 *
 * @author  Sujin 수진 Choi
 * @package wp-express
 * @version 5.0
 * @website http://sujinc.com
 *
 * Licensed under The MIT License
 * Redistributions of files must retain the above copyright notice
 *
 */

global $WP_Express_Version;

if ( empty( $WP_Express_Version ) )
	$WP_Express_Version = array();

$WP_Express_Version[] = 5.0;

add_action( 'after_setup_theme', 'load_wordpress_express_5_0' );

if ( !function_exists( 'load_wordpress_express_5_0' ) ) {
	function load_wordpress_express_5_0() {
		// Check the latest version
		global $WP_Express_Version;
		arsort( $WP_Express_Version );

		if ( $WP_Express_Version[0] != 5.0 )
			return;

		spl_autoload_register( function( $className ) {
			$namespace = 'WE\\';
			if ( stripos( $className, $namespace ) === false ) {
				return;
			}

			$sourceDir = __DIR__ . DIRECTORY_SEPARATOR . 'src' . DIRECTORY_SEPARATOR;
			$fileName  = str_replace( [ $namespace, '\\' ], [ $sourceDir, DIRECTORY_SEPARATOR ], $className ) . '.php';

			if ( is_readable( $fileName ) ) {
				include $fileName;
			}
		});

		new WE_Redirect_5_0;
	}

	class WE_Redirect_5_0 {
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
}
