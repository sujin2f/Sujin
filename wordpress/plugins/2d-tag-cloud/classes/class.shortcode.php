<?php
/**
 * 2D Tag Cloud - Shortcode Controller
 *
 * @package sujin-2d-tag-cloud
 * @author Sujin 수진 Choi
 * @version 6.0.0
 */

if ( !defined( 'ABSPATH' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

class SJ2DTAG_shortcode {
	public static function shortcode( $atts ) {
		extract( shortcode_atts( array(
			'number' => '30',
			'separator' => '',
			'sort' => 'intersection',
			'set' => false
		), $atts ) );

		$number = floatval( $number );
		if ( $number < 1 ) $number = 30;

		$sort = options_atts( $sort , array( 'intersection', 'alphabetical', '1by1', 'name', 'DESC' ) );

		$set = SJ2DTAG_options::get_set_by_name( $set );

		$options = compact( 'set', 'number', 'separator', 'sort' );

		return SJ2DTAG_main::get_tagcloud( $options );
	}
}

