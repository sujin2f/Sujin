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

class Taxonomy extends Base {
	use Messageable;
	use Multiton;

	const DEFAULT_POST_TYPE = 'post';

	private $post_types      = array();
	private $arguments       = array();
	private $additional_args = array();
	private $scripts         = array();
	private $styles          = array();

	public function __construct( $name ) {
		$this->name = $name;
		$this->id   = sanitize_title( $this->name );

		$labels = array(
			'name' => _x( $name, 'taxonomy general name' ),
			'singular_name' => _x( $name, 'taxonomy singular name' ),
			'search_items' =>  __( 'Search ' . $name ),
			'all_items' => __( 'All ' . $name ),
			'edit_item' => __( 'Edit ' . $name ),
			'update_item' => __( 'Update ' . $name ),
			'add_new_item' => __( 'Add New ' . $name ),
			'new_item_name' => __( 'New ' . $name . ' Name' )
		);

		$this->arguments = array(
			'labels' => $labels,
			'hierarchical' => true,
			'public' => true,
			'show_ui' => true,
			'query_var' => true,
			'rewrite' => 'rewrite'
		);
		add_action( 'init', array( $this, 'register_taxonomy' ), 25 );
	}

	public function set_post_type( $post_type ) {
		if ( $post_type instanceof Post_Type ) {
			$post_type = $post_type->id;
		}
		$this->post_types[] = $post_type;
		return $this;
	}

	public function set_script( $script ) {
		$this->scripts[] = $script;
		return $this;
	}

	public function set_style( $style ) {
		$this->styles[] = $style;
		return $this;
	}

	public function set_argument( $key, $value ) {
		$this->additional_args[ $key ] = $value;
		return $this;
	}

	public function set_show_in_rest( $bool ) {
		$arguments = array(
			'show_in_rest'          => $bool,
			'rest_base'             => $this->id,
			'rest_controller_class' => 'WP_REST_Terms_Controller',
		);
		$this->arguments = array_merge( $this->arguments, $arguments );

		return $this;
	}

	public function register_taxonomy() {
		global $wp_taxonomies;

		if ( isset( $wp_taxonomies[ $this->id ] ) ) {
			foreach ( $this->arguments as $key => $argument ) {
				$wp_taxonomies[ $this->id ]->{$key} = $argument;
			}

			if ( $this->post_types ) {
				foreach ( $this->post_types as $post_type ) {
					if ( ! in_array( $post_type, $wp_taxonomies[ $this->id ]->object_type ) ) {
						register_taxonomy( $this->id, array( $post_type ), $this->arguments );
					}
				}
			}
		} else {
			if ( ! $this->post_types ) {
				$this->post_types[] = self::DEFAULT_POST_TYPE;
			}

			$this->arguments = array_merge( $this->arguments, $this->additional_args );
			if ( $this->arguments[ 'rewrite' ] == 'rewrite' ) {
				$this->arguments[ 'rewrite' ] = array( 'slug' => $this->id );
			}

			foreach ( $this->post_types as $post_type ) {
				register_taxonomy( $this->id, array( $post_type ), $this->arguments );
			}
		}
	}
	public function print_term_meta() {
	}
	public function save_term_meta() {
	}
	public function manage_columns() {
	}
	public function manage_custiom_columns() {
	}
}
