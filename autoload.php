<?php
/**
 * Autoload
 *
 * @project WP-Express 3
 * @version 3.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

include_once( dirname( __FILE__ ) . DIRECTORY_SEPARATOR . 'classes/class-autoloader.php' );
$class_loader = new Sujin\Wordpress\Theme\Sujin\Autoloader();
$class_loader->register();

// Browser Test
if ( 'wpexpress.test' === $_SERVER['SERVER_NAME'] ) {
	// include_once( __DIR__ . DIRECTORY_SEPARATOR . 'tests' . DIRECTORY_SEPARATOR . 'class-browser-test.php' );
	// new BrowserTest();
}
