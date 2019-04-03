<?php
/**
 * Instantiable Trait
 *
 * @project WP-Express
 * @since   1.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\WP_Express\Helpers;

if ( !defined( "ABSPATH" ) ) {
	header( "Status: 404 Not Found" );
	header( "HTTP/1.1 404 Not Found" );
	exit();
}

trait Messageable {
	public function show_message( $text, $class = 'updated' ) {
		if ( ! is_admin() )
			return false;

		printf( '<div id="message" class="%s"><p>%s</a></p></div>', $class, $text );
	}
}
