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
use Sujin\Wordpress\WP_Express\Fields\Elements\Trait_Checkbox;

if ( ! defined( 'ABSPATH' ) ) {
	header( 'Status: 404 Not Found' );
	header( 'HTTP/1.1 404 Not Found' );
	exit();
}

class Checkbox extends Abs_Post_Meta_Element {
	use Trait_Checkbox;

	public function _register_meta() {
		$args = array(
			'type'         => 'boolean',
			'single'       => true,
			'show_in_rest' => true,
		);
		register_meta( 'post', $this->get_id(), $args );
	}

	protected function _render_wrapper_open() {
		?>
		<section
			id="<?php echo esc_attr( self::PREFIX ); ?>--post-meta-wrap--checkbox--<?php echo esc_attr( $this->get_id() ); ?>"
			class="<?php echo esc_attr( self::PREFIX ); ?> post-meta-wrap checkbox"
		>
			<label for="<?php echo esc_attr( self::PREFIX ); ?>__field__checkbox__<?php echo esc_attr( $this->get_id() ); ?>">
		<?php
	}

	protected function _render_wrapper_close() {
		echo esc_html( $this->get_name() ) . '</label></section>';
	}
}
