<?php
/**
 * Class : Set up Theme
 *
 * @project Sujin
 * @since   7.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin;

if ( !defined( "ABSPATH" ) ) {
	header( "Status: 404 Not Found" );
	header( "HTTP/1.1 404 Not Found" );
	exit();
}

class ThemeSetup {
	function __construct() {
		// Script and Style
		add_action( 'wp_enqueue_scripts', array( $this, 'load_scripts_and_styles' ) );
		// Theme Supports
		add_action( 'after_setup_theme',  array( $this, 'add_theme_support' ) );
		add_action( 'after_setup_theme',  array( $this, 'set_post_thumbnail' ) );

		// Default Image
		add_filter( 'post_thumbnail_html', array( $this, 'get_default_thumbnail' ), 15, 5 );
	}

	private function localize_script() {
		wp_localize_script( 'sujin', 'GLOBALS', array(
			'viewBase' => Constants::ViewURL(),
			'themeURL' => Constants::ThemeURL(),
			'homeUrl'  => Constants::HomeURL(),
		));
	}

	public function get_default_thumbnail( $html, $post_id, $post_thumbnail_id, $size, $attr ) {
		if ( $html )
			return $html;

		$id    = Constants::DefaultImageID( $size );
		$thumb = wp_get_attachment_image( $id, $size, false );

		return $thumb;
	}

	// ! Script and Style
	public function load_scripts_and_styles() {
		$this->load_scripts();
		$this->localize_script();

		$this->load_styles();
	}

	private function load_scripts() {
		$angular_url          = get_stylesheet_directory_uri() . '/assets/angular/angular.min.js';
		$angular_route_url    = get_stylesheet_directory_uri() . '/assets/angular/angular-route.js';
		$angular_sanitize_url = get_stylesheet_directory_uri() . '/assets/angular/angular-sanitize.min.js';
		$angular_social_share = get_stylesheet_directory_uri() . '/assets/angular/angular-socialshare.min.js';

		$script_url = get_stylesheet_directory_uri() . '/scripts.js';

		wp_enqueue_script( 'angular', $angular_url, false, '1.5.8', true );
		wp_enqueue_script( 'angular-route', $angular_route_url, array( 'angular' ), '1.5.8', true );
		wp_enqueue_script( 'angular-sanitize', $angular_sanitize_url, array( 'angular' ), '1.5.8', true );
		wp_enqueue_script( 'angular-social', $angular_social_share, array( 'angular' ), '1.5.8', true );

		wp_enqueue_script( 'sujin', $script_url, array( 'angular' ), '7.0.0', true );
	}

	private function load_styles() {
		$style_url = get_stylesheet_directory_uri() . '/style.css';

		wp_enqueue_style( 'dashicons' );
		wp_enqueue_style( 'sujin', get_stylesheet_directory_uri() . '/style.css' );
	}

	// ! Theme Supports
	public function add_theme_support() {
		add_theme_support( 'post-thumbnails' );
		add_theme_support( 'post-formats' );
		add_theme_support( 'html5' );
		add_theme_support( 'widgets' );
		add_theme_support( 'automatic-feed-links' );
	}

	public function set_post_thumbnail() {
		add_image_size( 'post-thumbnail', Constants::PostThumbnailWidth, Constants::PostThumbnailHeight, array( 'center', 'center' ) );
		add_image_size( 'related-post'  , Constants::RelatedpostWidth  , Constants::RelatedpostHeight  , array( 'center', 'center' ) );
		add_image_size( 'recent-post'  , Constants::RecentPostWidth  , Constants::RecentPostHeight  , array( 'center', 'center' ) );

/*
		add_image_size( 'portfolio'     , Constants::PortfolioWidth    , Constants::PortfolioHeight    , array( 'center', 'center' ) );
		add_image_size( 'slide'         , Constants::SlideWidth        , Constants::SlideHeight        , array( 'center', 'center' ) );
		add_image_size( 'latest_work'   , Constants::LatestWorkWidth   , Constants::LatestWorkHeight   , array( 'center', 'center' ) );
*/
	}
}
