<?php
/**
 * Class : Shortcode -- [about-item /]
 *
 * @project Sujin
 * @since   8.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin\Shortcode;

use Sujin\Wordpress\Theme\Sujin\Helpers\Singleton;

class About_Item {
	use Singleton;

	private const SHORTCODE = 'about-item';

	function __construct() {
		add_shortcode( self::SHORTCODE, array( $this, 'do_shortcode' ), 15, 2 );
	}

	public function do_shortcode( array $atts, string $content = "" ): string {
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
		<div class="flex-container-row">
			<div class="year">
				<div><?php echo esc_html( $atts['from'] ); ?></div>
				<?php
				if ( $atts['to'] ) {
					echo '<div class="separator"></div>';
					echo '<div>' . esc_html( $atts['to'] ) . '</div>';

				}
				?>
			</div>
			<div class="detail"><?php echo str_replace( array( '<p>', '</p>' ), '', $content ); ?></div>
		</div>
		<?php

		return ob_get_clean();
	}
}
