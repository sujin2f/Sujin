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
		$key     = getenv_docker( 'INTER_COM_SECRET', '' );
		$payload = array(
			'name'    => $user->user_nicename,
			'email'   => $user->user_email,
			'picture' => '',
		);
		$token   = '';

		try {
			$token = self::generate_token( $payload, 20, $key );
		} catch ( \Exception $_ ) { // phpcs:ignore Generic.CodeAnalysis.EmptyStatement.DetectedCatch
		}

		if ( ! $token ) {
			return;
		}

		$query    = wp_json_encode(
			array(
				'query' => '
					mutation {
						login(email: "' . $user->user_email . '", name: "", picture: "")
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
				$token   = substr( $header, 22 );
				$payload = JWT::decode( $token, new Key( $key, 'HS256' ) );
				try {
					$sub = self::decode_text( $payload->sub );
					$sub = json_decode( $sub );

					$_SESSION[ self::REFRESH ] = $sub->refreshToken; // phpcs:ignore WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase
					$_SESSION[ self::ACCESS ]  = $sub->accessToken; // phpcs:ignore WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase
				} catch ( \Exception $_ ) { // phpcs:ignore Generic.CodeAnalysis.EmptyStatement.DetectedCatch
				}

				return;
			}
		}
	}

	/**
	 * Refresh access token
	 */
	public static function refresh_token(): void {
		$token = isset( $_SESSION[ self::REFRESH ] ) ? esc_attr( $_SESSION[ self::REFRESH ] ) : ''; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		if ( ! $token ) {
			$user = wp_get_current_user();
			self::request_tokens( '', $user );
			$token = isset( $_SESSION[ self::REFRESH ] ) ? esc_attr( $_SESSION[ self::REFRESH ] ) : ''; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		}
		if ( ! $token ) {
			return;
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
		return $token;
	}

	/**
	 * Encode text using AES-256-GCM encryption
	 * This should match with @common/encodeText
	 *
	 * @param string $text The text to encode.
	 * @return string Base64 encoded encrypted data
	 * @throws \Exception Invalid secret format.
	 * @throws \Exception Encryption failed.
	 */
	private static function encode_text( string $text ): string {
		$secret = getenv_docker( 'CRYPTO_KEY', '' );
		// Decode the secret to get the key and IV.
		$secret = json_decode( base64_decode( $secret ), true ); // phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions
		if ( ! $secret || count( $secret ) < 2 ) {
			throw new \Exception( 'Invalid secret format' );
		}

		$key = $secret[0];
		$iv  = $secret[1];

		// Decode the key from base64url format (JWK).
		$key = self::base64_decode( $key );
		$iv  = base64_decode( $iv ); // phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions

		// Encrypt using AES-256-GCM.
		$cipher_text = openssl_encrypt(
			$text,
			'aes-256-gcm',
			$key,
			OPENSSL_RAW_DATA,
			$iv,
			$tag
		);

		if ( false === $cipher_text ) {
			throw new \Exception( 'Encryption failed: ' . esc_attr( openssl_error_string() ) );
		}

		// Combine cipher_text and authentication tag.
		$encrypted = $cipher_text . $tag;

		// Return as base64.
		return base64_encode( $encrypted ); // phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions
	}

	/**
	 * Decode text using AES-256-GCM decryption
	 * This should match with @common/decodeText
	 *
	 * @param string $encoded Base64 encoded encrypted data.
	 * @return string Decoded plaintext
	 * @throws \Exception Invalid secret format.
	 * @throws \Exception Decryption failed.
	 */
	private static function decode_text( string $encoded ): string {
		$secret = getenv_docker( 'CRYPTO_KEY', '' );
		// Decode the secret to get the key and IV.
		$secret = json_decode( base64_decode( $secret ), true ); // phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions
		if ( ! $secret || count( $secret ) < 2 ) {
			throw new \Exception( 'Invalid secret format' );
		}

		$key = $secret[0];
		$iv  = $secret[1];

		// Decode the key from base64url format (JWK).
		$key = self::base64_decode( $key );
		$iv  = base64_decode( $iv ); // phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions

		// Decode the encrypted data.
		$encoded = base64_decode( $encoded ); // phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions

		// Extract the authentication tag (last 16 bytes for GCM).
		$tag_length  = 16;
		$cipher_text = substr( $encoded, 0, -$tag_length );
		$tag         = substr( $encoded, -$tag_length );

		// Decrypt using AES-256-GCM.
		$plaintext = openssl_decrypt(
			$cipher_text,
			'aes-256-gcm',
			$key,
			OPENSSL_RAW_DATA,
			$iv,
			$tag
		);

		if ( false === $plaintext ) {
			throw new \Exception( 'Decryption failed: ' . esc_attr( openssl_error_string() ) );
		}

		return $plaintext;
	}

	/**
	 * Decode a base64url encoded string
	 * Base64url uses - and _ instead of + and /
	 *
	 * @param string $data Base64url encoded string.
	 * @return string Decoded binary data
	 */
	private static function base64_decode( string $data ): string {
		// Add padding if needed.
		$padding = strlen( $data ) % 4;
		if ( $padding ) {
			$data .= str_repeat( '=', 4 - $padding );
		}

		// Convert base64url to base64.
		return base64_decode( strtr( $data, '-_', '+/' ) ); // phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions
	}


	/**
	 * Generate token
	 * This should match with @lib/generateToken
	 *
	 * @param mixed  $sub      data.
	 * @param int    $lifetime How long the token should live.
	 * @param string $secret   JWK secret.
	 * @return string token
	 */
	private static function generate_token( mixed $sub, int $lifetime, string $secret ): string {
		$iat     = time();
		$sub     = self::encode_text( wp_json_encode( $sub ) );
		$payload = array(
			'iss' => 'https://sujinc.com',
			'iat' => $iat,
			'exp' => $iat + $lifetime,
			'sub' => $sub,
		);

		return JWT::encode( $payload, $secret, 'HS256' );
	}
}
