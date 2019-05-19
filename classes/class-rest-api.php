<?php
/**
 * Class : Rest API
 *
 * @project Sujin
 * @since   8.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin;

use Sujin\Wordpress\Theme\Sujin\Theme_Supports;
use Sujin\Wordpress\Theme\Sujin\Helpers\Rest_Helper;

use Sujin\Wordpress\WP_Express\Setting;
use Sujin\Wordpress\WP_Express\Fields\Settings\Input as Option_Input;

use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Sujin\V1\Flickr;
use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Sujin\V1\Posts;

use WP_REST_Server, WP_REST_Response, WP_Query;

class REST_API {
	use Helpers\Singleton;
	use Rest_Helper;

	private $flickr;

	public function __construct() {
		Setting::get_instance('Flickr Feed')
			->add( Option_Input::get_instance( 'Flicker ID' ) );

/*
		Simple_Rest_API::get_instance( 'sujin/v1' )

			->set_base( 'posts/related/(?P<post_id>\d+)' )
			->set_methods( WP_REST_Server::READABLE )
			->set_callback( array( $this, 'retrive_related_posts' ) )

			->set_base( 'menu/(?P<menu>[\\w-]+)' )
			->set_methods( WP_REST_Server::READABLE )
			->set_callback( array( $this, 'get_menu_items' ) );
*/
		new Flickr();
		new Posts();

		add_filter( 'rest_prepare_post', array( $this, 'get_single_post' ), 15, 3 );
		add_filter( 'rest_prepare_page', array( $this, 'get_single_post' ), 15, 3 );
	}

	public function get_single_post( $response, $post, $request ) {
		$post_id = $response->data[ 'id' ];
		$thumbnail_size = $request->get_param('thumbnail_size') ? $request->get_param('thumbnail_size') : Theme_Supports::IMAGE_SIZE_POST;

		$response->data['thumbnail'] = $this->get_thumbnail( $post_id, $thumbnail_size );
		$response->data['tags']      = $this->get_tags( $post_id );
		$response->data['prevnext']  = $this->get_prevnext( $post_id );
		$response->data['redirect']  = get_post_meta( $post_id, 'redirect', true );

		return $response;
	}

	public function retrive_related_posts( $request ) {
		$related_posts = $this->get_related_posts( array( $request->get_param( 'post_id' ) ) );

		foreach( $related_posts as &$post ) {
			$post->id        = $post->ID;
			$post->title     = array( 'rendered' => $post->post_title );
			$post->content   = array( 'rendered' => $post->post_content );
			$post->excerpt   = array( 'rendered' => $post->post_excerpt );
			$post->thumbnail = $this->get_thumbnail( $post->ID );
			$post->link      = get_permalink( $post->ID );
			$post->meta      = $this->get_meta( $post->ID );
		}

		return $related_posts;
	}

	private function get_related_posts( $post_ids, $posts = array(), $key = 'tag__in' ) {
		switch( $key ) {
			case 'tag__in':
				$array = array_map( function( $wp_term ) { return $wp_term->term_id; }, $this->get_tags( $post_ids[0] ) );
				break;
			case 'category__in':
				$array = array_map( function( $wp_term ) { return $wp_term->term_id; }, $this->get_categories( $post_ids[0] ) );
				break;
			default:
				$key   = '';
				$array = '';
				break;
		}

		$query_args = array(
			'posts_per_page'      => 4 - count( $posts ),
			'ignore_sticky_posts' => 1,
			'post__not_in'        => $post_ids,
			$key                  => $array,
		);

		$query = new WP_Query( $query_args );
		wp_reset_query();

		$posts    = array_merge( $posts, $query->posts );
		$new_ids  = array_map( function( $posts ) { return $posts->ID; }, $query->posts );
		$post_ids = array_merge( $post_ids, $new_ids );

		if ( count( $posts ) >= 4 )
			return array_slice( $posts, 0, 4 );

		if ( $key == '' )
			return $posts;

		if ( $key == 'category__in' )
			$key = '';

		if ( $key == 'tag__in' )
			$key = 'category__in';

		return $this->get_related_posts( $post_ids, $posts, $key );
	}

	private function get_meta( $post_id ) {
		$custom_fields = Custom_Fields::get_instance();
		$meta_values = array();

		foreach ( $custom_fields->post_metas as $post_meta ) {
			$meta_values[ $post_meta->id ] = $post_meta->get_value( $post_id );
		}

		return $meta_values;
	}

	public function get_menu_items( $request ) {
		$locations = get_nav_menu_locations();
		$slug      = $request->get_param( 'menu' );
		$id        = $locations[ $slug ] ?? null;

		if ( is_null( $id ) ) {
			return array();
		}

		$nav_menu = wp_get_nav_menu_object( $id );

		return wp_get_nav_menu_items( $nav_menu->term_id );
	}
}
