<?php
namespace Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Sujin\V1;

use Sujin\Wordpress\Theme\Sujin\Transient;
use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Abs_Rest_Base;
use Sujin\Wordpress\Theme\Sujin\Helpers\Singleton;
use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Items\Post as PostItem;

use Sujin\Wordpress\WP_Express\Fields\Term_Meta\Attachment as Term_Meta_Attachment;
use Sujin\Wordpress\WP_Express\Fields\Post_Meta\Attachment as Post_Meta_Attachment;

// phpcs:disable Generic.WhiteSpace.DisallowSpaceIndent.SpacesUsed
use WP_Post,
    WP_REST_Server,
    WP_Error,
    WP_Query;
// phpcs:enable Generic.WhiteSpace.DisallowSpaceIndent.SpacesUsed

if ( ! defined( 'ABSPATH' ) ) {
	header( 'Status: 404 Not Found' );
	header( 'HTTP/1.1 404 Not Found' );
	exit();
}

class Post extends Abs_Rest_Base {
	use Singleton;

	protected const CACHE_TTL     = 12 * HOUR_IN_SECONDS;
	protected const RESOURCE_NAME = 'post';

	public function __construct() {
		parent::__construct();
		add_action( 'save_post', array( $this, 'delete_transient' ), 15, 2 );
	}

	public function delete_transient( int $_, WP_Post $post ): void {
		$transient_key = $this->get_transient_key() . '-' . $post->post_name;
		delete_transient( $transient_key );
		Archive::get_instance()->delete_transient();
	}

	public function create_rest_routes() {
		register_rest_route(
			self::NAMESPACE,
			'/' . self::RESOURCE_NAME . '/(?P<slug>[^/]+)',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_item' ),
					'permission_callback' => array( $this, 'permissions_check' ),
					'args'                => array(
						'slug' => array(
							'description'       => 'Post Slug',
							'type'              => 'string',
							'required'          => true,
						),
					),
				),
				'schema' => array( $this, 'get_item_schema' ),
			)
		);
	}

	public function get_item( $request ) {
		$slug = $request->get_param( 'slug' );

		if ( ! $slug ) {
			return null;
		}

		$transient_key = $this->get_transient_key() . '-' . $slug;
		$transient     = Transient::get_transient( $transient_key );

		if ( $transient && ! $transient->is_expired() && ! SUJIN_DEV_MODE ) {
			return rest_ensure_response( $transient->items );
		}

		$query_args = array(
			'name'           => $slug,
			'post_type'      => array( 'post', 'page' ),
			'post_status'    => 'publish',
			'posts_per_page' => 1,
		);
		$post       = new WP_Query( $query_args );
		$post       = $post->posts;

		if ( empty( $post ) ) {
			return $this->error_not_found_post();
		}

		$post = array_pop( $post );
		$post = new PostItem( $post );
		$post = json_decode( wp_json_encode( $post ), true );

		$transient = new Transient( $post, self::CACHE_TTL );
		set_transient( $transient_key, wp_json_encode( $transient ) );

		return rest_ensure_response( $post );
	}

	private function error_not_found_post(): WP_Error {
		return new WP_Error(
			'NOT_FOUND',
			'The article does not exist.',
			array(
				'status' => self::STATUS_CODE_NOT_FOUND,
			)
		);
	}
}
