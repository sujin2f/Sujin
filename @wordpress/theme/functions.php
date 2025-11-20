<?php
/**
 * Functions
 *
 * @package sujinc.com
 * @since   1.0.0
 * @author  Sujin 수진 Choi
 */

if ( ! defined( 'ABSPATH' ) ) {
	header( 'Status: 404 Not Found' );
	header( 'HTTP/1.1 404 Not Found' );
	exit();
}

require_once __DIR__ . '/vendor/autoload.php';
new Sujin\Theme\Bootstrap();

/**
 * For Dev: Do not call this from production
 *
 * @param mixed ...$value Log message.
 * @return void
 * @throws \WP_Error Only dev allows this usage.
 */
function halp( mixed ...$value ) {
	if ( ! is_dev() ) {
		throw new \WP_Error( 'Production should not use halp()' );
	}
	foreach ( $value as $item ) {
		error_log( wp_json_encode( $item ) ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
	}
}

/**
 * For Dev: check if the environment is dev
 *
 * @return bool
 */
function is_dev(): bool {
	$env = getenv_docker( 'ENV', '' );
	return 'development' === $env;
}

/**
 * Terminate with error message
 *
 * @param string $message Log message.
 * @throws \Exception Error with message.
 */
function not_found( string $message ): void {
	header( 'HTTP/1.1 404 Not Found' );
	error_log( $message ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
	throw new \Exception( esc_attr( $message ) );
}
