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
    private $nonce    = '';
    private $base_url = '';
    private $post;

    public function __construct( \WP_Post $post ) {
        $this->post    = $post;
        $post_id       = $post->ID;
		$this->nonce   = wp_create_nonce( 'clear-cache_' . $post_id );
		$is_dev        = false;
		if ( function_exists( 'getenv_docker' ) ) {
			$is_dev = getenv_docker( 'NODE_ENV', 'production' ) === 'development';
		}
		$this->base_url = $is_dev ? 'http://host.docker.internal:3000' : 'https://sujinc.com';
		if ( ! $is_dev && function_exists( 'getenv_docker' ) ) {
			$this->base_url = getenv_docker( 'NEXT_PUBLIC_BASE_URL', $this->base_url );
		}
	}

    public function remove_cache() {
		$categories = array();
		$tags       = array();
		foreach ( get_the_category( $this->post->ID ) as  $category ) {
			array_push( $categories, $category->slug );
		}
		foreach ( get_the_tags( $this->post->ID ) as  $tag ) {
			array_push( $tags, $tag->slug );
		}

		$mutation = array(
			'query' => '
				mutation {
					removeCache(nonce: "' . $this->nonce . '", slug: "' . $this->post->post_name . '", id: ' . $this->post->ID . ', categories: "' . join( ',', $categories ) . '", tags: "' . join( ',', $tags ) . '") {
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

		update_option( 'remove_cache', $this->nonce . '-' . $this->post->post_name );
		wp_remote_post( $this->base_url . '/api/graphql', $args );
    }

    public function update() {
		$categories = array();
		$tags       = array();
		foreach ( get_the_category( $this->post->ID ) as  $category ) {
			array_push( $categories, $category->slug );
		}
		foreach ( get_the_tags( $this->post->ID ) as  $tag ) {
			array_push( $tags, $tag->slug );
		}

		$mutation = array(
			'query' => '
				mutation {
					update(nonce: "' . $this->nonce . '", slug: "' . $this->post->post_name . '", id: ' . $this->post->ID . ', categories: "' . join( ',', $categories ) . '", tags: "' . join( ',', $tags ) . '") {
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

		update_option( 'update', $this->nonce . '-' . $this->post->post_name );
		wp_remote_post( $this->base_url . '/api/graphql', $args );
    }
}
