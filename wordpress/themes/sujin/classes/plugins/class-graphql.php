<?php
/**
 * GraphQL Mutation
 *
 * @package sujinc.com
 * @since   10.2.0
 * @author  Sujin 수진 Choi
 */

namespace Sujin\Theme\Plugins;

class GraphQL {
	public function update_background() {
		$nonce    = wp_create_nonce( 'update_background' );
		$base_url = get_home_url();

		$version = '0.0.0';
		if ( function_exists( 'getenv_docker') ) {
			$version = getenv_docker( 'VERSION', $version );
		}

		$mutation = array(
			'query' => '
				mutation {
					updateBackground(nonce: "' . $nonce . '") {
						result
					}
				}',
		);
		$args     = array(
			'headers' => array(
				'Content-Type' => 'application/json',
			),
			'body'    => wp_json_encode( $mutation ),
		);

		update_option( 'update_background_' . $nonce, $nonce );
		$response = wp_remote_post( $base_url . '/api/graphql/' . $version, $args );
		return $response;
	}

	public function update_page( \WP_Post $post ) {
		$post_id  = $post->ID;
		$nonce    = wp_create_nonce( 'update_page_' . $post_id );
		$base_url = get_home_url();

		$version = '0.0.0';
		if ( function_exists( 'getenv_docker') ) {
			$version = getenv_docker( 'VERSION', $version );
		}

		$mutation = array(
			'query' => '
				mutation {
					updatePage(nonce: "' . $nonce . '", slug: "' . $post->post_name . '") {
						result
					}
				}',
		);
		$args     = array(
			'headers' => array(
				'Content-Type' => 'application/json',
			),
			'body'    => wp_json_encode( $mutation ),
		);

		update_option( 'update_page_' . $nonce, $nonce . '-' . $post->post_name );
		$response = wp_remote_post( $base_url . '/api/graphql/' . $version, $args );
		return $response;
	}

	public function update_post( \WP_Post $post ) {
		$post_id  = $post->ID;
		$nonce    = wp_create_nonce( 'update_post_' . $post_id );
		$base_url = get_home_url();

		$version = '0.0.0';
		if ( function_exists( 'getenv_docker') ) {
			$version = getenv_docker( 'VERSION', $version );
		}

		$mutation = array(
			'query' => '
				mutation {
					updatePost(nonce: "' . $nonce . '", slug: "' . $post->post_name . '") {
						result
					}
				}',
		);
		$args     = array(
			'headers' => array(
				'Content-Type' => 'application/json',
			),
			'body'    => wp_json_encode( $mutation ),
		);

		update_option( 'update_post_' . $nonce, $nonce . '-' . $post->post_name );
		$response = wp_remote_post( $base_url . '/api/graphql/' . $version, $args );
		return $response;
	}

	public function update_category( string $slug ) {
		$nonce    = wp_create_nonce( 'update_term_' . $slug );
		$base_url = get_home_url();
		$version  = '0.0.0';
		if ( function_exists( 'getenv_docker') ) {
			$version = getenv_docker( 'VERSION', $version );
		}

		$mutation = array(
			'query' => '
				mutation {
					updateCategory(nonce: "' . $nonce . '", slug: "' . $slug . '") {
						result
					}
				}',
		);
		$args     = array(
			'headers' => array(
				'Content-Type' => 'application/json',
			),
			'body'    => wp_json_encode( $mutation ),
		);

		update_option( 'update_term_' . $nonce, $nonce . '-' . $slug );
		$response = wp_remote_post( $base_url . '/api/graphql/' . $version, $args );
		return $response;
	}

	public function update_tag( string $slug ) {
		$nonce    = wp_create_nonce( 'update_term_' . $slug );
		$base_url = get_home_url();
		$version  = '0.0.0';
		if ( function_exists( 'getenv_docker') ) {
			$version = getenv_docker( 'VERSION', $version );
		}

		$mutation = array(
			'query' => '
				mutation {
					updateTag(nonce: "' . $nonce . '", slug: "' . $slug . '") {
						result
					}
				}',
		);
		$args     = array(
			'headers' => array(
				'Content-Type' => 'application/json',
			),
			'body'    => wp_json_encode( $mutation ),
		);

		update_option( 'update_term_' . $nonce, $nonce . '-' . $slug );
		$response = wp_remote_post( $base_url . '/api/graphql/' . $version, $args );
		return $response;
	}
}
