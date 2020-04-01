<?php
/**
 * Class : Theme_Supports API
 *
 * @project Sujin
 * @since   8.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin;

use Sujin\Wordpress\WP_Express\Helpers\Trait_Singleton;

class Theme_Supports {
	use Trait_Singleton;

	private const POST_THUMBNAIL_WIDTH  = 370;
	private const POST_THUMBNAIL_HEIGHT = 200;

	private const RELATED_POSTS_THUMBNAIL_WIDTH  = 200;
	private const RELATED_POSTS_THUMBNAIL_HEIGHT = 110;

	private const RECENT_POSTS_THUMBNAIL_WIDTH  = 88;
	private const RECENT_POSTS_THUMBNAIL_HEIGHT = 88;

	private const IMAGE_SIZE_POST    = 'post-thumbnail';
	private const IMAGE_SIZE_RELATED = 'related-post';
	private const IMAGE_SIZE_RECENT  = 'recent-post';

	function __construct() {
		add_action( 'after_setup_theme', array( $this, 'after_setup_theme' ) );
		add_action( 'init', array( $this, 'register_nav_menu' ) );
	}

	public function register_nav_menu(): void {
		register_nav_menu( 'main-menu', 'Main Menu' );
		register_nav_menu( 'social-media', 'Social Media' );
	}

	public function after_setup_theme(): void {
		$this->add_theme_support();
		$this->set_post_thumbnail();
	}

	private function add_theme_support(): void {
		add_theme_support( 'post-thumbnails' );
		add_theme_support( 'html5' );
		add_theme_support( 'widgets' );
		add_theme_support( 'automatic-feed-links' );
		add_theme_support( 'title-tag' );

		add_post_type_support( 'page', 'excerpt' );
	}

	private function set_post_thumbnail(): void {
		add_image_size(
			'post-thumbnail',
			self::POST_THUMBNAIL_WIDTH,
			self::POST_THUMBNAIL_HEIGHT,
			array( 'center', 'center' ),
		);
		add_image_size(
			'related-post',
			self::RELATED_POSTS_THUMBNAIL_WIDTH,
			self::RELATED_POSTS_THUMBNAIL_HEIGHT,
			array( 'center', 'center' ),
		);
		add_image_size(
			'recent-post',
			self::RECENT_POSTS_THUMBNAIL_WIDTH,
			self::RECENT_POSTS_THUMBNAIL_WIDTH,
			array( 'center', 'center' ),
		);
	}
}
