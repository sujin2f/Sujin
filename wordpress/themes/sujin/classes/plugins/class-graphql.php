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
		$key         = 'mutate_attachment';
		$nonce       = wp_create_nonce( $key );
		$mutation    = array(
			'query' => '
				mutation {
					mutateBackground(nonce: "' . $nonce . '") {
						result
					}
				}',
		);
		$nonce_value = hash( 'sha256',  $nonce . json_encode( $mutation ) );

		update_option( $key . '_' . $nonce, $nonce_value );
		return $this->request( $mutation );
	}

	private function update( string $slug, string $type ) {
		$key         =  'mutate_' . $type . '_' . $slug ;
		$nonce       = wp_create_nonce( $key );
		$mutation    = array(
			'query' => '
				mutation {
					mutate' . ucfirst( $type ) . '(nonce: "' . $nonce . '", slug: "' . $slug . '") {
						result
					}
				}',
		);
		$nonce_value = hash( 'sha256',  $nonce . json_encode( $mutation ) );
		update_option( $key . '_' . $nonce, $nonce_value );
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
