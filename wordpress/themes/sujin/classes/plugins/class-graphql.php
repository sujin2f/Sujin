<?php
/**
 * GraphQL Mutation
 *
 * @package sujinc.com
 * @since   10.2.0
 * @author  Sujin 수진 Choi
 */

namespace Sujin\Theme\Plugins;

use Sujin\Wordpress\WP_Express\Fields\Settings\Input;

class GraphQL {
	private $base_url;
	private $version;

	public function __construct() {
		$this->base_url = Input::get_instance( 'GQL Endpoint URL' )->get();
		$this->version  = '0.0.0';
		if ( function_exists( 'getenv_docker') ) {
			$this->version = getenv_docker( 'VERSION', $this->version );
		}
	}

	private function request(array $mutation): array {
		$args     = array(
			'headers' => array(
				'Content-Type' => 'application/json',
			),
			'body'    => wp_json_encode( $mutation ),
		);
		$response = wp_remote_post( $this->base_url . '/api/graphql/' . $this->version, $args );
		return $response;
	}

	public function update_background() {
		$nonce    = wp_create_nonce( 'update_background' );
		$mutation = array(
			'query' => '
				mutation {
					updateBackground(nonce: "' . $nonce . '") {
						result
					}
				}',
		);
		update_option( 'update_background_' . $nonce, $nonce );
		return $this->request( $mutation );
	}

	private function update( string $post_name, string $type ) {
		$nonce    = wp_create_nonce( 'update_' . $type . '_' . $post_name );
		$mutation = array(
			'query' => '
				mutation {
					update' . ucfirst( $type ) . '(nonce: "' . $nonce . '", slug: "' . $post_name . '") {
						result
					}
				}',
		);
		update_option( 'update_' . $type . '_' . $nonce, $nonce . '-' . $post_name );
		return $this->request( $mutation );
	}

	public function update_page( \WP_Post $post ) {
		return $this->update( $post->post_name, 'page');
	}

	public function update_post( \WP_Post $post ) {
		return $this->update( $post->post_name, 'post');
	}

	public function update_category( string $slug ) {
		return $this->update( $slug, 'category');
	}

	public function update_tag( string $slug ) {
		return $this->update( $slug, 'tag');
	}
}
