<?php
/**
 * Background RESTful Endpoint
 *
 * @package sujinc.com
 * @since   8.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Sujin\V1;

use Sujin\Wordpress\Theme\Sujin\{
	Environment,
	Rest_Endpoints\Sujin\V1,
	Rest_Endpoints\Items\Background,
};

use Sujin\Wordpress\WP_Express\{
	Helpers\Trait_Singleton,
	Helpers\Transient,
};

// phpcs:disable Generic.WhiteSpace.DisallowSpaceIndent.SpacesUsed
use WP_REST_Server,
    WP_Error;
// phpcs:enable Generic.WhiteSpace.DisallowSpaceIndent.SpacesUsed

/**
 * Background RESTful Endpoint
 */
class Background_Endpoint extends V1 {
	use Trait_Singleton;

	/**
	 * The namespace of this controller's route.
	 *
	 * @var string
	 */
	protected $namespace = 'background';

	/**
	 * Constructor
	 *
	 * @visibility protected
	 */
	protected function __construct() {
		parent::__construct();

		add_action( 'attachment_updated', array( $this, 'remove_all_transients' ) );
		add_action( 'add_attachment', array( $this, 'remove_all_transients' ) );
	}

	/**
	 * Registers the routes for the objects of the controller.
	 * /wp-json/sujin/v1/archive/background/random
	 */
	public function register_routes() {
		register_rest_route(
			$this->rest_base,
			'/' . $this->namespace . '/random',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_items' ),
					'permission_callback' => array( $this, 'get_items_permissions_check' ),
				),
				'schema' => array( $this, 'get_item_schema' ),
			)
		);
	}

	/**
	 * Get items
	 *
	 * @param WP_REST_Request $_ Request object. Never used.
	 */
	public function get_items( $_ ) {
		// Get transient.
		$transient = Transient::get_transient( $this->get_transient_key() );

		if ( $transient && ! $transient->is_expired() && ! Environment::get_instance()->env !== 'development' ) {
			return rest_ensure_response( $transient->items );
		}

		$term  = get_term_by( 'slug', 'background', 'category' );
		$posts = get_posts(
			array(
				'posts_per_page' => 10,
				'category'       => $term->term_id,
				'orderby'        => 'rand',
				'post_type'      => 'attachment',
			)
		);

		if ( empty( $posts ) ) {
			return rest_ensure_response( $this->error_no_content() );
		}

		foreach ( array_keys( $posts ) as $arr_key ) {
			$posts[ $arr_key ] = Background::get_instance( 'background', $posts[ $arr_key ] );
		}

		$posts = json_decode( wp_json_encode( $posts ), true );
		$posts = array_values( $posts );

		$transient = new Transient( $posts, self::CACHE_TTL );
		$transient->set_transient( $this->get_transient_key() );
		$this->add_transient_key_to_group( $this->get_transient_key() );

		return rest_ensure_response( $posts );
	}

	/**
	 * Returns an error when background doesn't exist
	 *
	 * @return WP_Error
	 */
	private function error_no_content(): WP_Error {
		return new WP_Error(
			'NO_CONTENT',
			'No attachment matched.',
			array(
				'status' => self::STATUS_CODE_NO_CONTENT,
			)
		);
	}
}
