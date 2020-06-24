<?php
/**
 * Recent Post Widget
 *
 * @package sujinc.com
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin\Widgets;

use WP_Widget;
use Sujin\Wordpress\WP_Express\Helpers\Trait_Singleton;

/**
 * Recent Post Widget
 */
class Recent_Post extends WP_Widget {
	use Trait_Singleton;

	/**
	 * Constructor
	 *
	 * @visibility protected
	 */
	protected function __construct() {
		parent::__construct(
			'recent-post',  // Base ID.
			'Recent Post'   // Name.
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
			'title'  => $args['title'] ?? null,
			'small'  => $args['small'] ?? '12',
			'medium' => $args['medium'] ?? '6',
			'large'  => $args['large'] ?? '4',
			'widget' => 'recent-post',
		);
	}

	/**
	 * Backend
	 *
	 * @param array $instance instance.
	 * @codeCoverageIgnore
	 */
	public function form( $instance ) {
		$title  = $instance['title'] ?? '';
		$small  = $instance['small'] ?? '';
		$medium = $instance['medium'] ?? '';
		$large  = $instance['large'] ?? '';
		?>
		<p>
			<label for="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>">
				Title
			</label>
			<input
				class="widefat"
				id="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>"
				name="<?php echo esc_attr( $this->get_field_name( 'title' ) ); ?>"
				type="text"
				value="<?php echo esc_attr( $title ); ?>"
			/>
		</p>
		<p>
			<label for="<?php echo esc_attr( $this->get_field_id( 'small' ) ); ?>">
				Small
			</label>
			<input
				class="widefat"
				id="<?php echo esc_attr( $this->get_field_id( 'small' ) ); ?>"
				name="<?php echo esc_attr( $this->get_field_name( 'small' ) ); ?>"
				type="number"
				value="<?php echo esc_attr( $small ); ?>"
			/>
		</p>
		<p>
			<label for="<?php echo esc_attr( $this->get_field_id( 'medium' ) ); ?>">
				Medium
			</label>
			<input
				class="widefat"
				id="<?php echo esc_attr( $this->get_field_id( 'medium' ) ); ?>"
				name="<?php echo esc_attr( $this->get_field_name( 'medium' ) ); ?>"
				type="number"
			value="<?php echo esc_attr( $medium ); ?>"
			/>
		</p>
		<p>
			<label for="<?php echo esc_attr( $this->get_field_id( 'large' ) ); ?>">
				Large
			</label>
			<input
				class="widefat"
				id="<?php echo esc_attr( $this->get_field_id( 'large' ) ); ?>"
				name="<?php echo esc_attr( $this->get_field_name( 'large' ) ); ?>"
				type="large"
			value="<?php echo esc_attr( $large ); ?>"
			/>
		</p>
		<?php
	}

	/**
	 * Backend -- update
	 *
	 * @param array $new_instance instance.
	 * @param array $old_instance instance.
	 * @codeCoverageIgnore
	 */
	public function update( $new_instance, $old_instance ) {
		return array(
			'title'  => $new_instance['title'],
			'small'  => $new_instance['small'],
			'medium' => $new_instance['medium'],
			'large'  => $new_instance['large'],
		);
	}
}
