<?php
/**
 * Entry Point
 *
 * @package sujinc.com
 * @since   8.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Theme;

use Sujin\Theme\RestAPI;

class Bootstrap {
	private const IMAGE_SIZE_POST       = 'post-thumbnail';
	private const POST_THUMBNAIL_WIDTH  = 370;
	private const POST_THUMBNAIL_HEIGHT = 200;

	private const IMAGE_SIZE_RELATED             = 'related-post';
	private const RELATED_POSTS_THUMBNAIL_WIDTH  = 200;
	private const RELATED_POSTS_THUMBNAIL_HEIGHT = 110;

	private const IMAGE_SIZE_RECENT             = 'recent-post';
	private const RECENT_POSTS_THUMBNAIL_WIDTH  = 88;
	private const RECENT_POSTS_THUMBNAIL_HEIGHT = 88;

	/**
	 * Constructor
	 *
	 * @visibility public
	 */
	public function __construct() {
		new RestAPI();
		add_action( 'after_setup_theme', array( $this, 'check_plugin_dependency' ) );
		add_action( 'after_setup_theme', array( $this, 'after_setup_theme' ) );
		add_action( 'pre_post_update', array( $this, 'add_version_to_post' ) );
	}

	/**
	 * Add version postmeta on post
	 *
	 * @visibility public
	 * @param int $post_id post id.
	 */
	public function add_version_to_post( int $post_id ): void {
		// TODO create a new Post class.
		// TODO deployment script.
		$version = getenv_docker( 'VERSION', '' );
		if ( ! $version ) {
			return;
		}
		update_post_meta( $post_id, 'version', $version );
	}

	/**
	 * Dependency checking
	 * The theme requires ACF
	 *
	 * @visibility public
	 */
	public function check_plugin_dependency(): void {
		if ( ! is_plugin_active( 'advanced-custom-fields/acf.php' ) ) {
			// Display an admin notice if the required plugin is not active.
			add_action( 'admin_notices', array( $this, 'missing_plugin_dependency_acf' ) );
		}
	}

	/**
	 * Dependency checking
	 * The theme requires ACF
	 *
	 * @visibility public
	 */
	public function missing_plugin_dependency_acf(): void {
		?>
		<div class="notice notice-error is-dismissible">
			<p>Your theme requires the "My Required Plugin" to function correctly. Please install and activate it.</p>
		</div>
		<?php
	}

	/**
	 * Init
	 */
	public function after_setup_theme(): void {
		$this->add_theme_support();
		$this->set_post_thumbnail();
	}

	/**
	 * Theme supports
	 * Post thumbnail, HTML5, Widgets, Feeds, Title, and Excerpt for page type.
	 *
	 * @visibility private
	 */
	private function add_theme_support(): void {
		add_theme_support( 'post-thumbnails' );
		add_theme_support( 'widgets' );
		add_theme_support( 'title-tag' );

		// Page has excerpt.
		add_post_type_support( 'page', 'excerpt' );
	}

	/**
	 * Register Thumbnail sizes
	 *
	 * @visibility private
	 */
	private function set_post_thumbnail(): void {
		add_image_size(
			self::IMAGE_SIZE_POST,
			self::POST_THUMBNAIL_WIDTH,
			self::POST_THUMBNAIL_HEIGHT,
			array( 'center', 'center' ),
		);
		add_image_size(
			self::IMAGE_SIZE_RELATED,
			self::RELATED_POSTS_THUMBNAIL_WIDTH,
			self::RELATED_POSTS_THUMBNAIL_HEIGHT,
			array( 'center', 'center' ),
		);
		add_image_size(
			self::IMAGE_SIZE_RECENT,
			self::RECENT_POSTS_THUMBNAIL_WIDTH,
			self::RECENT_POSTS_THUMBNAIL_HEIGHT,
			array( 'center', 'center' ),
		);
	}
}
