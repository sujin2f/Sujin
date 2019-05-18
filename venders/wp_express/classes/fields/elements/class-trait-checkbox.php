<?php
/**
 * Interface for Fields
 *
 * @project WP-Express
 * @since   1.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\WP_Express\Fields\Elements;

if ( ! defined( 'ABSPATH' ) ) {
	header( 'Status: 404 Not Found' );
	header( 'HTTP/1.1 404 Not Found' );
	exit();
}

trait Trait_Checkbox {
	protected $_defaults_attributes = array();

	protected function _is_available(): bool {
		return true;
	}

	protected function _render_form() {
		$checked = $this->_attributes['value'] ? 'checked="checked"' : '';
		?>
		<section class="<?php echo esc_attr( self::PREFIX ); ?> field checkbox">
			<input
				id="<?php echo esc_attr( self::PREFIX ); ?>__field__checkbox__<?php echo esc_attr( $this->get_id() ); ?>"
				name="<?php echo esc_attr( $this->get_id() ); ?>"
				type="checkbox"
				<?php echo $checked; ?>
				<?php $this->_render_attributes(); ?>
			/>
		</section>
		<?php
	}
}
