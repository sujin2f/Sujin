<?php
/**
 * 2D Tag Cloud - Options Controller
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

class SJ2DTAG_options {
	private static $option_key = 'SJ_2DTAG_CONFIG';
	public static $default_option = array(
		'title' => '',
		'tag_method' => 'click-color',
		'line_height' => 24,
		'line_height_unit' => 'px',
		'margin_right' => 5,
		'margin_bottom' => 6,
		'underline' => 0,
		'tag_config' => array(
			1 => array(
				'color' => '#CECECE',
				'bgcolor' => '',
				'color_over' => '',
				'bgcolor_over' => '',
				'radius' => 0,
				'padding' => 0,
				'size' => 12
			),
			2 => array(
				'color' => '#856797',
				'bgcolor' => '',
				'color_over' => '',
				'bgcolor_over' => '',
				'radius' => 0,
				'padding' => 0,
				'size' => 16
			),
			3 => array(
				'color' => '#FFFFFF',
				'bgcolor' => '#C9BBD2',
				'color_over' => '',
				'bgcolor_over' => '',
				'radius' => 5,
				'padding' => 3,
				'size' => 21
			),
			4 => array(
				'color' => '#FFFFFF',
				'bgcolor' => '#7629A3',
				'color_over' => '',
				'bgcolor_over' => '',
				'radius' => 5,
				'padding' => 3,
				'size' => 26
			)
		)
	);
	private static $options = false;

	/**
	 * 옵션을 뱉어내라규
	 *
	 * @since 1.0
	 * @access public static
	 */
	public static function get_options() {
		if ( empty( self::$options ) )
			self::$options = get_option( self::$option_key );

		return self::$options;
	}

	public static function get_option( $key ) {
		$options = self::get_options();
		$option = ( $key == 'new' || empty( $key ) ) ? self::$default_option : shortcode_atts( self::$default_option, $options[$key] );
		return $option;
	}

	/**
	 * 현재 설정된 세트 명
	 *
	 * @since 1.0
	 * @access public static
	 */
	private static function get_set() {
		$options = self::get_options();
		$set = isset( $_GET['set'] ) ? $_GET['set'] : false;

		if ( empty( $set ) && !empty( $options ) ) {
			$set = key( $options );
		} else if ( empty( $options ) ) {
			$set = 'new';
		}

		return $set;
	}

	public static function get_set_by_name( $set_name ) {
		$options = self::get_options();

		# Find $set_name in $options
		foreach( $options as $key => $value ) {
			if ( $value['title'] == $set_name ) return $key;
		}

		# If $set_name is set_id
		if ( !empty( $options[$set_name] ) ) return $set_name;

		# Default
		return false;
	}

	/**
	 * 필요한 변수들 한 방에 가져오기
	 *
	 * @since 6.0.0
	 * @access public static
	 */
	public static function get_variables( $set = false ) {
		$set = self::get_set();
		$options = self::get_options();
		$option = self::get_option( $set );

		return array(
			'set' => $set,
			'options' => $options,
			'option' => $option,
		);
	}

	public static function save_settings() {
		$id = $_POST['set_current_id'];

		$data = array(
			'title' => $_POST['set_name'],
			'tag_method' => $_POST['tag_method'],
			'line_height' => $_POST['line_height'],
			'line_height_unit' => $_POST['line_height_unit'],
			'margin_right' => $_POST['margin_right'],
			'margin_bottom' => $_POST['margin_bottom'],
			'underline' => isset( $_POST['underline'] )
		);

		$data['tag_config'] = array();
		foreach( $_POST['color_inp'] as $key => $value ) {
			$data['tag_config'][ $key ] = array(
				'color' => $_POST['color_inp'][$key],
				'bgcolor' => $_POST['bgcolor_inp'][$key],
				'color_over' => $_POST['color_over_inp'][$key],
				'bgcolor_over' => $_POST['bgcolor_over_inp'][$key],
				'radius' => $_POST['radius_inp'][$key],
				'padding' => $_POST['padding_inp'][$key],
				'size' => $_POST['size_inp'][$key]
			);
		}

		$options = self::get_options();

		if ( $id == 'new' ) {
			$options[] = $data;
			end( $options );
			$set = key( $options );
		} else {
			$options[$id] = $data;
			$set = $id;
		}

		update_option( self::$option_key, $options );

		return add_query_arg( 'set', $set );
	}

	public static function delete_settings( $set ) {
		$options = self::get_options();
		unset( $options[$set] );
		update_option( self::$option_key, $options );

		return remove_query_arg( 'set' );
	}

	public static function reset_tag_cache() {
		delete_option( 'SJ_2DTAG_CACHE' );
	}
}
