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

use Sujin\Wordpress\WP_Express\Taxonomy;

if ( ! defined( 'ABSPATH' ) ) {
	header( 'Status: 404 Not Found' );
	header( 'HTTP/1.1 404 Not Found' );
	exit();
}

abstract class Abs_Term_Meta_Element extends Abs_Base_Element {
	public function attach_to( $term ): Abs_Term_Meta_Element {
		$parent = $term;

		if ( $term instanceof Taxonomy ) {
			$parent = $term->get_id();
		}
		add_action( $parent . '_edit_form_fields', array( $this, '_render' ), 25 );
		add_action( 'edited_' . $parent, array( $this, '_update' ), 25 );

		return $this;
	}

	public function _update( int $term_id ) {
		update_term_meta( $term_id, $this->get_id(), $_POST[ $this->get_id() ] );
	}

	protected function _refresh_attributes( ?int $term_id = null ) {
		if ( empty( $post_id ) ) {
			if ( ! $_GET['tag_ID'] ) {
				return;
			}
			$term_id = $_GET['tag_ID'];
		}
		$this->_attributes['value'] = get_term_meta( $term_id, $this->get_id(), true );
	}

	protected function _render_wrapper_open() {
		$class = explode( '\\', get_called_class() );
		$class = strtolower( array_pop( $class ) );

		?>
		<tr class="form-field term-<?php echo esc_attr( $this->get_id() ); ?>-wrap">
			<th scope="row">
				<label for="<?php echo esc_attr( self::PREFIX ); ?>__field__<?php echo esc_attr( $class ); ?>__<?php echo esc_attr( $this->get_id() ); ?>">
					<?php echo esc_html( $this->get_name() ); ?>
				</label>
			</th>
			<td>
		<?php
	}

	protected function _render_wrapper_close() {
		echo '</td></tr>';
	}
}
