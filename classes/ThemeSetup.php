<?php
/**
 * Class : Set up Theme
 *
 * @project Sujin
 * @since   7.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin;
use \Sujin\Enum\DefaultValues as DefaultValues;

if ( !defined( "ABSPATH" ) ) {
	header( "Status: 404 Not Found" );
	header( "HTTP/1.1 404 Not Found" );
	exit();
}

class ThemeSetup {
	static private $variable_array;

	function __construct() {
		$this->set_variables();

		new Admin();

		// Script and Style
		add_action( 'wp_enqueue_scripts', array( $this, 'load_scripts_and_styles' ) );
		// Theme Supports
		add_action( 'after_setup_theme',  array( $this, 'add_theme_support' ) );
		add_action( 'after_setup_theme',  array( $this, 'register_nav_menu' ) );
		add_action( 'after_setup_theme',  array( $this, 'set_post_thumbnail' ) );
	}

	private function set_variables() {
		$custom_logo_id = get_theme_mod( 'custom_logo' );

		self::$variable_array = array(
			'viewBase' => get_stylesheet_directory_uri() . '/views/',
			'logo'     => wp_get_attachment_image_src( $custom_logo_id, 'full' ),
			'homeUrl'  => esc_url( home_url( '/' ) ),
		);
	}

	static public function get_view_base() {
		return self::$variable_array[ 'viewBase' ];
	}

	// ! Script and Style
	public function load_scripts_and_styles() {
		$this->load_scripts();
		$this->load_styles();
	}

	private function load_scripts() {
		$angular_url       = 'https://ajax.googleapis.com/ajax/libs/angularjs/1.5.8/angular.min.js';
		$angular_route_url = 'https://ajax.googleapis.com/ajax/libs/angularjs/1.5.8/angular-route.js';
		$script_url        = get_stylesheet_directory_uri() . '/assets/script/min/script-min.js';

		wp_enqueue_script( 'angular', $angular_url, false, '1.5.8', true );
		wp_enqueue_script( 'angular-route', $angular_route_url, array( 'angular' ), '1.5.8', true );

		wp_enqueue_script( 'sujin', $script_url, array( 'angular' ), '7.0.0', true );

		$this->localize_script();
	}

	private function localize_script() {
		wp_localize_script( 'sujin', 'variables', self::$variable_array );
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
		add_theme_support( 'custom-logo' );
		add_theme_support( 'title-tag' );
		add_theme_support( 'widgets' );
		add_theme_support( 'menus' );
		add_theme_support( 'title-tag' );
		add_theme_support( 'automatic-feed-links' );
	}

	public function register_nav_menu() {
		register_nav_menu( 'primary', __( 'Main Menu' ) );

		$menu_location  = get_nav_menu_locations();
		$menu           = wp_get_nav_menu_object( $menu_location[ 'primary' ] );
		$menu_items     = wp_get_nav_menu_items( $menu->term_id, array( 'update_post_term_cache' => false ) );
		$menu_items_new = array();

		foreach( $menu_items as $item ) {
			$item               = ( array ) $item;
			$item[ 'sub_menu' ] = array();

			if ( ! $item[ 'menu_item_parent' ] )
				$menu_items_new[ $item[ 'ID' ] ] = $item;

			else if ( ! empty( $menu_items_new[ $item[ 'menu_item_parent' ] ] ) )
				$menu_items_new[ $item[ 'menu_item_parent' ] ][ 'sub_menu' ][] = $item;
		}

		self::$variable_array[ 'menu' ] = $menu_items_new;
	}

	public function set_post_thumbnail() {
		$thumbnail = get_theme_mod( 'sujin_thumbnail' );

		$thumbnail[ 'post-thumbnail-width' ]  = ( isset( $thumbnail[ 'post-thumbnail-width' ] ) )  ? $thumbnail[ 'post-thumbnail-width' ]  : DefaultValues::PostThumbnailWidth;
		$thumbnail[ 'post-thumbnail-height' ] = ( isset( $thumbnail[ 'post-thumbnail-height' ] ) ) ? $thumbnail[ 'post-thumbnail-height' ] : DefaultValues::PostThumbnailHeight;
		$thumbnail[ 'related-post-width' ]    = ( isset( $thumbnail[ 'related-post-width' ] ) )    ? $thumbnail[ 'related-post-width' ]    : DefaultValues::RelatedpostWidth;
		$thumbnail[ 'related-post-height' ]   = ( isset( $thumbnail[ 'related-post-height' ] ) )   ? $thumbnail[ 'related-post-height' ]   : DefaultValues::RelatedpostHeight;
		$thumbnail[ 'portfolio-width' ]       = ( isset( $thumbnail[ 'portfolio-width' ] ) )       ? $thumbnail[ 'portfolio-width' ]       : DefaultValues::PortfolioWidth;
		$thumbnail[ 'portfolio-height' ]      = ( isset( $thumbnail[ 'portfolio-height' ] ) )      ? $thumbnail[ 'portfolio-height' ]      : DefaultValues::PortfolioHeight;
		$thumbnail[ 'slide-width' ]           = ( isset( $thumbnail[ 'slide-width' ] ) )           ? $thumbnail[ 'slide-width' ]           : DefaultValues::SlideWidth;
		$thumbnail[ 'slide-height' ]          = ( isset( $thumbnail[ 'slide-height' ] ) )          ? $thumbnail[ 'slide-height' ]          : DefaultValues::SlideHeight;
		$thumbnail[ 'latest-work-width' ]     = ( isset( $thumbnail[ 'latest-work-width' ] ) )     ? $thumbnail[ 'latest-work-width' ]     : DefaultValues::LatestWorkWidth;
		$thumbnail[ 'latest-work-height' ]    = ( isset( $thumbnail[ 'latest-work-height' ] ) )    ? $thumbnail[ 'latest-work-height' ]    : DefaultValues::LatestWorkHeight;

		add_image_size( 'post-thumbnail', $thumbnail[ 'post-thumbnail-width' ], $thumbnail[ 'post-thumbnail-height' ], array( 'center', 'center' ) );
		add_image_size( 'related_post'  , $thumbnail[ 'related-post-width' ]  , $thumbnail[ 'related-post-height' ]  , array( 'center', 'center' ) );
		add_image_size( 'portfolio'     , $thumbnail[ 'portfolio-width' ]     , $thumbnail[ 'portfolio-height' ]     , array( 'center', 'center' ) );
		add_image_size( 'slide'         , $thumbnail[ 'slide-width' ]         , $thumbnail[ 'slide-height' ]         , array( 'center', 'center' ) );
		add_image_size( 'latest_work'   , $thumbnail[ 'latest-work-width' ]   , $thumbnail[ 'latest-work-height' ]   , array( 'center', 'center' ) );
	}
}
