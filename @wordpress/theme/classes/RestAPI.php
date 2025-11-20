<?php
/**
 * Rest API
 *
 * @package sujinc.com
 * @since   12.0.0
 * @author  Sujin 수진 Choi
 */

namespace Sujin\Theme;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Sujin\Theme\RestAPI\Posts;

/**
 * Secure WP RestAPI
 *
 * 1. Validate JWT
 * 2. CORS header
 */
class RestAPI {
	/**
	 * Constructor
	 *
	 * @visibility public
	 */
	public function __construct() {
		new Posts();
		add_action( 'rest_pre_dispatch', array( $this, 'validate_token' ), 15, 3 );
	}

	/**
	 * Access Control, only admin should access to RestAPI
	 * Access token is created from GraphQL server with extra short lifetime.
	 *
	 * @visibility public
	 * @param mixed            $_       result.
	 * @param \WP_REST_Server  $__      not used.
	 * @param \WP_REST_Request $request HTTP Request.
	 * @throws \WP_Error Error with message.
	 */
	public function validate_token( mixed $_, \WP_REST_Server $__, \WP_REST_Request $request ): void {
		if ( is_dev() ) {
			return;
		}

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

		// JWT Auth.
		$headers = $request->get_headers();
		$header  = $headers['authorization'] ?? $headers['Authorization'];

		if ( ! $header || ( is_array( $header ) && ! $header[0] ) ) {
			not_found( 'JWT Auth header does not exist.' );
		}

		$token   = $headers['authorization'] ?? $headers['Authorization'];
		$token   = str_replace( $token, 'Bearer ', '' );
		$secret  = getenv_docker( 'NEXTAUTH_SECRET', '' );
		$decoded = JWT::decode( $secret, new Key( $secret, 'HS256' ) );
		$admin   = get_users( 'role=Administrator' );

		if ( ! $decoded['admin'] || $admin[0]->user_email !== $decoded['email'] ) {
			not_found( 'JWT Auth header does not exist.' );
		}
	}
}
