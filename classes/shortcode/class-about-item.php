<?php
/**
 * Shortcode -- [about-item from="" to="" /]
 *
 * @package sujinc.com
 * @since   8.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin\Shortcode;

use Sujin\Wordpress\WP_Express\Helpers\Trait_Singleton;

/**
 * Shortcode -- [about-item from="" to="" /]
 */
class About_Item {
	use Trait_Singleton;

	private const SHORTCODE = 'about-item';

	/**
	 * Constructor
	 *
	 * @visibility protected
	 */
	protected function __construct() {
		add_shortcode( self::SHORTCODE, array( $this, 'do_shortcode' ), 15, 2 );
	}

	/**
	 * Frontend
	 *
	 * @param  mixed  $atts    Attributes from the shortcode.
	 * @param  string $content String wrapped between the shortcode.
	 * @return string
	 */
	public function do_shortcode( $atts, string $content = '' ): string {
		if ( ! is_array( $atts ) ) {
			return '';
		}

		$atts = shortcode_atts(
			array(
				'from' => null,
				'to'   => null,
			),
			$atts,
			self::SHORTCODE
		);

		ob_start();
		?>
		<div class="about-item flex-container-row">
			<div class="year">
				<div><?php echo esc_html( $atts['from'] ); ?></div>
				<?php if ( $atts['to'] ) { ?>
					<div class="separator"></div>
					<div><?php echo esc_html( $atts['to'] ); ?></div>
				<?php } ?>
			</div>
			<div class="detail"><?php echo $content; ?></div>
		</div>
		<?php

		return trim( ob_get_clean() );
	}
}
