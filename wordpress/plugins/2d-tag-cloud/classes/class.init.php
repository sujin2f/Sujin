<?php
/**
 * 2D Tag Cloud - Initializing
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

class SJ2DTAG_init {
	/**
	 * Constructor. Hooks all interactions to initialize the class.
	 *
	 * @since 1.0
	 * @access public
	 */
	function __construct() {
		include_once( SJ_2DTAG_CLASS_DIR . '/class.database.php');
		include_once( SJ_2DTAG_CLASS_DIR . '/class.options.php');
		include_once( SJ_2DTAG_CLASS_DIR . '/class.main.php');
		include_once( SJ_2DTAG_CLASS_DIR . '/class.widget.php');

		# 활성화 훅
		register_activation_hook( SJ_2DTAG_PLUGIN_DIR . '/' . SJ_2DTAG_PLUGIN_FILE_NAME , array( 'SJ2DTAG_database', 'activate_plugin' ) );

		# 텍스트도메인
		add_action( 'plugins_loaded', array( $this, 'load_plugin_textdomain' ) );

		# 위젯
		add_action( 'widgets_init', array( $this, 'activate_widget' ) );

		if ( is_admin() ) {
			# 어드민
			include_once( SJ_2DTAG_CLASS_DIR . '/class.admin.php');
		} else {
			# 뷰 카운트
			add_action( 'wp', array( 'SJ2DTAG_database', 'increase_count' ) );

			# 숏코드
			include_once( SJ_2DTAG_CLASS_DIR . '/class.shortcode.php');
			add_shortcode( 'tag2d', array( 'SJ2DTAG_shortcode', 'shortcode' ) );
		}
	}

	/**
	 * 텍스트도메인 로딩
	 *
	 * @since 1.0
	 * @access public
	 */
	public function load_plugin_textdomain() {
		$lang_dir = SJ_2DTAG_PLUGIN_NAME . '/languages';
		load_plugin_textdomain( SJ_2DTAG_TEXTDOMAIN, 'wp-content/plugins/' . $lang_dir, $lang_dir );
	}

	/**
	 * 위젯
	 *
	 * @since 1.0
	 * @access public
	 */
	public function activate_widget() {
		register_widget( 'SJ2DTAG_widget' );
	}
}

new SJ2DTAG_init;
