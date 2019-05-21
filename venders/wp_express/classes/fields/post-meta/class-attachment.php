<?php
/**
 * Interface for Fields
 *
 * @project WP-Express
 * @since   1.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\WP_Express\Fields\Post_Meta;

use Sujin\Wordpress\WP_Express\Fields\Abs_Post_Meta_Element;
use Sujin\Wordpress\WP_Express\Fields\Elements\Trait_Attachment;

if ( ! defined( 'ABSPATH' ) ) {
	header( 'Status: 404 Not Found' );
	header( 'HTTP/1.1 404 Not Found' );
	exit();
}

class Attachment extends Abs_Post_Meta_Element {
	use Trait_Attachment;

	public function __construct( string $name, array $attrs = array() ) {
		parent::__construct( $name, $attrs );

		add_action( 'init', array( $this, '_rest_value' ) );
	}

	public function _register_meta() {
		$args = array(
			'type'         => 'string',
			'single'       => true,
			'show_in_rest' => true,
		);
		register_meta( 'post', $this->get_id(), $args );
	}

	public function _rest_value() {
		foreach ( $this->metabox->get_parents() as $parent ) {
			add_filter( 'get_' . $parent . '_metadata', array( $this, '_rest_metadata' ), 15, 3 );
		}
	}
}
