<?php
/**
 * Google Advert Widget
 *
 * @package sujinc.com
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin\Widgets;

use WP_Widget;
use Sujin\Wordpress\WP_Express\Helpers\Trait_Singleton;

/**
 * Google Advert Widget
 */
class Google_Advert extends WP_Widget {
	use Trait_Singleton;

	/**
	 * Constructor
	 *
	 * @visibility protected
	 */
	protected function __construct() {
		parent::__construct(
			'google-advert',  // Base ID.
			'Google Advert'   // Name.
		);
	}

	/**
	 * Frontend
	 *
	 * @param array $args Arguments.
	 * @param array $_    Instance.
	 */
	public function widget( $args, $_ ) {
		return array(
			'client'     => $args['client'],
			'slot'       => $args['slot'],
			'responsive' => $args['responsive'],
			'widget'     => 'google-advert',
		);
	}

	/**
	 * Backend
	 *
	 * @param array $instance instance.
	 */
	public function form( $instance ) {
		$client     = $instance['client'] ?? '';
		$slot       = $instance['slot'] ?? '';
		$responsive = $instance['responsive'] ?? '';
		?>
		<p>
			<label for="<?php echo esc_attr( $this->get_field_id( 'client' ) ); ?>">
				Client
			</label>
			<input
				class="widefat"
				id="<?php echo esc_attr( $this->get_field_id( 'client' ) ); ?>"
				name="<?php echo esc_attr( $this->get_field_name( 'client' ) ); ?>"
				type="text"
				value="<?php echo esc_attr( $client ); ?>"
			/>
		</p>
		<p>
			<label for="<?php echo esc_attr( $this->get_field_id( 'slot' ) ); ?>">
				Slot
			</label>
			<input
				class="widefat"
				id="<?php echo esc_attr( $this->get_field_id( 'slot' ) ); ?>"
				name="<?php echo esc_attr( $this->get_field_name( 'slot' ) ); ?>"
				type="text"
				value="<?php echo esc_attr( $slot ); ?>"
			/>
		</p>
		<p>
			<label for="<?php echo esc_attr( $this->get_field_id( 'responsive' ) ); ?>">
				<input
					id="<?php echo esc_attr( $this->get_field_id( 'responsive' ) ); ?>"
					name="<?php echo esc_attr( $this->get_field_name( 'responsive' ) ); ?>"
					type="checkbox"
					<?php echo $responsive ? 'checked="checked"' : ''; ?>
				/>
				Responsive
			</label>
		</p>
		<?php
	}

	/**
	 * Backend -- update
	 *
	 * @param array $new_instance instance.
	 * @param array $old_instance instance.
	 */
	public function update( $new_instance, $old_instance ) {
		return array(
			'client'     => $new_instance['client'],
			'slot'       => $new_instance['slot'],
			'responsive' => $new_instance['responsive'],
		);
	}
}
