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

class Meta_Box extends Base {
	use Messageable;
	use Multiton;

	const DEFAULT_POST_TYPE = 'post';

	public $post_types = array();

	private $scripts = array();
	private $styles  = array();

	public function __construct( $name ) {
		$this->name = $name;
		$this->id   = sanitize_title( $this->name );

		add_action( 'admin_head', array( $this, 'register_meta_box' ) );
	}

	public function set_post_type( $post_type ) {
		if ( $post_type instanceof Post_Type ) {
			$post_type = $post_type->id;
		}

		add_action( 'save_post_' . $post_type, array( $this, 'save_post'), 10, 2 );
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

	public function register_meta_box() {
		if ( ! $this->post_types ) {
			$this->post_types[] = self::DEFAULT_POST_TYPE;
		}

		add_meta_box( $this->id, $this->name, array( $this, 'show_meta_box' ), $this->post_types );
	}

	public function show_meta_box() {
		echo '<div class="meta-box-wp-express">';
		do_action( 'wp-express-show-meta-box-' . $this->id );
		echo '</div>';
	}

	public function save_post( $post_id, $post ) {
		if( !$_POST )
			return false;

		if ( ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) || ( defined( 'DOING_AJAX' ) && DOING_AJAX ) || isset( $_REQUEST[ 'bulk_edit' ] ) )
			return;

		do_action( 'wp-express-save-post-meta-' . $this->id, $post_id );
	}
}
