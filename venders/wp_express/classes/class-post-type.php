<?php
/**
 * Create a new Post Type
 *
 * @project WP-Express
 * @since   1.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\WP_Express;

use Sujin\Wordpress\WP_Express\Meta_Box;

if ( ! defined( 'ABSPATH' ) ) {
	header( 'Status: 404 Not Found' );
	header( 'HTTP/1.1 404 Not Found' );
	exit();
}

class Post_Type extends Abs_Base {
	private $_arguments = array(
		'label'                 => null,
		'labels'                => null,
		'description'           => null,
		'public'                => true,
		'exclude_from_search'   => null,
		'publicly_queryable'    => null,
		'show_ui'               => null,
		'show_in_nav_menus'     => null,
		'show_in_menu'          => null,
		'show_in_admin_bar'     => null,
		'menu_position'         => null,
		'menu_icon'             => null,
		'capability_type'       => null,
		'capabilities'          => null,
		'map_meta_cap'          => null,
		'hierarchical'          => null,
		'supports'              => null,
		'register_meta_box_cb'  => null,
		'taxonomies'            => null,
		'has_archive'           => null,
		'rewrite'               => null,
		'permalink_epmask'      => null,
		'query_var'             => null,
		'can_export'            => null,
		'delete_with_user'      => null,
		'show_in_rest'          => null,
		'rest_base'             => null,
		'rest_controller_class' => null,
		'_builtin'              => null,
		'_edit_link'            => null,
	);

	private $_user_args = array();

	public function __construct( string $name, array $arguments = array() ) {
		parent::__construct( $name );

		$this->_user_args = $arguments;

		# Label
		if ( false === array_key_exists( 'label', $arguments ) ) {
			$this->_arguments['label'] = $name;
		}

		# Supports
		if ( false === array_key_exists( 'supports', $arguments ) ) {
			$this->_arguments['supports'] = array( 'title', 'editor', 'thumbnail', 'excerpt', 'comments', 'revisions' );
		}

		$this->_arguments = array_merge( $this->_arguments, $arguments );

		add_action( 'init', array( $this, '_register_post_type' ) );
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

	public function add( Meta_Box $metabox ): Post_Type {
		$metabox->post_type( $this );
		return $this;
	}

	public function _register_post_type() {
		$arguments = (array) get_post_type_object( $this->get_id() );

		if ( empty( $arguments ) ) {
			register_post_type( $this->get_id(), array_filter( $this->_arguments ) );
			return;
		}

		## Capability
		$arguments['capabilities'] = array_keys( (array) $arguments['cap'] );
		unset( $arguments['cap'] );

		## Supports
		$supports              = get_all_post_type_supports( $this->get_id() );
		$arguments['supports'] = array_keys( $supports );

		$arguments = array_merge( $arguments, $this->_user_args );
		register_post_type( $this->get_id(), $arguments );
	}
}
