<?php
/**
 * Class : Theme_Supports API
 *
 * @project Sujin
 * @since   8.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin;

class Theme_Supports {
	use Helpers\Singleton;

	const POST_THUMBNAIL_WIDTH  = 370;
	const POST_THUMBNAIL_HEIGHT = 200;

	const RELATED_POSTS_THUMBNAIL_WIDTH  = 200;
	const RELATED_POSTS_THUMBNAIL_HEIGHT = 110;

	const RECENT_POSTS_THUMBNAIL_WIDTH  = 80;
	const RECENT_POSTS_THUMBNAIL_HEIGHT = 80;

	const IMAGE_SIZE_POST    = 'post-thumbnail';
	const IMAGE_SIZE_RELATED = 'related-post';
	const IMAGE_SIZE_RECENT  = 'recent-post';

	function __construct() {
		add_action( 'after_setup_theme', array( $this, 'add_theme_support' ) );
		add_action( 'after_setup_theme', array( $this, 'set_post_thumbnail' ) );
		add_action( 'init', array( $this, 'register_nav_menu' ) );
	}

	public function register_nav_menu() {
		register_nav_menu( 'main-menu', 'Main Menu' );
		register_nav_menu( 'social-media', 'Social Media' );
	}

	public function add_theme_support() {
		add_theme_support( 'post-thumbnails' );
		add_theme_support( 'html5' );
		add_theme_support( 'widgets' );
		add_theme_support( 'automatic-feed-links' );
		add_theme_support( 'title-tag' );

		add_post_type_support( 'page', 'excerpt' );
	}

	public function set_post_thumbnail() {
		add_image_size( 'post-thumbnail', self::POST_THUMBNAIL_WIDTH, self::POST_THUMBNAIL_HEIGHT, array( 'center', 'center' ) );
		add_image_size( 'related-post', self::RELATED_POSTS_THUMBNAIL_WIDTH, self::RELATED_POSTS_THUMBNAIL_WIDTH, array( 'center', 'center' ) );
		add_image_size( 'recent-post', self::RECENT_POSTS_THUMBNAIL_WIDTH, self::RECENT_POSTS_THUMBNAIL_WIDTH, array( 'center', 'center' ) );
	}
}
