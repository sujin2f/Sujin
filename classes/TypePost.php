<?php
/**
 * Class : PostType
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

class TypePost {
	private $post_id;
	private $related_posts, $post_not_in;

	function __construct() {
		add_filter( 'rest_prepare_post', array( $this, 'rest_post' ), 15, 3 );
		add_filter( 'rest_prepare_comment', array( $this, 'rest_comment' ) );

		add_filter( 'rest_comment_query', array( $this, 'rest_comment_query' ), 15, 2 );
	}

	function rest_comment_query( $prepared_args, $request ) {
		if ( $post_name = $request->get_param( 'post_name' ) ) {
			$posts = get_posts( array(
				'name' => $post_name,
				'posts_per_page' => 1,
			));

			$prepared_args[ 'post__in' ] = $posts[0]->ID;
		}

		$prepared_args[ 'hierarchical' ] = 'threaded';
		return $prepared_args;
	}

	private $comments_number = false;
	function rest_comment( $response ) {
		$links = $response->get_links();

		if ( array_key_exists( 'children', $links ) ) {
			$args = array( 'parent__in' => $response->data[ 'id' ] );

			$query = new \WP_Comment_Query;
			$query_result = $query->query( array(
				'parent__in' => $response->data[ 'id' ],
				'status'     => 'approve',
			) );

			$WP_REST_Comments_Controller  = new \WP_REST_Comments_Controller();
			$response->data[ 'children' ] = array();

			foreach( $query_result as $comment ) {
				$rest_result = $WP_REST_Comments_Controller->prepare_item_for_response( $comment, array() );
				$response->data[ 'children' ][] = $rest_result->data;
			}
		}

		$response->data[ 'number' ] = ( $this->comments_number === false ) ? get_comments_number( $response->data[ 'post' ] ) : $this->comments_number;
		$response->data[ 'formatted_date' ] = date( get_option( 'date_format' ), strtotime( $response->data[ 'date' ] ) );

		return $response;
	}

	function rest_post( $response, $post, $request ) {
		$is_filtered    = isset( $request->get_param( 'filter' )[ 'name' ] );
		$thumbnail_size = ( isset( $request->get_param( 'filter' )[ 'thumbnail_size' ] ) ) ? $request->get_param( 'filter' )[ 'thumbnail_size' ] : 'post-thumbnail' ;

		$this->post_id = $response->data[ 'id' ];

		if ( $is_filtered ) {
			$this->get_related_posts( $response );
			$this->get_tags( $response );
			$this->get_author( $response );
			$this->get_prevnext( $response );
		}

		$this->get_formatted_date( $response );
		$response->data[ 'thumbnail' ] = $this->get_thumbnail( $response->data[ 'id' ], $thumbnail_size );

		return $response;
	}

	private function get_thumbnail( $post_id, $thumbnail_size  ) {
		$thumbnail_url = wp_get_attachment_url( get_post_thumbnail_id( $post_id ) );

		return array(
			'html' => get_the_post_thumbnail( $post_id, $thumbnail_size ),
			'url'  => $thumbnail_url ? $thumbnail_url : Constants::DefaultImageURL(),
		);
	}

	private function get_tags( &$response ) {
		$response->data[ 'tags' ] = wp_get_post_tags( $this->post_id );
	}

	private function get_formatted_date( &$response ) {
		$response->data[ 'formatted_date' ] = get_the_time( get_option( 'date_format' ) );
	}

	private function get_author( &$response ) {
		$author_id = $response->data[ 'author' ];

		$response->data[ 'author' ] = array(
			'avatar'       => get_avatar( $author_id, 65 ),
			'description'  => get_the_author_meta( 'description', $author_id ),
			'display_name' => get_the_author_meta( 'display_name', $author_id ),
		);
	}

	private function get_prevnext( &$response ) {
		if ( $response->data[ 'prev' ] = get_previous_post( true ) )
			$response->data[ 'prev' ]->link = get_permalink( $response->data[ 'prev' ]->ID );

		if ( $response->data[ 'next' ] = get_next_post( true ) )
			$response->data[ 'next' ]->link = get_permalink( $response->data[ 'next' ]->ID );
	}

	private function get_related_posts( &$response ) {
		$this->related_posts = array();
		$this->post_not_in = array( $this->post_id );

		if ( $response->data[ 'tags' ] ) {
			$related_posts       = $this->get_related_posts_reculsive( array( 'tag__in' => $response->data[ 'tags' ] ) );
			$this->related_posts = array_merge( $this->related_posts, $related_posts );
		}

		if ( $response->data[ 'categories' ] ) {
			$related_posts       = $this->get_related_posts_reculsive( array( 'category__in' => $response->data[ 'categories' ] ) );
			$this->related_posts = array_merge( $this->related_posts, $related_posts );
		}

		$related_posts = $this->get_related_posts_reculsive();
		$this->related_posts = array_merge( $this->related_posts, $related_posts );

		$response->data[ 'related' ] = $this->related_posts;
	}

	private function get_related_posts_reculsive( $arg_add = array() ) {
		if ( count( $this->related_posts ) >= 4 )
			return array();

		$args = array(
			'posts_per_page'      => 4 - count( $this->related_posts ),
			'ignore_sticky_posts' => 1,
			'post__not_in'        => $this->post_not_in,
		);

		$args = array_merge( $args, $arg_add );

		$related_query = new \WP_Query( $args );
		wp_reset_query();

		foreach( $related_query->posts as &$post ) {
			$post->link          = get_permalink( $post->ID );
			$post->thumbnail     = $this->get_thumbnail( $post->ID, 'related-post' );
			$this->post_not_in[] = $post->ID;
		}

		return $related_query->posts;
	}

	private function get_comments( $post_id, $page = 1 ) {
		$page--;

		$args = array(
			'post_id'      => $post_id,
			'offset'       => $page,
			'hierarchical' => 'threaded',
		);

		$comments = get_comments($args);

		return $comments;
	}
}
