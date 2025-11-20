<?php
/**
 * Rest API
 *
 * @package sujinc.com
 * @since   12.0.0
 * @author  Sujin 수진 Choi
 */

namespace Sujin\Theme\RestAPI;

/**
 * Secure WP RestAPI
 *
 * 1. Validate JWT
 * 2. CORS header
 */
class Posts {
	/**
	 * Constructor
	 *
	 * @visibility public
	 */
	public function __construct() {
		add_action( 'rest_prepare_post', array( $this, 'modify_post_content_rest' ), 15, 2 );
	}

	/**
	 * Access Control, only admin should access to RestAPI
	 * Access token is created from GraphQL server with extra short lifetime.
	 *
	 * $response->data['id']
	 * $response->data['slug']
	 * $response->data['link']
	 * $response->data['status']
	 * $response->data['type']
	 *
	 * @visibility public
	 * @param  \WP_REST_Response $response result.
	 * @param  \WP_Post          $post     not used.
	 * @return \WP_REST_Response Response.
	 */
	public function modify_post_content_rest( \WP_REST_Response $response, \WP_Post $post ): \WP_REST_Response {
		// Replacing or New items.
		$response->data['title']   = $response->data['title']['rendered'];
		$response->data['date']    = strtotime( $response->data['date'] ) / ( 60 * 60 * 24 ); // seconds to days.
		$response->data['content'] = $response->data['content']['rendered'];
		$response->data['excerpt'] = $response->data['excerpt']['rendered'];
		$response->data['meta']    = array();
		$response->data['images']  = array();
		$response->data['meta']    = array();

		// Removing items.
		unset( $response->data['date_gmt'] );
		unset( $response->data['guid'] );
		unset( $response->data['modified'] );
		unset( $response->data['modified_gmt'] );
		unset( $response->data['author'] );
		unset( $response->data['featured_media'] );
		unset( $response->data['comment_status'] );
		unset( $response->data['ping_status'] );
		unset( $response->data['sticky'] );
		unset( $response->data['template'] );
		unset( $response->data['format'] );
		unset( $response->data['categories'] );
		unset( $response->data['tags'] );
		unset( $response->data['class_list'] );
		unset( $response->data['acf'] );

		return $response;
	}
}
