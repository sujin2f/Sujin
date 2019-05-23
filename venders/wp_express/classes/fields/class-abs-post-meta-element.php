<?php
/**
 * Interface for Fields
 *
 * @project WP-Express
 * @since   1.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\WP_Express\Fields;

use Sujin\Wordpress\WP_Express\Meta_Box;

if ( ! defined( 'ABSPATH' ) ) {
	header( 'Status: 404 Not Found' );
	header( 'HTTP/1.1 404 Not Found' );
	exit();
}

abstract class Abs_Post_Meta_Element extends Abs_Base_Element {
	protected $_metabox;

	public function __construct( string $name, array $attrs = array() ) {
		parent::__construct( $name, $attrs );
		add_action( 'init', array( $this, '_register_meta' ) );
	}

	public function attach_to( Meta_Box $metabox ): Abs_Post_Meta_Element {
		add_filter( self::PREFIX . '_meta_box_' . $metabox->get_id(), array( $this, '_get_rendered_text' ) );
		add_action( 'save_post', array( $this, '_save_post' ) );

		$this->_metabox = $metabox;
		return $this;
	}

	public function update( int $post_id, $value ) {
		update_post_meta( $post_id, $this->get_id(), $value );
	}

	public function _get_rendered_text( string $output, ?int $maybe_id = null ): string {
		ob_start();
		$this->_render( $maybe_id );
		return $output . ob_get_clean();
	}

	public function _save_post( int $post_id ) {
		if ( ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) ) {
			return;
		}

		$nonce = $_POST[ $this->_metabox->get_id() . '_nonce' ] ?? null;
		if ( ! wp_verify_nonce( $nonce, $this->_metabox->get_id() ) ) {
			return;
		}

		$post = get_post( $post_id );

		foreach ( $this->_metabox->_get_parents() as $parent_post_type ) {
			if ( $post->post_type === $parent_post_type ) {
				$value = $_POST[ $this->get_id() ] ?? false;
				$this->update( $post_id, $value );
			}
		}
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
