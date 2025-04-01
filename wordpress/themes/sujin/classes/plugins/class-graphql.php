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
	public function update_post( \WP_Post $post ) {
		$post_id  = $post->ID;
		$nonce    = wp_create_nonce( 'update_post_' . $post_id );
		$base_url = get_home_url();

		$categories = array();
		$tags       = array();
		$the_cats   = get_the_category( $post_id );
		$the_tags   = get_the_tags( $post_id );

		if ( is_array( $the_cats ) ) {
			foreach ( get_the_category( $post_id ) as  $category ) {
				array_push( $categories, $category->slug );
			}
		}

		if ( is_array( $the_tags ) ) {
			foreach ( get_the_tags( $post_id ) as  $tag ) {
				array_push( $tags, $tag->slug );
			}
		}

		$version = '0.0.0';
		if ( function_exists( 'getenv_docker') ) {
			$version = getenv_docker( 'VERSION', $version );
		}

		$mutation = array(
			'query' => '
				mutation {
					updatePost(nonce: "' . $nonce . '", slug: "' . $post->post_name . '", id: ' . $post_id . ', categories: "' . join( ',', $categories ) . '", tags: "' . join( ',', $tags ) . '") {
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

	public function update_term( int $term_id ) {
		$nonce    = wp_create_nonce( 'update_term_' . $term_id );
		$base_url = get_home_url();
		$version  = '0.0.0';
		if ( function_exists( 'getenv_docker') ) {
			$version = getenv_docker( 'VERSION', $version );
		}

		$mutation = array(
			'query' => '
				mutation {
					updateTerm(nonce: "' . $nonce . '", termId: ' . $term_id . ') {
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

		update_option( 'update_term_' . $nonce, $nonce . '-' . $term_id );
		$response = wp_remote_post( $base_url . '/api/graphql/' . $version, $args );
		return $response;
	}
}
