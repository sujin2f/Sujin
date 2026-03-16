<?php
/**
 * Post management
 *
 * @package sujinc.com
 * @since   12.0.0
 * @author  Sujin 수진 Choi
 */

namespace Sujin\Theme;

use Sujin\Theme\Redis;

/**
 * Post controller
 */
class Post {
	/**
	 * Constructor
	 */
	public function __construct() {
		add_action( 'save_post', array( $this, 'save_post' ), 15, 2 );
		add_action( 'rest_api_init', array( $this, 'register_rest_fields' ) );
		add_filter( 'rest_post_collection_params', array( $this, 'rest_post_collection_params' ) );
		add_filter( 'rest_post_query', array( $this, 'rest_post_query' ), 15, 2 );
	}

	/**
	 * When save post,
	 * 1. Store parsed content to meta
	 * 2. Version
	 * 3. Request GQL to update MongoDB
	 *
	 * @param int      $post_id Post ID.
	 * @param \WP_Post $post    Post instance.
	 */
	public function save_post( int $post_id, \WP_Post $post ): void {
		if ( 'post' !== $post->post_type && 'page' !== $post->post_type ) {
			return;
		}

		if ( 'publish' === $post->post_status ) {
			$this->save_content( $post_id, $post->post_content );
			$this->update_version( $post_id, );
			$this->redis_refresh_post( $post->post_name, $post->post_type );
		} else {
			delete_post_meta( $post_id, 'the_content' );
			$this->redis_refresh_post( $post->post_name, $post->post_type );
		}
	}

	/**
	 * Save parsed HTML post to metadata for published post.
	 *
	 * @param int    $post_id      Post ID.
	 * @param string $post_content Post content.
	 */
	private function save_content( int $post_id, string $post_content ): void {
		remove_filter( 'the_content', 'wpautop' );

		$content = apply_filters( 'the_content', $post_content );
		update_post_meta( $post_id, 'the_content', $content );
	}

	/**
	 * Update content version for GQL to process content differently
	 *
	 * @param int $post_id Post ID.
	 */
	private function update_version( int $post_id ): void {
		$version = getenv_docker( 'VERSION', '' );
		if ( ! $version ) {
			return;
		}
		update_post_meta( $post_id, 'version', $version );
	}

	/**
	 * Send Redis a message to update change
	 *
	 * @param string $slug      Post slug.
	 * @param string $post_type post or page.
	 */
	private function redis_refresh_post( string $slug, string $post_type ): void {
		$type = match ( $post_type ) {
			'post' => 'post',
			'page' => 'page',
			default => '',
		};
		if ( ! $type ) {
			return;
		}

		$redis = new Redis();
		$redis->publish(
			'wordpress', // phpcs:ignore WordPress.WP.CapitalPDangit.MisspelledInText
			array(
				'type'   => $type,
				'action' => 'update',
				'slug'   => $slug,
			)
		);
		$redis->quit();
	}

	/**
	 * Register images & archives fields
	 */
	public function register_rest_fields(): void {
		register_rest_field(
			'post',
			'images',
			array(
				'get_callback' => function ( array $post ) {
					$images = array(
						'list'       => get_attachment_by_id( (int) $post['acf']['list'] ),
						'icon'       => get_attachment_by_id( (int) $post['acf']['icon'] ),
						'title'      => get_attachment_by_id( (int) $post['acf']['title'] ),
						'background' => get_attachment_by_id( (int) $post['acf']['background'] ),
						'thumbnail'  => get_attachment_by_id( (int) get_post_thumbnail_id( $post['id'] ) ),
					); // same with T_ImageBlock and POST_IMAGE_LOCATION: list, icon, title, background, thumbnail.
					return $images;
				},
				'schema'       => array(
					'description' => __( 'Post Images.' ),
					'type'        => 'array',
				),
			)
		);

		register_rest_field(
			'post',
			'archives',
			array(
				'get_callback' => function ( array $post ) {
					$categories = array_map(
						function ( $a ) {
							$category = get_term( $a, 'category' );
							return array(
								'slug'    => $category->slug,
								'title'   => $category->name,
								'excerpt' => $category->description,
								'total'   => $category->count,
								'type'    => 'category',
							); // same with T_Archive.
						},
						$post['categories']
					);

					$tags = array_map(
						function ( $a ) {
							$category = get_term( $a, 'post_tag' );
							return array(
								'slug'    => $category->slug,
								'title'   => $category->name,
								'excerpt' => $category->description,
								'total'   => $category->count,
								'type'    => 'tag',
							); // same with T_Archive.
						},
						$post['tags']
					);

					return array_merge( $categories, $tags );
				},
				'schema'       => array(
					'description' => __( 'Post Images.' ),
					'type'        => 'array',
				),
			)
		);
	}

	/**
	 * Add category_slug to REST post query params
	 *
	 * @param array $query_params Collection schema.
	 * @return array Updated schema.
	 */
	public function rest_post_collection_params( array $query_params ): array {
			$query_params['category_slug'] = array(
				'description' => 'Get posts by Category slugs.',
				'type'        => 'string',
			);
			return $query_params;
	}

	/**
	 * Query category_slug from REST post query params
	 *
	 * @param array            $args WP_Query args.
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return array Updated args.
	 */
	public function rest_post_query( array $args, \WP_REST_Request $request ): array {
		if ( $request['category_slug'] ) {
			$args['category_name'] = $request['category_slug'];
		}
		return $args;
	}
}
