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

class Flickr extends WP_Widget {
	use Trait_Singleton;

	protected const CACHE_TTL = 12 * HOUR_IN_SECONDS;

	protected function __construct() {
		parent::__construct(
			'flickr',  // Base ID
			'Flickr'   // Name
		);
	}

	public function widget( $args, $_ ) {
		$transient_key = $this->get_transient_key();
		$transient     = Transient::get_transient( $transient_key );

		if ( $transient && ! $transient->is_expired() && ! SUJIN_DEV_MODE ) {
			return $transient->items;
		}

		// Get URL
		$url = $this->get_request_url( $args['id'] );

		if ( is_null( $url ) ) {
			return null;
		}

		// Request
		$response = wp_remote_get( $url );

		// Request fails
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
			$items[ $key ] = new Flickr_Item( $items[ $key ] );
			$items[ $key ] = json_decode( wp_json_encode( $items[ $key ] ), true );
		}

		shuffle( $items );
		$items = array_slice( $items, 0, 12 );
		$items = array(
			'widget' => 'flickr',
			'title'  => $args['title'],
			'items'  => $items,
		);

		$transient = new Transient( $items, self::CACHE_TTL );
		$transient->set_transient( $transient_key );

		return $items;
	}

	private function get_request_url( ?string $flickr_id ): ?string {
		if ( ! $flickr_id ) {
			return null;
		}

		return sprintf(
			'http://api.flickr.com/services/feeds/photos_public.gne?id=%s&format=json&nojsoncallback=1',
			$flickr_id
		);
	}

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

	public function update( $new_instance, $old_instance ) {
		delete_transient( $this->get_transient_key() );

		return array(
			'title' => strip_tags( $new_instance['title'] ) ?? '',
			'id'    => strip_tags( $new_instance['id'] ) ?? '',
		);
	}

	private function get_transient_key(): string {
		return 'widget-' . $this->id;
	}
}
