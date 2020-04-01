<?php
/**
 * Flickr Widget
 *
 * @project Sujin
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin\Widgets;

use WP_Widget;
use Sujin\Wordpress\WP_Express\Helpers\Trait_Singleton;
use Sujin\Wordpress\WP_Express\Helpers\Transient;
use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Items\Flickr as Flickr_Item;

class Advert extends WP_Widget {
	use Trait_Singleton;

	protected const CACHE_TTL = 12 * HOUR_IN_SECONDS;

	protected function __construct() {
		parent::__construct(
			'advert',  // Base ID
			'Advert'   // Name
		);
	}

	public function widget( $args, $_ ) {
		return array(
			'client'     => $args['client'],
			'slot'       => $args['slot'],
			'responsive' => $args['responsive'],
			'widget'     => 'advert',
		);
	}

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

	public function update( $new_instance, $old_instance ) {
		return array(
			'client'     => $new_instance['client'],
			'slot'       => $new_instance['slot'],
			'responsive' => $new_instance['responsive'],
		);
	}
}
