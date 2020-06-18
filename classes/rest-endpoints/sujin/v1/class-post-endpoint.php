<?php
/**
 * Post RESTful Endpoint
 *
 * @package sujinc.com
 * @since   8.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Sujin\V1;

use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Sujin\V1;
use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Items\Post as Post_Item;

use Sujin\Wordpress\WP_Express\Helpers\Trait_Singleton;
use Sujin\Wordpress\WP_Express\Helpers\Transient;

// phpcs:disable Generic.WhiteSpace.DisallowSpaceIndent.SpacesUsed
use WP_Post,
    WP_REST_Server,
    WP_Error,
    WP_Query;
// phpcs:enable Generic.WhiteSpace.DisallowSpaceIndent.SpacesUsed

/**
 * Post Rest Controller
 */
class Post_Endpoint extends V1 {
	use Trait_Singleton;

	/**
	 * The namespace of this controller's route.
	 *
	 * @var string
	 */
	protected $namespace = 'post';

	/**
	 * Constructor
	 *
	 * @visibility protected
	 */
	protected function __construct() {
		parent::__construct();
		add_action( 'save_post', array( $this, 'remove_transient' ), 15, 2 );
	}

	/**
	 * Remove transients
	 *
	 * @param int     $_    Post ID.
	 * @param WP_Post $post Post Object.
	 */
	public function remove_transient( int $_, WP_Post $post ): void {
		$this->remove_single_transient( $this->get_transient_key() . '-' . $post->post_name );
		Archive_Endpoint::get_instance()->remove_all_transients();
	}

	/**
	 * Registers the routes for the objects of the controller.
	 * /wp-json/sujin/v1/archive/post/slug
	 */
	public function register_routes() {
		register_rest_route(
			$this->rest_base,
			'/' . $this->namespace . '/(?P<slug>[^/]+)',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_item' ),
					'permission_callback' => array( $this, 'get_item_permissions_check' ),
					'args'                => array(
						'slug' => array(
							'description' => 'Post Slug',
							'type'        => 'string',
							'required'    => true,
						),
					),
				),
				'schema' => array( $this, 'get_item_schema' ),
			)
		);
	}

	/**
	 * Get items
	 *
	 * @param WP_REST_Request $request Request object.
	 */
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

		$post      = array_pop( $post );
		$post_item = Post_Item::get_instance( 'post-' . $post->ID, $post );
		$post_item = json_decode( wp_json_encode( $post_item ), true );

		$transient = new Transient( $post_item, self::CACHE_TTL );
		$transient->set_transient( $transient_key );
		$this->add_transient_key_to_group( $transient_key );

		return rest_ensure_response( $post_item );
	}

	/**
	 * Returns an error when post doesn't exist
	 *
	 * @return WP_Error
	 */
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
