<?php
/**
 * Taxonomy Class
 *
 * @project WP-Express
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\WP_Express;

use Sujin\Wordpress\WP_Express\Fields\Abs_Term_Meta_Element;

if ( ! defined( 'ABSPATH' ) ) {
	header( 'Status: 404 Not Found' );
	header( 'HTTP/1.1 404 Not Found' );
	exit();
}

class Taxonomy extends Abs_Base {
	const DEFAULT_POST_TYPE = 'post';

	private $_post_types = array();
	private $_arguments  = array(
		'label'                 => null,
		'labels'                => null,
		'public'                => true,
		'publicly_queryable'    => null,
		'show_ui'               => null,
		'show_in_menu'          => null,
		'show_in_nav_menus'     => null,
		'show_in_rest'          => null,
		'rest_base'             => null,
		'rest_controller_class' => null,
		'show_tagcloud'         => null,
		'show_in_quick_edit'    => null,
		'meta_box_cb'           => null,
		'show_admin_column'     => null,
		'description'           => null,
		'hierarchical'          => null,
		'update_count_callback' => null,
		'query_var'             => null,
		'rewrite'               => null,
		'capabilities'          => null,
		'sort'                  => null,
		'_builtin'              => null,
	);
	private $_user_args  = array();

	public function __construct( string $name, array $arguments = array() ) {
		parent::__construct( $name );

		if ( 'tag' === strtolower( $name ) ) {
			$this->_name = 'Tags';
			$this->_id   = 'post_tag';
		}

		$this->_user_args = $arguments;

		# Label
		if ( false === array_key_exists( 'label', $arguments ) ) {
			$this->_arguments['label'] = $name;
		}

		$this->_arguments = array_merge( $this->_arguments, $arguments );

		add_action( 'init', array( $this, '_register_taxonomy' ), 25 );
	}

	public function __call( string $name, array $arguments ) {
		if ( array_key_exists( strtolower( $name ), $this->_arguments ) ) {
			if ( empty( $arguments ) ) {
				return $this->_arguments[ $name ];
			}

			$this->_arguments[ $name ] = $arguments[0];
			$this->_user_args[ $name ] = $arguments[0];
		}

		return $this;
	}

	public function _register_taxonomy() {
		global $wp_taxonomies;

		if ( ! array_key_exists( $this->get_id(), $wp_taxonomies ) ) {
			register_taxonomy( $this->get_id(), $this->_get_post_types_strings(), array_filter( $this->_arguments ) );
			return;
		}

		$arguments = (array) $wp_taxonomies[ $this->get_id() ];

		$object_type = array_unique( array_merge( $arguments['object_type'], $this->_get_post_types_strings() ) );
		## Capability
		$arguments['capabilities'] = array_keys( (array) $arguments['cap'] );

		unset( $arguments['name'] );
		unset( $arguments['object_type'] );
		unset( $arguments['cap'] );

		register_taxonomy( $this->get_id(), $object_type, array_merge( $arguments, $this->_user_args ) );
	}

	public function add( Abs_Term_Meta_Element $field ): Taxonomy {
		$field->attach_to( $this );
		return $this;
	}

	public function attach_to( $post_type ): Taxonomy {
		$this->_post_types[] = $post_type;
		return $this;
	}

	// TODO
	public function _manage_columns() {
	}

	// TODO
	public function _manage_custiom_columns() {
	}

	private function _get_post_types_strings(): array {
		$post_types = array();

		foreach ( $this->_post_types as $post_type ) {
			$post_types[] = ( $post_type instanceof Post_Type ) ? $post_type->get_id() : $post_type;
		}

		if ( empty( $post_types ) ) {
			$post_types = array( self::DEFAULT_POST_TYPE );
		}

		return $post_types;
	}
}
