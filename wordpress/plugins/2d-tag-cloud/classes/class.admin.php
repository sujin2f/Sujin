<?php
/**
 * 2D Tag Cloud - Admin Mode
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

class SJ2DTAG_admin {
	public $version = false;
	private $msg_option_key = 'SJ_2DTAG_MESSAGE';

	/**
	 * Constructor. Hooks all interactions to initialize the class.
	 *
	 * @since 6.0.0
	 * @access public
	 */
	function __construct() {
		$this->version = floatval( get_bloginfo( 'version' ) );

		# 액션링크
		add_filter( 'plugin_action_links_' . SJ_2DTAG_PLUGIN_NAME . '/' . SJ_2DTAG_PLUGIN_FILE_NAME, array( $this, 'action_links' ), 10, 2 );

		# 스크립트
		add_action( 'admin_enqueue_scripts', array( $this, 'admin_enqueue_scripts' ), 10, 2 );

		# 메뉴
		add_action( 'admin_menu', array( $this, 'register_admin_menu' ) );

		# 리다이렉트
		add_filter( 'wp_redirect', array( $this, 'wp_redirect' ) );

		# 포스트 세이브 마다 리셋
		add_action( 'save_post', array( $this, 'reset_tag_cache' ) );
	}

	/**
	 * 플러그인 목록에 세팅 추가
	 *
	 * @since 1.0
	 * @access public
	 */
	public function action_links( $links, $file ) {
		$settings_link = '<a href="' . get_bloginfo('wpurl') . '/wp-admin/options-general.php?page=' . SJ_2DTAG_TEXTDOMAIN . '">' . __( 'Setting', SJ_2DTAG_TEXTDOMAIN ) . '</a>';
		array_unshift( $links, $settings_link );

		return $links;
	}

	/**
	 * 어드민 스크립트
	 *
	 * @since 1.0
	 * @access public
	 */
	public function admin_enqueue_scripts() {
		if ( isset( $_GET['page'] ) && $_GET['page'] == SJ_2DTAG_TEXTDOMAIN ) {
			wp_enqueue_script( 'jquery' );
			wp_enqueue_script( 'postbox' );

			if ( $this->version >= 3.2 ) {
				wp_enqueue_script( 'ui-core-jquery', 'http://ajax.googleapis.com/ajax/libs/jqueryui/1.9.0/jquery-ui.min.js' );
				wp_enqueue_style( 'ui-core-jquery', 'http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.9/themes/base/jquery-ui.css' );
			}

			if ( $this->version >= 3.0 ) {
				wp_enqueue_script( 'spectrum', SJ_2DTAG_PLUGIN_URL . '/assets/spectrum/spectrum.js' );
				wp_enqueue_style( 'spectrum', SJ_2DTAG_PLUGIN_URL . '/assets/spectrum/spectrum.css' );
			}

			wp_enqueue_script( 'sujin_tag', SJ_2DTAG_PLUGIN_URL . '/assets/admin.js' );
			wp_enqueue_style( 'sujin_tag', SJ_2DTAG_PLUGIN_URL . '/assets/admin.css' );

			if ( $this->version < 3.8 ) {
				wp_enqueue_style( 'sujin_tag_38', SJ_2DTAG_PLUGIN_URL . '/assets/admin-under-38.css' );
			}
		}
	}

	/**
	 * 메뉴 등록
	 *
	 * @since 1.0
	 * @access public
	 */
	public function register_admin_menu() {
		add_options_page(
			__( '2D Tag Cloud', SJ_2DTAG_TEXTDOMAIN ),
			__( '2D Tag Cloud', SJ_2DTAG_TEXTDOMAIN ),
			'manage_options',
			SJ_2DTAG_TEXTDOMAIN,
			array( $this, 'admin_menu' )
		);
	}

	/**
	 * 태그 캐쉬 삭제 (세이브 포스트 훅)
	 *
	 * @since 1.0
	 * @access public
	 */
	public function reset_tag_cache( $post_id ) {
		if ( wp_is_post_revision( $post_id ) ) return false;

		SJ2DTAG_options::reset_tag_cache();
	}

	/**
	 * 메인 메뉴
	 *
	 * @since 1.0
	 * @access public
	 */
	public function admin_menu() {
		# 업데이트
		if ( isset( $_POST['action'] ) && $_POST['action'] == 'update' && check_admin_referer( SJ_2DTAG_TEXTDOMAIN ) ) {
			if ( !$_POST['set_name'] ) {
				$this->message( "Please Enter the Title!", 'error' );
			} else {
				$redirect = SJ2DTAG_options::save_settings();
				$this->cache_message( 'Save setting successfully!' );
				SJ2DTAG_options::reset_tag_cache();

				wp_redirect( $redirect );
			}
		}

		# 삭제
		if ( isset( $_GET['action'] ) && $_GET['action'] == 'delete' && wp_verify_nonce( $_GET['sujin-2d-tag-cloud'], 'delete' ) ) {
			$redirect = SJ2DTAG_options::delete_settings( $_GET['set'] );
			$this->cache_message( 'Delete setting successfully!' );
			SJ2DTAG_options::reset_tag_cache();

			wp_redirect( $redirect );
		}

		# 셋, 옵션 가져오기
		extract( SJ2DTAG_options::get_variables() );

		if ( empty( $options ) ) {
			$this->message( "You don't have any option. Make new one now :)", 'error' );
		}

		$this->show_cached_message();

		# 메타박스 등록
		$this->add_meta_boxes();

		if ( $this->version < 3.4 ) {
			include_once( SJ_2DTAG_VIEW_DIR . '/admin-under-3.4.php');
		} else {
			include_once( SJ_2DTAG_VIEW_DIR . '/admin.php');
		}
	}

	/**
	 * 어드민 메시지 생성
	 *
	 * @package wp-hack
	 * @since 6.0.0
	 * @access public
	 */
	private function message( $text, $class = 'updated' ) {
		printf( '<div id="message" class="%s"><p>%s</a></p></div>', $class, $text );
	}

	/**
	 * 메시지 캐싱
	 *
	 * @package wp-hack
	 * @since 6.0.0
	 * @access public
	 */
	private function cache_message( $text, $class = 'updated' ) {
		update_option( $this->msg_option_key, array( $text, $class ) );
	}

	private function show_cached_message() {
		if ( $message = get_option( $this->msg_option_key ) & !empty( $_GET['show_message'] ) ) {
			$this->message( $message[0], $message[1] );
			delete_option( $this->msg_option_key );
		}
	}

	/**
	 * 메타박스
	 *
	 * @package wp-hack
	 * @since 1.0
	 * @access public
	 */
	private function add_meta_boxes() {
		add_meta_box(
			'donation',
			'Donation',
			array( $this, 'metabox_donation' ),
			false,
			'side'
		);

		add_meta_box(
			'publish',
			'Publish',
			array( $this, 'metabox_publish' ),
			false,
			'side'
		);

		add_meta_box(
			'preview',
			'Preview',
			array( $this, 'metabox_preview' ),
			false,
			'side'
		);

		add_meta_box(
			'options',
			'Options',
			array( $this, 'metabox_options' ),
			false,
			'normal'
		);

		add_meta_box(
			'colors',
			'Colors',
			array( $this, 'metabox_colors' ),
			false,
			'normal'
		);

		add_meta_box(
			'shortcode',
			'Shortcode',
			array( $this, 'metabox_shortcode' ),
			false,
			'normal'
		);
	}

	public function metabox_shortcode() {
		include_once( SJ_2DTAG_VIEW_DIR . '/metabox-shortcode.php');
	}

	public function metabox_donation() {
		include_once( SJ_2DTAG_VIEW_DIR . '/metabox-donation.php');
	}

	public function metabox_publish() {
		extract( SJ2DTAG_options::get_variables() );
		include_once( SJ_2DTAG_VIEW_DIR . '/metabox-publish.php');
	}

	public function metabox_preview() {
		extract( SJ2DTAG_options::get_variables() );
		include_once( SJ_2DTAG_VIEW_DIR . '/metabox-preview.php');
	}

	public function metabox_options() {
		extract( SJ2DTAG_options::get_variables() );
		include_once( SJ_2DTAG_VIEW_DIR . '/metabox-options.php');
	}

	public function metabox_colors() {
		extract( SJ2DTAG_options::get_variables() );
		include_once( SJ_2DTAG_VIEW_DIR . '/metabox-colors.php');
	}

	/**
	 * 리다이렉트
	 *
	 * @package wp-hack
	 * @since 6.0.0
	 * @access public
	 */
	public function wp_redirect( $location ) {
		if ( headers_sent() ) {
			printf( '<meta http-equiv="refresh" content="0; url=%s">', $location );
			die;
		}

		return $location;
	}
}

new SJ2DTAG_admin();

