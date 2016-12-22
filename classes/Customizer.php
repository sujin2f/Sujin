<?php
/**
 * Class : Customizer::Admin
 *
 * @project Sujin
 * @since   7.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin;

if ( !defined( "ABSPATH" ) ) {
	header( "Status: 404 Not Found" );
	header( "HTTP/1.1 404 Not Found" );
	exit();
}

class Customizer {
	function __construct() {
		add_action( 'customize_register', array( $this, 'setup_cusomnizer' ) );
	}

	function setup_cusomnizer( $wp_customize ) {
		$this->cusomnize_thumbnails( $wp_customize );
// 		$this->cusomnize_logo( $wp_customize );

	}

	private function cusomnize_thumbnails( $wp_customize ) {
		$wp_customize->add_section( 'sujin_thumbnail', array(
			'title'    => __( 'Thumbnail', 'Sujin' ),
			'priority' => 100,
		));

		// Default Image
		$wp_customize->add_setting( 'sujin_default_image', array(
			'default'        => '',
			'capability'     => 'edit_theme_options',
			'theme_supports' => array( 'post-thumbnails' ),
		));

		$wp_customize->add_control( new \WP_Customize_Image_Control( $wp_customize, 'sujin_default_image', array(
			'label'         => __( 'Dafault Image', 'Sujin' ),
			'section'       => 'sujin_thumbnail',
			'priority'      => 8,
			'button_labels' => array(
				'select'       => __( 'Select Image', 'Sujin' ),
				'change'       => __( 'Change Image', 'Sujin' ),
				'remove'       => __( 'Remove', 'Sujin' ),
				'default'      => __( 'Default', 'Sujin' ),
				'placeholder'  => __( 'No image selected', 'Sujin' ),
				'frame_title'  => __( 'Select Image', 'Sujin' ),
				'frame_button' => __( 'Choose Image', 'Sujin' ),
			),
		)));

/*
		// Thumbnail Sizes
		$thumbnails = array(
			'post-thumbnail-width'  => array( Constants::PostThumbnailWidth, 'Thumbnail Width' ),
			'post-thumbnail-height' => array( Constants::PostThumbnailHeight, 'Thumbnail Height' ),

			'related-post-width'    => array( Constants::RelatedpostWidth, 'Related Post Width' ),
			'related-post-height'   => array( Constants::RelatedpostHeight, 'Related Post Height' ),

			'portfolio-width'       => array( DefaultValues::PortfolioWidth, 'Portfolio Width' ),
			'portfolio-height'      => array( DefaultValues::PortfolioHeight, 'Portfolio Height' ),

			'slide-width'           => array( DefaultValues::SlideWidth, 'Slide Width' ),
			'slide-height'          => array( DefaultValues::SlideHeight, 'Slide Height' ),

			'latest-work-width'     => array( DefaultValues::LatestWorkWidth, 'Latest Work Width' ),
			'latest-work-height'    => array( DefaultValues::LatestWorkHeight, 'Latest Work Height' ),
		);

		foreach( $thumbnails as $option_key => $option_vaule ) {
			$wp_customize->add_setting( "sujin_thumbnail[$option_key]", array(
				'default'        => $option_vaule[0],
				'capability'     => 'edit_theme_options',
				'theme_supports' => array( 'post-thumbnails' ),
			));

			$wp_customize->add_control( $option_key, array(
				'label'      => __( $option_vaule[1], 'Sujin' ),
				'section'    => 'sujin_thumbnail',
				'settings'   => "sujin_thumbnail[$option_key]",
			));
		}
*/
	}

/*
	private function cusomnize_logo( $wp_customize ) {
		$wp_customize->add_setting( 'sujin_logo_header' );
		$wp_customize->add_control( new \WP_Customize_Image_Control( $wp_customize, 'sujin_logo_header',
			array(
				'label' => __( 'Logo Header', 'Sujin' ),
				'section' => 'title_tagline',
				'settings' => 'sujin_logo_header',
			) ) );

		$wp_customize->add_setting( 'sujin_logo_footer' );
		$wp_customize->add_control( new \WP_Customize_Image_Control( $wp_customize, 'sujin_logo_footer',
			array(
				'label' => __( 'Logo Footer', 'Sujin' ),
				'section' => 'title_tagline',
				'settings' => 'sujin_logo_footer',
			) ) );
	}
*/
}
