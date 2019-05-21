<?php
/**
 * Interface for Fields
 *
 * @project WP-Express
 * @since   1.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 * @todo    Register Meta
 */

namespace Sujin\Wordpress\WP_Express\Fields;

use Sujin\Wordpress\WP_Express\Meta_Box;

if ( ! defined( 'ABSPATH' ) ) {
	header( 'Status: 404 Not Found' );
	header( 'HTTP/1.1 404 Not Found' );
	exit();
}

abstract class Abs_Post_Meta_Element extends Abs_Base_Element {
	protected $metabox;

	public function __construct( string $name, array $attrs = array() ) {
		parent::__construct( $name, $attrs );
		add_action( 'init', array( $this, '_register_meta' ) );
	}
	public function get( ?int $post_id = null ) {
		if ( empty( $this->_attributes['value'] ) ) {
			$this->_refresh_attributes( $post_id );
		}
		return $this->_attributes['value'];
	}

	public function _update( int $post_id, $value ) {
		update_post_meta( $post_id, $this->get_id(), $value );
	}

	public function attach_to( Meta_Box $metabox ): Abs_Post_Meta_Element {
		$this->metabox = $metabox;
		return $this;
	}

	public function _register_meta() {
		$args = array(
			'type'         => 'string',
			'single'       => true,
			'show_in_rest' => true,
		);
		register_meta( 'post', $this->get_id(), $args );
	}

	protected function _refresh_attributes( ?int $post_id = null ) {
		global $post;
		if ( empty( $post_id ) ) {
			if ( ! $post ) {
				return;
			}
			$post_id = $post->ID;
		}

		$this->_attributes['value'] = get_post_meta( $post_id, $this->get_id(), true );
	}

	// TODO
	protected function _render_wrapper_open() {
		$class = explode( '\\', get_called_class() );
		$class = strtolower( array_pop( $class ) );

		?>
		<section
			id="<?php echo esc_attr( self::PREFIX ); ?>--post-meta-wrap--<?php echo esc_attr( $class ); ?>--<?php echo esc_attr( $this->get_id() ); ?>"
			class="<?php echo esc_attr( self::PREFIX ); ?> post-meta-wrap <?php echo esc_attr( $class ); ?>"
		>
			<label for="<?php echo esc_attr( self::PREFIX ); ?>__field__<?php echo esc_attr( $class ); ?>__<?php echo esc_attr( $this->get_id() ); ?>">
				<?php echo esc_html( $this->get_name() ); ?>
			</label>
		<?php
	}

	protected function _render_wrapper_close() {
		echo '</section>';
	}
}
