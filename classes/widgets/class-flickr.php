<?php
/**
 * Flickr Widget
 *
 * @package sujinc.com
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin\Widgets;

use WP_Widget;
use Sujin\Wordpress\WP_Express\Helpers\Trait_Singleton;
use Sujin\Wordpress\WP_Express\Helpers\Transient;
use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Items\Flickr as Flickr_Item;

/**
 * Flickr Widget
 */
class Flickr extends WP_Widget {
	use Trait_Singleton;

	protected const CACHE_TTL = 12 * HOUR_IN_SECONDS;
	private const DEV_MODE    = false;

	/**
	 * Constructor
	 *
	 * @visibility protected
	 */
	protected function __construct() {
		parent::__construct(
			'flickr',  // Base ID.
			'Flickr'   // Name.
		);
	}

	/**
	 * Frontend
	 *
	 * @param array $args Arguments.
	 * @param array $_    Instance.
	 */
	public function widget( $args, $_ ) {
		$transient_key = $this->get_transient_key();
		$transient     = Transient::get_transient( $transient_key );

		if ( $transient && ! $transient->is_expired() && ! SUJIN_DEV_MODE && ! self::DEV_MODE ) {
			return $transient->items;
		}

		if ( ! is_array( $args ) ) {
			return null;
		}

		// Get URL.
		$url = $this->get_request_url( $args['id'] ?? null );

		if ( is_null( $url ) ) {
			return null;
		}

		// Request.
		$response = wp_remote_get( $url );

		// Request fails.
		if ( 200 !== $response['response']['code'] ) {
			if ( $transient && $transient->items ) {
				return $transient->items;
			}

			return null;
		}

		$response = json_decode( wp_json_encode( $response ), true );
		$items    = json_decode( $response['body'], true );
		$items    = $items['items'] ?: array();

		foreach ( array_keys( $items ) as $key ) {
			$value         = $items[ $key ];
			$items[ $key ] = Flickr_Item::get_instance( 'flickr item' . $key, $value );
			$items[ $key ] = json_decode( wp_json_encode( $items[ $key ] ), true );
		}

		shuffle( $items );
		$items = array_slice( $items, 0, 12 );
		$items = array(
			'widget' => 'flickr',
			'title'  => $args['title'] ?? null,
			'items'  => $items,
		);

		$transient = new Transient( $items, self::CACHE_TTL );
		$transient->set_transient( $transient_key );

		return $items;
	}

	/**
	 * Backend
	 *
	 * @param array $instance Instance.
	 * @codeCoverageIgnore
	 */
	public function form( $instance ) {
		$title = $instance['title'] ?? '';
		$id    = $instance['id'] ?? '';
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
			<label for="<?php echo esc_attr( $this->get_field_id( 'id' ) ); ?>">
				ID
			</label>
			<input
				class="widefat"
				id="<?php echo esc_attr( $this->get_field_id( 'id' ) ); ?>"
				name="<?php echo esc_attr( $this->get_field_name( 'id' ) ); ?>"
				type="text"
				value="<?php echo esc_attr( $id ); ?>"
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
		delete_transient( $this->get_transient_key() );

		return array(
			'title' => wp_strip_all_tags( $new_instance['title'] ) ?? '',
			'id'    => wp_strip_all_tags( $new_instance['id'] ) ?? '',
		);
	}

	/**
	 * Returns the transient key
	 *
	 * @return string
	 */
	private function get_transient_key(): string {
		return 'widget-' . $this->id;
	}

	/**
	 * Returns the Flickr URL
	 *
	 * @param  ?string $flickr_id Flickr ID.
	 * @return ?string
	 */
	private function get_request_url( ?string $flickr_id ): ?string {
		if ( ! $flickr_id ) {
			return null;
		}

		return sprintf(
			'http://api.flickr.com/services/feeds/photos_public.gne?id=%s&format=json&nojsoncallback=1',
			$flickr_id
		);
	}
}
