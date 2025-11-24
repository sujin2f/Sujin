<?php
/**
 * Token Management
 *
 * @package sujinc.com
 * @since   12.0.0
 * @author  Sujin 수진 Choi
 */

namespace Sujin\Theme;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

/**
 * Post controller
 */
class Tokens {
	private const ACCESS  = 'access-token';
	private const REFRESH = 'refresh-token';

	/**
	 * Constructor
	 */
	public function __construct() {
		$self = __CLASS__;
		add_action( 'admin_notices', array( $this, 'admin_notice' ), 30 );
		add_action( 'wp_login', array( __CLASS__, 'request_tokens' ), 15, 2 );
	}

	/**
	 * Access token error.
	 */
	public function admin_notice() {
		$token = self::get_token();
		if ( ! $token ) {
			echo '<div class="notice notice-error"><p>Your access token is empty.</p></div>';
		}
	}

	/**
	 * Get refresh & access tokens
	 *
	 * @param string   $_    user name.
	 * @param \WP_User $user user.
	 */
	public static function request_tokens( string $_, \WP_User $user ): void {
		$query    = wp_json_encode(
			array(
				'query' => '
					mutation {
						login(email: "' . $user->user_email . '", name: "", picture: "") {
							_id
						}
					}',
			)
		);
		$options  = array(
			'http' => array(
				'method'  => 'POST',
				'header'  => 'Content-type: application/json',
				'content' => $query,
			),
		);
		$context  = stream_context_create( $options );
		$endpoint = getenv_docker( 'GQL_ENDPOINT', '' );
		file_get_contents( $endpoint, true, $context );

		foreach ( $http_response_header as $header ) {
			if ( str_starts_with( $header, 'authorization: Bearer ' ) ) {
				$_SESSION[ self::REFRESH ] = substr( $header, 22 );

				self::refresh_token();
				self::get_token();
				return;
			}
		}
	}

	/**
	 * Refresh access token
	 */
	private static function refresh_token(): void {
		$token = isset( $_SESSION[ self::REFRESH ] ) ? esc_attr( $_SESSION[ self::REFRESH ] ) : ''; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		if ( ! $token ) {
			$user = wp_get_current_user();
			self::request_tokens( '', $user );
		}
		$query    = wp_json_encode(
			array(
				'query' => '
					mutation {
						refresh
					}',
			)
		);
		$options  = array(
			'http' => array(
				'method'  => 'POST',
				'header'  => "Content-type: application/json\r\nauthorization: Bearer {$token}",
				'content' => $query,
			),
		);
		$context  = stream_context_create( $options );
		$endpoint = getenv_docker( 'GQL_ENDPOINT', '' );
		file_get_contents( $endpoint, true, $context );

		foreach ( $http_response_header as $header ) {
			if ( str_starts_with( $header, 'authorization: Bearer ' ) ) {
				$_SESSION[ self::ACCESS ] = substr( $header, 22 );
				return;
			}
		}
	}

	/**
	 * Get access token or refresh
	 *
	 * @return string access token
	 */
	public static function get_token(): string {
		$token = isset( $_SESSION[ self::ACCESS ] ) ? esc_attr( $_SESSION[ self::ACCESS ] ) : ''; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		$key   = getenv_docker( 'ACCESS_SECRET', '' );

		try {
			JWT::decode( $token, new Key( $key, 'HS256' ) );
		} catch ( \Exception $_ ) {
			self::refresh_token();
			$token = isset( $_SESSION[ self::ACCESS ] ) ? esc_attr( $_SESSION[ self::ACCESS ] ) : ''; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
			try {
				JWT::decode( $token, new Key( $key, 'HS256' ) );
			} catch ( \Exception $_ ) {
				$_SESSION[ self::ACCESS ] = '';
				$token                    = '';
			}
		}
		return $token;
	}
}
