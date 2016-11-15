<?php
/**
 * Class : Permalink
 *
 * @project Sujin
 * @since   7.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin;

if ( !defined( "ABSPATH" ) ) {
	header( "Status: 404 Not Found" );
	header( "HTTP/1.1 404 Not Found" );
	exit();
}

class RestApi {
	function __construct() {
		add_action( 'init', array( $this, 'rewrite_rules' ) );

		add_filter( "rest_prepare_post", array( $this, 'rest_post_query' ), 15, 3 );
	}

	function rest_post_query( $response, $post, $request ) {
		$response->data[ 'thumbnail' ]     = get_the_post_thumbnail( $post, 'post-thumbnail' );
		$response->data[ 'thumbnail_url' ] = wp_get_attachment_url( get_post_thumbnail_id( $post->ID ) );
		$response->data[ 'date_format' ]   = get_the_time( get_option( 'date_format' ) );

		return $response;
	}



	function rewrite_rules() {
		add_rewrite_rule( '^list/([^/]+)/?', 'index.php?post_type=$matches[1]', 'top');
		add_rewrite_rule( '^list/([^/]+)/page/?([0-9]{1,})/?', 'index.php?post_type=$matches[1]&paged=$matches[2]', 'top');
	}
}
