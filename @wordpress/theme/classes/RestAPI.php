<?php
/**
 * Rest API
 *
 * @package sujinc.com
 * @since   12.0.0
 * @author  Sujin 수진 Choi
 */

namespace Sujin\Theme;

/**
 * Secure WP RestAPI
 *
 * 1. Block RestAPI
 */
class RestAPI {
	/**
	 * Constructor
	 *
	 * @visibility public
	 */
	public function __construct() {
		add_action( 'rest_pre_dispatch', array( $this, 'block_rest_endpoint' ) );
	}

	/**
	 * Access Control, only same domain can access to RestAPI
	 *
	 * @visibility public
	 * @throws \WP_Error Error with message.
	 */
	public function block_rest_endpoint(): void {
		// Check if the WordPress REST API request.
		if ( ! defined( 'REST_REQUEST' ) || ! REST_REQUEST ) {
			return;
		}

		// Internal request exception like Gutenberg.
		if ( isset( $_SERVER['HTTP_REFERER'] ) ) {
			$referer_host = wp_parse_url( wp_unslash( $_SERVER['HTTP_REFERER'] ), PHP_URL_HOST ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
			$site_host    = wp_parse_url( home_url(), PHP_URL_HOST );

			// Same domain.
			if ( $referer_host === $site_host ) {
				return;
			}
		}

		not_found( 'This page is unable to read.' );
	}
}
