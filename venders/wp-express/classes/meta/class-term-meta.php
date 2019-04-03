<?php
/**
 * Admin Class
 *
 * @project WP-Express
 * @since   1.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\WP_Express\Meta;

use Sujin\Wordpress\WP_Express\Base;
use Sujin\Wordpress\WP_Express\Taxonomy;
use Sujin\Wordpress\WP_Express\Helpers\Meta_Base;
use Sujin\Wordpress\WP_Express\Helpers\Messageable;

if ( !defined( "ABSPATH" ) ) {
	header( "Status: 404 Not Found" );
	header( "HTTP/1.1 404 Not Found" );
	exit();
}

class Term_Meta extends Base {
	use Meta_Base;
	use Messageable;

	private $taxonomies = array();

	public function __construct( $name ) {
		parent::__construct();
		$this->constructor( $name );
		add_action( 'init', array( $this, 'register_meta' ) );
	}

	private function is_termmeta_enabled() {
		global $wp_version;
		return ( version_compare( $wp_version, '4.4', '<' ) ) ? false : true;
	}

	public function set_taxonomy( $taxonomy ) {
		if ( !$this->is_termmeta_enabled() ) {
			$this->show_message( 'In order to use term meta function, you must update your Wordpress to at least up to 4.4 version.', 'error' );
			return;
		}

		if ( $taxonomy instanceof Taxonomy ) {
			$taxonomy = $taxonomy->id;
		}

		add_action( "{$taxonomy}_edit_form", array( $this, 'print_meta' ), 10 );
		add_action( "edited_{$taxonomy}", array( $this, 'save_meta' ), 10 );
		$this->taxonomies[] = $taxonomy;
		return $this;
	}

	public function get_value( $tax_slug, $term_slug ) {
		if ( ! in_array( $tax_slug, $this->taxonomies ) ) {
			$this->show_message( 'Second parameter (taxonomy) is not matched you assigned.', 'error' );
			return;
		}

		$term = get_term_by( 'slug', $term_slug, $tax_slug );
		$value = get_term_meta( $term->term_id, $this->id, true );

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

	public function print_meta( $term ) {
		$value = get_term_meta( $term->term_id, $this->id, true );
		$this->print_field( $value );
	}

	public function save_meta( $term_id ) {
		$value = isset( $_POST[ $this->id ] ) ? $_POST[ $this->id ]  : false;
		update_term_meta( $term_id, $this->id, $value );
	}
}
