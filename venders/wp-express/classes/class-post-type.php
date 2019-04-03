<?php
/**
 * Admin Class
 *
 * @project WP-Express
 * @since   1.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\WP_Express;

use Sujin\Wordpress\WP_Express\Helpers\Messageable;
use Sujin\Wordpress\WP_Express\Helpers\Multiton;

if ( !defined( "ABSPATH" ) ) {
	header( "Status: 404 Not Found" );
	header( "HTTP/1.1 404 Not Found" );
	exit();
}

class Post_Type extends Base {
	use Messageable;
	use Multiton;

	private $arguments;
	private $additional_args = array();

	public function __construct( $name ) {
		$this->name = $name;
		$this->id   = sanitize_title( $this->name );

		$labels = array(
			'name' => _x( $this->name, 'post type general name' ),
			'singular_name' => _x( $this->name, 'post type singular name' ),
			'add_new' => _x( 'Add New', $this->name ),
			'add_new_item' => __( 'Add New ' . $this->name ),
			'edit_item' => __( 'Edit ' . $this->name ),
			'new_item' => __( 'New ' . $this->name ),
			'view_item' => __( 'View ' . $this->name ),
			'search_items' => __( 'Search ' . $this->name ),
			'not_found' =>  __( 'No ' . $this->name . ' found' ),
			'not_found_in_trash' => __( 'No ' . $this->name . ' found in Trash' ),
			'parent_item_colon' => '',
			'all_items' => __( 'All ' . $this->name ),
			'menu_name' => $name
		);

		$this->arguments = array(
			'labels' => $labels,
			'supports' => array( 'title', 'editor', 'thumbnail', 'excerpt', 'comments', 'revisions' ),
			'public' => true,
			'rewrite' => 'rewrite'
		);

		add_action( 'init', array( $this, 'register_post_type' ), 25 );
	}

	public function set_show_in_rest( $bool ) {
		$arguments = array(
			'show_in_rest'          => $bool,
			'rest_base'             => $this->id,
			'rest_controller_class' => 'WP_REST_Posts_Controller',
		);
		$this->arguments = array_merge( $this->arguments, $arguments );

		return $this;
	}

	public function register_post_type() {
		global $wp_post_types;

		if( isset( $wp_post_types[ $this->id ] ) ) {
			foreach ( $this->arguments as $key => $argument ) {
				$wp_post_types[ $this->id ]->{$key} = $argument;
			}
		} else {
			// New Post Type
			if ( !empty( $this->additional_args['supports'] ) )
				$this->additional_args['supports'] = array_merge( $this->arguments['supports'], $this->additional_args['supports'] );

			$this->arguments = array_merge( $this->arguments, $this->additional_args );

			if ( $this->arguments[ 'rewrite' ] == 'rewrite' )
				$this->arguments[ 'rewrite' ] = array( 'slug' => $this->id );

			register_post_type( $this->id, $this->arguments );
		}
/*
		if ( post_type_exists( $this->id ) ) {
			// Modify an Exist Post Type
			$arguments = (array) get_post_type_object( $this->id );

			if ( !empty( $this->additional_args['supports'] ) )
				$this->additional_args['supports'] = array_merge( $arguments, $this->additional_args['supports'] );

			$arguments = array_merge( $arguments, $this->additional_args );
			register_post_type( $this->id, $arguments );

		} else {
		}
*/
	}
}
