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
	 * Send Redis publishing message
	 *
	 * @param string $channel message channel.
	 * @param mixed  $message .
	 * @return void
	 */
	public function publish( string $channel, mixed $message = '' ): void {
		if ( ! $this->redis || ! $this->redis->isConnected() ) {
			return;
		}
		$this->redis->publish( $channel, wp_json_encode( $message ) );
	}

	/**
	 * Destroy Redis client
	 */
	public function quit(): void {
		if ( ! $this->redis ) {
			return;
		}
		$this->redis->quit();
	}
}
