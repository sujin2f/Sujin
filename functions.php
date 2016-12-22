<?php
/**
 * Functions
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

include_once( "autoload.php" );
// include_once( 'wp_express/autoload.php' );

$agents = '/(facebookexternalhit|Twitterbot|Pinterest|Google.*snippet|GoogleBot|facebot)/i';
if ( preg_match( $agents, $_SERVER[ 'HTTP_USER_AGENT' ] ) ) {
	$agent_mode = new \Sujin\AgentMode();
	$agent_mode->trigger_agent_mode();
} else {
	new \Sujin\Init();
}

/*
global $wp_rewrite;
var_dump( $wp_rewrite );
*/
