<?php
/**
 * Shortcode -- [gallery id="" /]
 *
 * @package sujinc.com
 * @since   8.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin\Shortcode;

use Sujin\Wordpress\WP_Express\Helpers\Trait_Singleton;
use Sujin\Wordpress\WP_Express\Fields\Post_Meta\Attachment;

/**
 * Shortcode -- [gallery id="" /]
 */
class Gallery {
	use Trait_Singleton;

	private const SHORTCODE            = 'gallery';
	private const SHORTCODE_DEPRECATED = 'carousel';

	/**
	 * Constructor
	 *
	 * @visibility protected
	 */
	protected function __construct() {
		add_action( 'init', array( $this, 'register_shortcode' ) );
	}

	/**
	 * Shortcode registration
	 */
	public function register_shortcode(): void {
		remove_shortcode( self::SHORTCODE );
		add_shortcode( self::SHORTCODE, array( $this, 'do_shortcode' ), 15 );
		add_shortcode( self::SHORTCODE_DEPRECATED, array( $this, 'do_shortcode_carousel' ), 15 );
	}

	/**
	 * Frontend action
	 *
	 * @param  mixed $atts Attributes from the shortcode.
	 * @return string
	 */
	public function do_shortcode( $atts ): string {
		if ( ! is_array( $atts ) ) {
			return '';
		}

		$atts = shortcode_atts(
			array(
				'id' => null,
			),
			$atts,
			self::SHORTCODE
		);

		if ( ! $atts['id'] ) {
			return '';
		}

		$attachments = Attachment::get_instance( 'Photos' )->get( $atts['id'] );
		$attachments = array_map(
			function( int $attachment ): string {
				return wp_get_attachment_url( $attachment );
			},
			$attachments,
		);

		if ( ! $attachments ) {
			return '';
		}

		return $this->get_html( $attachments );
	}

	/**
	 * Deprecated: Frontend
	 *
	 * @param  mixed $atts Attributes from the shortcode.
	 * @return string
	 */
	public function do_shortcode_carousel( $atts ): string {
		_deprecated_function( __FUNCTION__, '9.0.0', '[gallery id="" /]' );

		if ( ! is_array( $atts ) || empty( $atts ) ) {
			return '';
		}

		return $this->get_html( array_values( $atts ) );
	}

	/**
	 * Frontend rendering
	 *
	 * @param  array $attachments Aattachments URL arrays.
	 * @return string
	 */
	private function get_html( array $attachments ): string {
		ob_start();
		?>
		<section class="carousel" ref="carousel">
			<section class="arrow-nav">
				<button class="prev" type="button">
					<i></i>
				</button>
				<div class="indicator">1/<?php echo esc_html( count( $attachments ) ); ?></div>
				<button class="next" type="button">
					<i></i>
				</button>
			</section>
			<section class="picture-frame">
				<img src="<?php echo esc_url( $attachments[0] ); ?>" alt="" ref="current" />
			</section>

			<section class="nav" ref="nav">
			<nav>
				<?php foreach ( $attachments as $key => $attachment ) : ?>
					<img
						src="<?php echo esc_url( $attachment ); ?>"
						class="<?php echo 0 === $key ? 'current' : ''; ?>"
						role="presentation"
						data-index="<?php echo esc_attr( $key ); ?>"
					/>
				<?php endforeach; ?>
			</nav>
			</section>
		</section>
		<?php

		return trim( ob_get_clean() );
	}
}
