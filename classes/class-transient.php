<?php
namespace Sujin\Wordpress\Theme\Sujin;

use JsonSerializable;

/*
 * To create a new transient, use new Transient( $items, $cache_ttl )
 * To create an exiting transient from key, use Transient::get_transient( $key )
 * To store the instance into transient, use $this->set_transient( $key );
 */
class Transient implements JsonSerializable {
	public $cache_ttl;
	public $expire_at;
	public $items;

	public function __construct( $items, int $cache_ttl = 0 ) {
		$this->items     = $items;
		$this->cache_ttl = $cache_ttl;
		$this->expire_at = time() + $this->cache_ttl;
	}

	public static function get_transient( string $key ): ?Transient {
		$transient = get_transient( $key );
		$json      = json_decode( $transient, true );

		if ( json_last_error() ) {
			return null;
		}

		if ( ! array_key_exists( 'items', $json ) || ! array_key_exists( 'expire_at', $json ) ) {
			return null;
		}

		$transient            = new Transient( $json['items'] );
		$transient->expire_at = $json['expire_at'];

		return $transient;
	}

	public function is_expired() {
		return is_null( $this->items ) || $this->expire_at > time();
	}

	public function set_transient( string $key ) {
		set_transient( $key, wp_json_encode( $this ) );
	}

	public function jsonSerialize() {
		return array(
			'items'     => $this->items,
			'expire_at' => $this->expire_at,
		);
	}
}
