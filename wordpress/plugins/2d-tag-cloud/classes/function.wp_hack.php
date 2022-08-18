<?php
/**
 * Check the attributes in Option
 *
 * @package wp-hacks
 * @author Sujin 수진 Choi
 * @since 1.0.0
 * @input : mixed $needle, array $haystack
 * @output : $value
 */

if ( !function_exists( 'options_atts' ) ) {
	function options_atts( $needle, $heystack ) {
		if ( is_array( $needle ) ) return false;
		if ( !is_array( $heystack ) ) return $needle;

		if ( in_array( $needle, $heystack ) ) {
			# If value is exist, return $needle
			return $needle;
		} else {
			# If value is not exist, return default
			return array_shift( $heystack );
		}
	}
}
