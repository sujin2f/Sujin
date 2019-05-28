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
use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Sujin\V1\Menu;
use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Sujin\V1\Media;

use WP_REST_Server, WP_REST_Response, WP_Query;

class REST_API {
	use Helpers\Singleton;
	use Rest_Helper;

	private $flickr;

	public function __construct() {
		Setting::get_instance( 'Flickr Feed' )
			->add( Option_Input::get_instance( 'Flicker ID' ) );

		new Flickr();
		new Posts();
		new Menu();
		new Media();

		add_filter( 'rest_prepare_post', array( $this, 'get_single_post' ), 15, 3 );
		add_filter( 'rest_prepare_page', array( $this, 'get_single_post' ), 15, 3 );
	}

	public function get_single_post( $response, $post, $request ) {
		$post_id        = $response->data['id'];
		$thumbnail_size = $request->get_param( 'thumbnail_size' ) ? $request->get_param( 'thumbnail_size' ) : Theme_Supports::IMAGE_SIZE_POST;

		$response->data['thumbnail']   = $this->get_thumbnail( $post_id, $thumbnail_size );
		$response->data['tags']        = $this->get_tags( $post_id );
		$response->data['prevnext']    = $this->get_prevnext( $post_id );
		$response->data['related']     = $this->get_related( $post_id );
		$response->data['redirect']    = get_post_meta( $post_id, 'redirect', true );
		$response->data['seriesPosts'] = array();

		foreach ( $response->data['series'] as $series_id ) {
			$posts = new WP_Query(
				array(
					'tax_query' => array(
						array(
							'taxonomy' => 'series',
							'field'    => 'id',
							'terms'    => $series_id,
						),
					),
				)
			);

			foreach ( $posts->posts as $post ) {
				$response->data['seriesPosts'][] = array(
					'id'    => $post->ID,
					'link'  => get_permalink( $post ),
					'title' => $post->post_title,
				);
			}
		}

		return $response;
	}
}
