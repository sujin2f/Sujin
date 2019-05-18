<?php
/**
 * Interface for Fields
 *
 * @project WP-Express
 * @since   1.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\WP_Express\Fields\Term_Meta;

use Sujin\Wordpress\WP_Express\Fields\Abs_Term_Meta_Element;
use Sujin\Wordpress\WP_Express\Fields\Elements\Trait_Checkbox;

if ( ! defined( 'ABSPATH' ) ) {
	header( 'Status: 404 Not Found' );
	header( 'HTTP/1.1 404 Not Found' );
	exit();
}

class Checkbox extends Abs_Term_Meta_Element {
	use Trait_Checkbox;

	protected function _render_wrapper_open() {
		?>
		<tr class="<?php echo esc_attr( self::PREFIX ); ?> form-field term-<?php echo esc_attr( $this->get_id() ); ?>-wrap checkbox">
			<th scope="row">
				<label for="<?php echo esc_attr( self::PREFIX ); ?>__field__checkbox__<?php echo esc_attr( $this->get_id() ); ?>">
					<?php echo esc_html( $this->get_name() ); ?>
				</label>
			</th>
			<td>
				<label for="<?php echo esc_attr( self::PREFIX ); ?>__field__checkbox__<?php echo esc_attr( $this->get_id() ); ?>">
		<?php
	}

	protected function _render_wrapper_close() {
		echo esc_html( $this->get_name() ) . '</label></td></tr>';
	}
}
