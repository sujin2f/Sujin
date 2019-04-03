<?php
/**
 * Admin Class
 *
 * @project WP-Express
 * @since   1.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\WP_Express\Meta;

use Sujin\Wordpress\WP_Express\Helpers\Meta_Base;
use Sujin\Wordpress\WP_Express\Base;

if ( !defined( "ABSPATH" ) ) {
	header( "Status: 404 Not Found" );
	header( "HTTP/1.1 404 Not Found" );
	exit();
}

class Post_Meta extends Base {
	use Meta_Base;

	private $thumbnail_size = 'thumbnail';

	public function __construct( $name ) {
		parent::__construct();
		$this->constructor( $name );
		add_action( 'init', array( $this, 'register_meta' ) );
	}

	public function set_metabox( $metabox ) {
		add_action( "wp-express-show-meta-box-{$metabox->id}" , array( $this, 'print_meta' ) );
		add_action( "wp-express-save-post-meta-{$metabox->id}", array( $this, 'save_meta' ) );

		foreach ( $metabox->post_types as $post_type ) {
			add_filter( "get_{$post_type}_metadata", array( $this, 'get_rest_metadata' ), 15, 4 );
		}
		return $this;
	}

	public function print_meta() {
		$value = $_GET && isset( $_GET['post'] )
			? get_post_meta( $_GET['post'], $this->id, true )
			: null;
		$this->print_field( $value );
	}

	public function save_meta( $post_id ) {
		$value = isset( $_POST[ $this->id ] ) ? $_POST[ $this->id ]  : false;
		update_post_meta( $post_id, $this->id, $value );
	}

	public function get_value( $post_id ) {
		$value = get_post_meta( $post_id, $this->id, true );

		if ( $this->type === 'checkbox' ) {
			$value = boolval( $value );
		}

		return $value;
	}

	public function register_meta() {
		register_meta( 'post', $this->id, array(
			'show_in_rest' => $this->show_in_rest,
			'single' => true,
			'type' => $this->type === 'checkbox' ? 'boolean' : 'string',
		) );
	}

	public function get_rest_metadata( $value, $object_id, $meta_key, $single ) {
		if ( ! defined( 'REST_REQUEST' ) || ! REST_REQUEST )
			return $value;

		if ( $meta_key != $this->id )
			return $value;

		if ( ! in_array( $this->type, array( 'file' ) ) )
			return $value;

		$meta_cache = wp_cache_get($object_id, 'post_meta');

		if ( !$meta_cache ) {
			$meta_cache = update_meta_cache( 'post', array( $object_id ) );
			$meta_cache = $meta_cache[$object_id];
		}

		if ( ! isset( $meta_cache[ $this->id ] ) )
			return $value;

		if ( $this->type === 'file' )
			$value = wp_get_attachment_image_src( (int) $meta_cache[ $this->id ][0], $this->thumbnail_size );

		return $value;
	}
}
