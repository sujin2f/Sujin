<?php
/**
 * Redis client
 *
 * @package sujinc.com
 * @since   12.0.0
 * @author  Sujin 수진 Choi
 */

namespace Sujin\Theme;

use Predis\Client as RedisClient;

/**
 * Post controller
 */
class Redis {
	/**
	 * Redis Client
	 *
	 * @var \Predis\Client
	 */
	private $redis;
	/**
	 * Constructor
	 */
	public function __construct() {
		$endpoint = getenv_docker( 'REDIS_ENDPOINT', '' );
		if ( ! $endpoint ) {
			return;
		}
		$this->redis = new RedisClient( "redis://{$endpoint}" );
	}

	/**
	 * Delete Redis cache
	 *
	 * @param string $key key to delete.
	 * @return void
	 */
	public function del( string $key ): void {
		if ( ! $this->redis || ! $this->redis->isConnected() ) {
			return;
		}

		$keys = $this->keys( $key );
		if ( $keys ) {
			foreach ( $keys as $key ) {
				$this->redis->del( $key );
			}
		}
	}

	/**
	 * Get keys
	 *
	 * @param string $key starts with.
	 * @return array key array that starts with the $key
	 */
	private function keys( string $key ): array {
		return $this->redis->keys( "@next-{$key}*" );
	}
}
