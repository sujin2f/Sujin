<?php
/**
 * Class : Theme_Supports API
 *
 * @project Sujin
 * @since   8.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin;

use WP_Customize_Control;

class Theme_Customizer {
	use Helpers\Singleton;

	function __construct() {
		add_action( 'customize_register', array( $this, 'mytheme_customize_register' ) );
	}

	public function mytheme_customize_register( $wp_customize ) {
		$wp_customize->add_setting(
			'flickr_id',
			array(
				'default'   => '',
				'transport' => 'refresh',
			)
		);

		$wp_customize->add_section(
			'section_flickr_id',
			array(
				'title'    => __( 'Flickr Account', 'sujin' ),
				'priority' => 10,
			)
		);

		$wp_customize->add_control(
			new WP_Customize_Control(
				$wp_customize,
				'link_color',
				array(
					'label'    => __( 'Flickr ID', 'sujin' ),
					'section'  => 'section_flickr_id',
					'settings' => 'flickr_id',
				)
			)
		);
	}
}
