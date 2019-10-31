<?php

/**
 * PHPUnit bootstrap file
 */

// Composer autoloader must be loaded before WP_PHPUNIT__DIR will be available
require_once dirname( dirname( __DIR__ ) ) . '/vendor/autoload.php';

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

$home_dir = dirname( dirname( __DIR__ ) );

include_once( $home_dir . '/autoload.php' );
include_once( $home_dir . '/vendor/sujin/wp-express/autoload.php' );
