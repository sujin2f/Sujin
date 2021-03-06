<?php

/**
 * PHPUnit bootstrap file
 */

if ( ! defined( 'SUJIN_DEV_MODE' ) ) {
	define( 'SUJIN_DEV_MODE', true );
}

if ( ! defined( 'SJ_PHPUNIT__DIR' ) ) {
	define( 'SJ_PHPUNIT__DIR', dirname( __FILE__ ) );
}

if ( ! defined( 'SJ_BASE__DIR' ) ) {
	define( 'SJ_BASE__DIR', dirname( dirname( __DIR__ ) ) );
}

// Composer autoloader must be loaded before WP_PHPUNIT__DIR will be available
require_once SJ_BASE__DIR . '/vendor/autoload.php';

// Give access to tests_add_filter() function.
require_once getenv( 'WP_PHPUNIT__DIR' ) . '/includes/functions.php';

tests_add_filter(
	'muplugins_loaded',
	function() {
		// test set up, plugin activation, etc.
	}
);

// Start up the WP testing environment.
require getenv( 'WP_PHPUNIT__DIR' ) . '/includes/bootstrap.php';

include_once( SJ_BASE__DIR . '/vendor/sujin/wp-express/autoload.php' );
$class_loader = new Sujin\Wordpress\WP_Express\Autoloader(
	'Sujin\\Wordpress\\Theme\\Sujin',
	SJ_BASE__DIR . DIRECTORY_SEPARATOR . 'classes',
);
$class_loader->register();

include_once( SJ_PHPUNIT__DIR . '/class-test-case.php' );
