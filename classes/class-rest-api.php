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
