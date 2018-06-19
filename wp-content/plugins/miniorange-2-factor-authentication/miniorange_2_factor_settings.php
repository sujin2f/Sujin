<?php
/**
 * Plugin Name: miniOrange 2 Factor Authentication
 * Plugin URI: https://miniorange.com
 * Description: This plugin provides various two-factor authentication methods as an additional layer of security after the default wordpress login. We Support Google Authenticator, QR Code, Push Notification, Soft Token and Security Questions(KBA) for 1 User in the free version of the plugin.
 * Version: 5.0.9
 * Author: miniOrange
 * Author URI: https://miniorange.com
 * License: GPL2
 */
include_once dirname( __FILE__ ) . '/miniorange_2_factor_configuration.php';
include_once dirname( __FILE__ ) . '/miniorange_2_factor_mobile_configuration.php';
include_once dirname( __FILE__ ) . '/class-rba-attributes.php';
include_once dirname( __FILE__ ) . '/class-two-factor-setup.php';
include_once dirname( __FILE__ ) . '/class-customer-setup.php';
include_once dirname( __FILE__ ) . '/database/database_functions.php';
require( 'class-utility.php' );
require( 'class-mo2f-constants.php' );
require( 'class-miniorange-2-factor-login.php' );
require( 'miniorange_2_factor_support.php' );
require( 'class-miniorange-2-factor-user-registration.php' );
require( 'class-miniorange-2-factor-pass2fa-login.php' );
define( 'MOAUTH_PATH', plugins_url( __FILE__ ) );


class Miniorange_Authentication {

	private $defaultCustomerKey = "16555";
	private $defaultApiKey = "fFd2XcvTGDemZvbw1bcUesNJWEqKbbUq";

	function __construct() {

		add_option( 'mo2f_inline_registration', 0 );
		add_option( 'mo2f_activate_plugin', 1 );
		add_option( 'mo2f_login_option', 1 );
		add_option( 'mo2f_number_of_transactions', 1 );
		add_option( 'mo2f_set_transactions', 0 );
		add_option( 'mo2f_enable_forgotphone', 1 );
		add_option( 'mo2f_enable_2fa_for_users', 1 );
		add_option( 'mo2f_enable_xmlrpc', 0 );
		add_option( 'mo2f_show_sms_transaction_message', 0 );
		add_option( 'mo2f_custom_plugin_name', 'miniOrange 2-Factor' );
		add_action( 'admin_menu', array( $this, 'miniorange_auth_menu' ) );
		add_action( 'admin_init', array( $this, 'miniorange_auth_save_settings' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'plugin_settings_style' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'plugin_settings_script' ) );
		add_action( 'admin_notices', array( $this, 'get_customer_SMS_transactions' ) );
		add_action( 'admin_notices', array( $this, 'prompt_user_to_setup_two_factor' ) );
		add_action( 'admin_notices', array( $this, 'prompt_user_to_fix_bug' ) );
		add_action( 'plugins_loaded', array( $this, 'mo2fa_load_textdomain' ) );
		add_action( 'plugins_loaded', array( $this, 'mo2f_update_db_check' ) );

		remove_action( 'admin_notices', array( $this, 'mo_auth_success_message' ) );
		remove_action( 'admin_notices', array( $this, 'mo_auth_error_message' ) );

		register_activation_hook( __FILE__, array( $this, 'mo_auth_activate' ) );
		register_deactivation_hook( __FILE__, array( $this, 'mo_auth_deactivate' ) );
		$this->define_global();

		global $wp_roles;

		if ( ! isset( $wp_roles ) ) {
			$wp_roles = new WP_Roles();
		}

		if ( get_option( 'mo2f_admin_disabled_status' ) == 1 || get_option( 'mo2f_admin_disabled_status' ) == 0 ) {
			if ( get_option( 'mo2f_admin_disabled_status' ) == 1 ) {
				add_option( 'mo2fa_administrator', 1 );
			} else {
				foreach ( $wp_roles->role_names as $id => $name ) {
					add_option( 'mo2fa_' . $id, 1 );
				}
			}
			delete_option( 'mo2f_admin_disabled_status' );
		} else {
			foreach ( $wp_roles->role_names as $id => $name ) {
				add_option( 'mo2fa_' . $id, 1 );
			}
		}

		if ( get_option( 'mo2f_activate_plugin' ) == 1 ) {

			$mo2f_rba_attributes = new Miniorange_Rba_Attributes();
			$pass2fa_login       = new Miniorange_Password_2Factor_Login();
			$mo2f_2factor_setup  = new Two_Factor_Setup();
			add_action( 'init', array( $pass2fa_login, 'miniorange_pass2login_redirect' ) );
			//for shortcode addon
			add_filter( 'mo2f_shortcode_rba_gauth', array( $mo2f_rba_attributes, 'mo2f_validate_google_auth' ), 10, 3 );
			add_filter( 'mo2f_shortcode_kba', array( $mo2f_2factor_setup, 'register_kba_details' ), 10, 7 );
			add_filter( 'mo2f_update_info', array( $mo2f_2factor_setup, 'mo2f_update_userinfo' ), 10, 5 );
			add_action( 'mo2f_shortcode_form_fields', array(
				$pass2fa_login,
				'miniorange_pass2login_form_fields'
			), 10, 3 );
			add_filter( 'mo2f_gauth_service', array( $mo2f_rba_attributes, 'mo2f_google_auth_service' ), 10, 1 );


			if ( get_option( 'mo2f_login_option' ) ) { //password + 2nd factor enabled
				if ( get_option( 'mo_2factor_admin_registration_status' ) == 'MO_2_FACTOR_CUSTOMER_REGISTERED_SUCCESS' ) {

					remove_filter( 'authenticate', 'wp_authenticate_username_password', 20 );
					add_filter( 'authenticate', array( $pass2fa_login, 'mo2f_check_username_password' ), 99999, 4 );
					add_action( 'init', array( $pass2fa_login, 'miniorange_pass2login_redirect' ) );
					add_action( 'login_form', array(
						$pass2fa_login,
						'mo_2_factor_pass2login_show_wp_login_form'
					), 10 );
					if ( get_option( 'mo2f_remember_device' ) ) {
						add_action( 'login_footer', array( $pass2fa_login, 'miniorange_pass2login_footer_form' ) );
						add_action( 'woocommerce_before_customer_login_form', array(
							$pass2fa_login,
							'miniorange_pass2login_footer_form'
						) );
					}
					add_action( 'login_enqueue_scripts', array(
						$pass2fa_login,
						'mo_2_factor_enable_jquery_default_login'
					) );

					add_action( 'woocommerce_login_form_end', array(
						$pass2fa_login,
						'mo_2_factor_pass2login_show_wp_login_form'
					) );
					add_action( 'wp_enqueue_scripts', array(
						$pass2fa_login,
						'mo_2_factor_enable_jquery_default_login'
					) );

					//Actions for other plugins to use miniOrange 2FA plugin
					add_action( 'miniorange_pre_authenticate_user_login', array(
						$pass2fa_login,
						'mo2f_check_username_password'
					), 1, 4 );
					add_action( 'miniorange_post_authenticate_user_login', array(
						$pass2fa_login,
						'miniorange_initiate_2nd_factor'
					), 1, 3 );
					add_action( 'miniorange_collect_attributes_for_authenticated_user', array(
						$pass2fa_login,
						'mo2f_collect_device_attributes_for_authenticated_user'
					), 1, 2 );

				}

			} else { //login with phone enabled

				if ( get_option( 'mo_2factor_admin_registration_status' ) == 'MO_2_FACTOR_CUSTOMER_REGISTERED_SUCCESS' ) {

					$mobile_login = new Miniorange_Mobile_Login();
					add_action( 'login_form', array( $mobile_login, 'miniorange_login_form_fields' ), 10 );
					add_action( 'login_footer', array( $mobile_login, 'miniorange_login_footer_form' ) );

					remove_filter( 'authenticate', 'wp_authenticate_username_password', 20 );
					add_filter( 'authenticate', array( $mobile_login, 'mo2fa_default_login' ), 99999, 3 );
					add_action( 'login_enqueue_scripts', array( $mobile_login, 'custom_login_enqueue_scripts' ) );
				}


			}
		}
	}

	function define_global() {
		global $Mo2fdbQueries;
		$Mo2fdbQueries = new Mo2fDB();
	}

	function mo2f_update_db_check() {

		$user_id = get_site_option( 'mo2f_miniorange_admin' );

	    if( ! get_option( 'mo2f_is_NC' ) )
		    update_user_meta( $user_id, 'skipped_flow_driven_setup', true );

		if ( ! get_option( 'mo2f_existing_user_values_updated' ) ) {

			if ( get_option( 'mo2f_customerKey' ) && ! get_option( 'mo2f_is_NC' ) ) {
				update_option( 'mo2f_is_NC', 0 );
			}

			global $Mo2fdbQueries;
			$check_if_user_column_exists = false;

			if ( $user_id && ! get_option( 'mo2f_is_NC' ) ) {
				$does_table_exist = $Mo2fdbQueries->check_if_table_exists();
				if($does_table_exist)
				    $check_if_user_column_exists = $Mo2fdbQueries->check_if_user_column_exists( $user_id );
				if ( ! $check_if_user_column_exists ) {
					$Mo2fdbQueries->generate_tables();
					$Mo2fdbQueries->insert_user( $user_id, array( 'user_id' => $user_id ) );

					add_option( 'mo2f_phone', get_option( 'user_phone' ) );
					add_option( 'mo2f_enable_login_with_2nd_factor', get_option( 'mo2f_show_loginwith_phone' ) );
					add_option( 'mo2f_remember_device', get_option( 'mo2f_deviceid_enabled' ) );
					add_option( 'mo2f_transactionId', get_option( 'mo2f-login-transactionId' ) );
					add_option( 'mo2f_is_NC', 0 );
					$phone      = get_user_meta( $user_id, 'mo2f_user_phone', true );
					$user_phone = $phone ? $phone : get_user_meta( $user_id, 'mo2f_phone', true );

					$Mo2fdbQueries->update_user_details( $user_id,
						array(
							'mo2f_GoogleAuthenticator_config_status' => get_user_meta( $user_id, 'mo2f_google_authentication_status', true ),
							'mo2f_SecurityQuestions_config_status'   => get_user_meta( $user_id, 'mo2f_kba_registration_status', true ),
							'mo2f_EmailVerification_config_status'   => true,
							'mo2f_AuthyAuthenticator_config_status'  => get_user_meta( $user_id, 'mo2f_authy_authentication_status', true ),
							'mo2f_user_email'                        => get_user_meta( $user_id, 'mo_2factor_map_id_with_email', true ),
							'mo2f_user_phone'                        => $user_phone,
							'user_registration_with_miniorange'      => get_user_meta( $user_id, 'mo_2factor_user_registration_with_miniorange', true ),
							'mobile_registration_status'             => get_user_meta( $user_id, 'mo2f_mobile_registration_status', true ),
							'mo2f_configured_2FA_method'             => get_user_meta( $user_id, 'mo2f_selected_2factor_method', true ),
							'mo_2factor_user_registration_status'    => get_user_meta( $user_id, 'mo_2factor_user_registration_status', true )
						) );

					if ( get_user_meta( $user_id, 'mo2f_mobile_registration_status', true ) ) {
						$Mo2fdbQueries->update_user_details( $user_id,
							array(
								'mo2f_miniOrangeSoftToken_config_status'            => true,
								'mo2f_miniOrangeQRCodeAuthentication_config_status' => true,
								'mo2f_miniOrangePushNotification_config_status'     => true
							) );
					}

					if ( get_user_meta( $user_id, 'mo2f_otp_registration_status', true ) ) {
						$Mo2fdbQueries->update_user_details( $user_id,
							array(
								'mo2f_OTPOverSMS_config_status' => true
							) );
					}

					$mo2f_external_app_type = get_user_meta( $user_id, 'mo2f_external_app_type', true ) == 'AUTHY 2-FACTOR AUTHENTICATION' ?
						'Authy Authenticator' : 'Google Authenticator';

					update_user_meta( $user_id, 'mo2f_external_app_type', $mo2f_external_app_type );
					update_user_meta( $user_id, 'skipped_flow_driven_setup', true );
				        update_user_meta( $user_id, 'current_modal', 0 );

					delete_option( 'mo2f_show_loginwith_phone' );
					delete_option( 'mo2f_deviceid_enabled' );
					delete_option( 'mo2f-login-transactionId' );
					delete_user_meta( $user_id, 'mo2f_google_authentication_status' );
					delete_user_meta( $user_id, 'mo2f_kba_registration_status' );
					delete_user_meta( $user_id, 'mo2f_email_verification_status' );
					delete_user_meta( $user_id, 'mo2f_authy_authentication_status' );
					delete_user_meta( $user_id, 'mo_2factor_map_id_with_email' );
					delete_user_meta( $user_id, 'mo_2factor_user_registration_with_miniorange' );
					delete_user_meta( $user_id, 'mo2f_mobile_registration_status' );
					delete_user_meta( $user_id, 'mo2f_otp_registration_status' );
					delete_user_meta( $user_id, 'mo2f_selected_2factor_method' );
					delete_user_meta( $user_id, 'mo2f_configure_test_option' );
					delete_user_meta( $user_id, 'mo_2factor_user_registration_status' );

					update_option( 'mo2f_existing_user_values_updated', 1 );

				}
			}
		}
	}


	/**
	 * Function tells where to look for translations.
	 */
	function mo2fa_load_textdomain() {
		load_plugin_textdomain( 'miniorange-2-factor-authentication', false, dirname( plugin_basename( __FILE__ ) ) . '/lang/' );
	}

	function get_customer_SMS_transactions() {

		if ( get_option( 'mo_2factor_admin_registration_status' ) == 'MO_2_FACTOR_CUSTOMER_REGISTERED_SUCCESS' && get_option( 'mo2f_show_sms_transaction_message' ) ) {
			if ( ! get_option( 'mo2f_set_transactions' ) ) {
				$customer = new Customer_Setup();

				$content = json_decode( $customer->get_customer_transactions( get_option( 'mo2f_customerKey' ), get_option( 'mo2f_api_key' ) ), true );

				update_option( 'mo2f_set_transactions', 1 );
				if ( ! array_key_exists( 'smsRemaining', $content ) ) {
					$smsRemaining = 0;
				} else {
					$smsRemaining = $content['smsRemaining'];

					if ( $smsRemaining == null ) {
						$smsRemaining = 0;
					}
				}
				update_option( 'mo2f_number_of_transactions', $smsRemaining );
			} else {
				$smsRemaining = get_option( 'mo2f_number_of_transactions' );
			}

			$this->display_customer_transactions( $smsRemaining );
		}
	}

	function display_customer_transactions( $content ) {
		echo '<div class="is-dismissible notice notice-warning"> <form name="f" method="post" action=""><input type="hidden" name="option" value="mo_auth_sync_sms_transactions" /><p><b>' . mo2f_lt( 'miniOrange 2-Factor Plugin:' ) . '</b> ' . mo2f_lt( 'You have' ) . ' <b style="color:red">' . $content . ' ' . mo2f_lt( 'SMS transactions' ) . ' </b>' . mo2f_lt( 'remaining' ) . '<input type="submit" name="submit" value="' . mo2f_lt( 'Check Transactions' ) . ' " class="button button-primary button-large" /></form><button type="button" class="notice-dismiss"><span class="screen-reader-text">' . mo2f_lt( 'Dismiss this notice.' ) . '</span></button></div>';
	}

	function prompt_user_to_setup_two_factor() {
		global $Mo2fdbQueries;
		$user                     = wp_get_current_user();
		$selected_2_Factor_method = $Mo2fdbQueries->get_user_detail( 'mo2f_configured_2FA_method', $user->ID );
		if ( $selected_2_Factor_method == 'NONE' ) {
			if ( get_option( 'mo2f_enable_2fa_for_users' ) || ( current_user_can( 'manage_options' ) && get_option( 'mo2f_miniorange_admin' ) == $user->ID ) ) {
				echo '<div class="is-dismissible notice notice-warning"><p><b>' . mo2f_lt( "miniOrange 2-Factor Plugin: " ) . '</b>' . mo2f_lt( 'You have not configured your 2-factor authentication method yet.' ) .
				     '<a href="admin.php?page=miniOrange_2_factor_settings&amp;mo2f_tab=mobile_configure">' . mo2f_lt( ' Click here' ) . '</a>' . mo2f_lt( ' to set it up.' ) .
				     '<button type="button" class="notice-dismiss"><span class="screen-reader-text">' . mo2f_lt( 'Dismiss this notice.' ) . '</span></button></div>';
			}
		}
	}

	function prompt_user_to_fix_bug() {
		$user = wp_get_current_user();
		$iconurl = plugin_dir_url( __FILE__ ) . 'includes/images/mo2fa_bug.png';
		if ( !get_option( 'mo2f_is_NC' ) && ! get_option( 'mo2f_bug_fix_done' ) && current_user_can( 'manage_options' ) && get_option( 'mo2f_miniorange_admin' ) == $user->ID ) {
			echo '<div class="is-dismissible notice notice-warning"><p><b>' . mo2f_lt( "miniOrange 2-Factor Plugin: " ) . '</b>' . mo2f_lt( 'If you facing issues after the plugin update 
			like not seeing anything in the Account Setup Tab [ ' . '<a class="btn btn-link" data-toggle="collapse" id="showpreviewofbug" href="#previewofbug"
                              aria-expanded="false">' .  mo2f_lt( 'See preview' ) . '</a>'
             . ' ] click on Clear / Refresh Cache.' ) . '<br><span style="color:red">' . mo2f_lt( ' Please click on ' ) . '<b>' . mo2f_lt( 'Dismiss Notice ' ) . '</b>' . mo2f_lt( ' if you are not facing any issues.' ) . '</span>' .
            '<div><br>
               <form name="f" method="post" action="" id="mo2f_fix_bug_form">
            <input type="hidden" name="option" value="mo2f_fix_bug_option"/>
            <button style="display:inline-block;float:left" class="button button-primary button-large" id="mo2f_fix_bug" name="mo2f_fix_bug"
                    onclick="this.form.submit()" >' . mo2f_lt( "Clear / Refresh Cache" ) . ' </button></form>
                   <form name="f" method="post" action="" id="mo2f_dismiss_notice_form">
            <input type="hidden" name="option" value="mo2f_dismiss_notice_option"/>
            <button style="display:inline-block;float:left;margin-left:30px;" class="button button-primary button-large" id="mo2f_dismiss_notice" name="mo2f_fix_bug"
                    onclick="this.form.submit()" >' . mo2f_lt( "Dismiss Notice" ) . ' </button></form></div><br><br>
                     <div class="mo2f_collapse" id="previewofbug" style="height:300px;">
                            <center><br>
                                <img style="height:300px;"
                                     src="' . $iconurl . '">
                            </center>
                        </div>
                        <br>
                     </div>
                     
                     
           ';
		}
	}


	function mo_auth_success_message() {
		$message = get_option( 'mo2f_message' ); ?>
        <script>
            jQuery(document).ready(function () {
                var message = "<?php echo $message; ?>";
                jQuery('#messages').append("<div  style='padding:5px;'><div class='error notice is-dismissible mo2f_error_container'> <p class='mo2f_msgs'>" + message + "</p></div></div>");
            });
        </script>
		<?php
	}

	function mo_auth_error_message() {
		$message = get_option( 'mo2f_message' ); ?>
        <script>
            jQuery(document).ready(function () {
                var message = "<?php echo $message; ?>";
                jQuery('#messages').append("<div  style='padding:5px;'><div class='updated notice is-dismissible mo2f_success_container'> <p class='mo2f_msgs'>" + message + "</p></div></div>");
            });
        </script>
		<?php
	}

	function miniorange_auth_menu() {
		global $user;
		$user = wp_get_current_user();
		if ( get_option( 'mo2f_enable_custom_icon' ) != 1 ) {
			$iconurl = plugin_dir_url( __FILE__ ) . 'includes/images/miniorange_icon.png';
		} else {
			$icon = apply_filters( 'mo2f_icon', 'icon' );
			if ( isset( $icon ) ) {
				$iconurl = $icon;
			} else {
				$iconurl = site_url() . '/wp-content/uploads/plugin_icon.png';
			}
		}
		$roles           = $user->roles;
		$miniorange_role = array_shift( $roles );

		$is_plugin_activated             = get_option( 'mo2f_activate_plugin' );
		$is_customer_admin               = get_site_option( 'mo2f_miniorange_admin' ) == $user->ID ? true : false;
		$is_2fa_enabled_for_users        = get_option( 'mo2f_enable_2fa_for_users' );
		$can_current_user_manage_options = current_user_can( 'manage_options' );
		$admin_registration_status       = get_option( 'mo_2factor_admin_registration_status' ) == 'MO_2_FACTOR_CUSTOMER_REGISTERED_SUCCESS'
			? true : false;


		if ( get_option( 'mo2f_is_NC' ) && !get_option( 'mo2f_is_NNC' ) ) {
			if ( ! $can_current_user_manage_options && get_option( 'mo2fa_' . $miniorange_role ) &&
			     $admin_registration_status && ! $is_customer_admin && $is_plugin_activated && $is_2fa_enabled_for_users ) {
				$user_register   = new Miniorange_User_Register();
				$mo2fa_hook_page = add_menu_page( 'miniOrange 2 Factor Auth', get_site_option( 'mo2f_custom_plugin_name' ), 'read', 'miniOrange_2_factor_settings', array(
					$user_register,
					'mo2f_register_user'
				), $iconurl );
			} else if ( $can_current_user_manage_options ) {
				if ( $is_customer_admin || ( ! $is_customer_admin && $is_2fa_enabled_for_users ) ) {
					$mo2fa_hook_page = add_menu_page( 'miniOrange 2 Factor Auth', get_option( 'mo2f_custom_plugin_name' ), 'manage_options', 'miniOrange_2_factor_settings', array(
						$this,
						'mo_auth_login_options'
					), $iconurl );
				}

			}
		} else {
			if ( $admin_registration_status ) {
				if ( $can_current_user_manage_options && $is_customer_admin ) {
					$mo2fa_hook_page = add_menu_page( 'miniOrange 2 Factor Auth', get_option( 'mo2f_custom_plugin_name' ), 'manage_options', 'miniOrange_2_factor_settings', array(
						$this,
						'mo_auth_login_options'
					), $iconurl );
				}
			} else if ( $can_current_user_manage_options ) {
				$mo2fa_hook_page = add_menu_page( 'miniOrange 2 Factor Auth', get_option( 'mo2f_custom_plugin_name' ), 'manage_options', 'miniOrange_2_factor_settings', array(
					$this,
					'mo_auth_login_options'
				), $iconurl );
			}
		}


	}

	function mo_auth_login_options() {
		global $user;
		$user = wp_get_current_user();
		update_option( 'mo2f_host_name', 'https://auth.miniorange.com' );
		mo_2_factor_register( $user );
	}

	function mo_2_factor_enable_frontend_style() {
		wp_enqueue_style( 'mo2f_frontend_login_style', plugins_url( 'includes/css/front_end_login.css?version=5.0.8', __FILE__ ) );
		wp_enqueue_style( 'bootstrap_style', plugins_url( 'includes/css/bootstrap.min.css?version=5.0.8', __FILE__ ) );
		wp_enqueue_style( 'mo_2_factor_admin_settings_phone_style', plugins_url( 'includes/css/phone.css?version=5.0.8', __FILE__ ) );
		wp_enqueue_style( 'mo_2_factor_wpb-fa', plugins_url( 'includes/css/font-awesome.min.css', __FILE__ ) );
		wp_enqueue_style( 'mo2f_login_popup_style', plugins_url( 'includes/css/mo2f_login_popup_ui.css?version=5.0.8', __FILE__ ) );
	}

	function plugin_settings_style($mo2fa_hook_page) {
		if ( 'toplevel_page_miniOrange_2_factor_settings' != $mo2fa_hook_page ) {
			return;
		}
		wp_enqueue_style( 'mo_2_factor_admin_settings_style', plugins_url( 'includes/css/style_settings.css?version=5.0.8', __FILE__ ) );
		wp_enqueue_style( 'mo_2_factor_admin_settings_phone_style', plugins_url( 'includes/css/phone.css?version=5.0.8', __FILE__ ) );
		wp_enqueue_style( 'bootstrap_style', plugins_url( 'includes/css/bootstrap.min.css?version=5.0.8', __FILE__ ) );
		wp_enqueue_style( 'mo_2_factor_wpb-fa', plugins_url( 'includes/css/font-awesome.min.css', __FILE__ ) );
	}

	function plugin_settings_script( $mo2fa_hook_page ) {
		if ( 'toplevel_page_miniOrange_2_factor_settings' != $mo2fa_hook_page ) {
			return;
		}
		wp_enqueue_script( 'jquery' );
		wp_enqueue_script( 'mo_2_factor_admin_settings_phone_script', plugins_url( 'includes/js/phone.js', __FILE__ ) );
		wp_enqueue_script( 'bootstrap_script', plugins_url( 'includes/js/bootstrap.min.js', __FILE__ ) );
	}

	function miniorange_auth_save_settings() {

		if(array_key_exists('page',$_REQUEST) && $_REQUEST['page']=='miniOrange_2_factor_settings'){
	        session_start();
        }
		
		global $user;
		global $Mo2fdbQueries;
		$defaultCustomerKey = $this->defaultCustomerKey;
		$defaultApiKey      = $this->defaultApiKey;

		$user    = wp_get_current_user();
		$user_id = $user->ID;
		global $is_flow_driven_setup;
		$is_flow_driven_setup = get_user_meta( $user->ID, 'skipped_flow_driven_setup', true ) ? 0 : 1;

		

		if ( current_user_can( 'manage_options' ) ) {

			if ( isset( $_POST['option'] ) and $_POST['option'] == "mo_auth_deactivate_account" ) {
				$url = admin_url( 'plugins.php' );
				wp_redirect( $url );
			}

			if ( isset( $_POST['option'] ) and $_POST['option'] == "mo_auth_remove_account" ) {
				update_option( 'mo2f_register_with_another_email', 1 );
				$this->mo_auth_deactivate();
			}

			if ( isset( $_POST['option'] ) and $_POST['option'] == "mo_auth_register_customer" ) {    //register the admin to miniOrange
				//validate and sanitize
				$email           = '';
				$phone           = '';
				$password        = '';
				$confirmPassword = '';
				$company         = '';
				$firstName       = '';
				$lastName        = '';

				if ( MO2f_Utility::mo2f_check_empty_or_null( $_POST['email'] ) || MO2f_Utility::mo2f_check_empty_or_null( $_POST['password'] ) || MO2f_Utility::mo2f_check_empty_or_null( $_POST['confirmPassword'] ) || MO2f_Utility::mo2f_check_empty_or_null( $_POST['company'] ) ) {
					update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "INVALID_ENTRY" ) );
					$this->mo_auth_show_error_message();

					return;
				} else if ( strlen( $_POST['password'] ) < 6 || strlen( $_POST['confirmPassword'] ) < 6 ) {
					update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "MIN_PASS_LENGTH" ) );
					$this->mo_auth_show_error_message();

					return;
				} else {
					$email           = sanitize_email( $_POST['email'] );
					$phone           = sanitize_text_field( $_POST['phone'] );
					$password        = sanitize_text_field( $_POST['password'] );
					$confirmPassword = sanitize_text_field( $_POST['confirmPassword'] );
					$company         = sanitize_text_field( $_POST['company'] );
					$firstName       = sanitize_text_field( $_POST['first_name'] );
					$lastName        = sanitize_text_field( $_POST['last_name'] );
				}
				$email = strtolower( $email );
				update_option( 'mo2f_email', $email );

				$Mo2fdbQueries->insert_user( $user_id, array( 'user_id' => $user_id ) );
				$Mo2fdbQueries->update_user_details( $user->ID, array( 'mo2f_user_phone' => $phone ) );

				update_option( 'mo2f_admin_company', $company );
				update_option( 'mo2f_admin_first_name', $firstName );
				update_option( 'mo2_admin_last_name', $lastName );

				if ( strcmp( $password, $confirmPassword ) == 0 ) {
					update_option( 'mo2f_password', $password );
					$customer    = new Customer_Setup();
					$customerKey = json_decode( $customer->check_customer(), true );
					if ( $customerKey['status'] == 'ERROR' ) {
						update_option( 'mo2f_message', Mo2fConstants:: langTranslate( $customerKey['message'] ) );

						$this->mo_auth_show_error_message();
					} else {

						if ( strcasecmp( $customerKey['status'], 'CUSTOMER_NOT_FOUND' ) == 0 ) { //customer not found then send OTP to verify email

							$content = json_decode( $customer->send_otp_token( $email, 'EMAIL', $defaultCustomerKey, $defaultApiKey ), true );

							if ( strcasecmp( $content['status'], 'SUCCESS' ) == 0 ) {

								update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "OTP_SENT" ) . ' <b>' . ( get_option( 'mo2f_email' ) ) . ' </b>. ' . Mo2fConstants:: langTranslate( "ENTER_OTP" ) );
								$Mo2fdbQueries->update_user_details( $user->ID, array( 'mo_2factor_user_registration_status' => 'MO_2_FACTOR_OTP_DELIVERED_SUCCESS' ) );
								update_user_meta( $user->ID, 'mo2f_email_otp_count', 1 );
								update_user_meta( $user->ID, 'mo_2fa_verify_otp_create_account', $content['txId'] );
								$this->mo_auth_show_success_message();
							} else {
								update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "ERROR_IN_SENDING_OTP_OVER_EMAIL" ) );

								$Mo2fdbQueries->update_user_details( $user->ID, array( 'mo_2factor_user_registration_status' => 'MO_2_FACTOR_OTP_DELIVERED_FAILURE' ) );
								$this->mo_auth_show_error_message();
							}

						} else { //customer already exists, redirect him to login page

							update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "ACCOUNT_ALREADY_EXISTS" ) );
							$Mo2fdbQueries->update_user_details( $user->ID, array( 'mo_2factor_user_registration_status' => 'MO_2_FACTOR_VERIFY_CUSTOMER' ) );
							$this->mo_auth_show_success_message();
						}

					}
				} else {
					update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "PASSWORDS_MISMATCH" ) );
					$this->mo_auth_show_error_message();
				}
			}

			if ( isset( $_POST['option'] ) and $_POST['option'] == "mo2f_goto_verifycustomer" ) {
				$Mo2fdbQueries->insert_user( $user_id, array( 'user_id' => $user_id ) );
				update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "ENTER_YOUR_EMAIL_PASSWORD" ) );
				$Mo2fdbQueries->update_user_details( $user->ID, array( 'mo_2factor_user_registration_status' => 'MO_2_FACTOR_VERIFY_CUSTOMER' ) );
				$this->mo_auth_show_success_message();
			}

			if ( isset( $_POST['option'] ) and $_POST['option'] == "mo_auth_verify_customer" ) {    //register the admin to miniOrange if already exist

				//validation and sanitization
				$email    = '';
				$password = '';
				$Mo2fdbQueries->insert_user( $user_id, array( 'user_id' => $user_id ) );


				if ( MO2f_Utility::mo2f_check_empty_or_null( $_POST['email'] ) || MO2f_Utility::mo2f_check_empty_or_null( $_POST['password'] ) ) {
					update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "INVALID_ENTRY" ) );
					$this->mo_auth_show_error_message();

					return;
				} else {
					$email    = sanitize_email( $_POST['email'] );
					$password = sanitize_text_field( $_POST['password'] );
				}

				update_option( 'mo2f_email', $email );
				update_option( 'mo2f_password', stripslashes( $password ) );
				$customer    = new Customer_Setup();
				$content     = $customer->get_customer_key();
				$customerKey = json_decode( $content, true );
				if ( json_last_error() == JSON_ERROR_NONE ) {
					if ( is_array( $customerKey ) && array_key_exists( "status", $customerKey ) && $customerKey['status'] == 'ERROR' ) {
						update_option( 'mo2f_message', Mo2fConstants::langTranslate( $customerKey['message'] ) );
						$this->mo_auth_show_error_message();
					} else if ( is_array( $customerKey ) ) {
						if ( isset( $customerKey['id'] ) && ! empty( $customerKey['id'] ) ) {
							update_option( 'mo2f_customerKey', $customerKey['id'] );
							update_option( 'mo2f_api_key', $customerKey['apiKey'] );
							update_option( 'mo2f_customer_token', $customerKey['token'] );
							update_option( 'mo2f_app_secret', $customerKey['appSecret'] );
							$Mo2fdbQueries->update_user_details( $user->ID, array( 'mo2f_user_phone' => $customerKey['phone'] ) );
							update_option( 'mo2f_miniorange_admin', $user->ID );

							//gayathri1
							$skipped_flow_driven_setup            = get_option( 'mo2f_is_NC' ) == 0 ? 1 : 0;
							$current_modal                        = get_option( 'mo2f_is_NC' ) == 0 ? 1 : 0;
							$mo2f_emailVerification_config_status = get_option( 'mo2f_is_NC' ) == 0 ? true : false;

							delete_option( 'mo2f_password' );
							update_option( 'mo_2factor_admin_registration_status', 'MO_2_FACTOR_CUSTOMER_REGISTERED_SUCCESS' );

							$Mo2fdbQueries->update_user_details( $user->ID, array(
								'mo2f_EmailVerification_config_status' => $mo2f_emailVerification_config_status,
								'mo2f_user_email'                      => get_option( 'mo2f_email' ),
								'user_registration_with_miniorange'    => 'SUCCESS',
								'mo2f_2factor_enable_2fa_byusers'      => 1,
							) );
							$mo_2factor_user_registration_status = 'MO_2_FACTOR_PLUGIN_SETTINGS';
							$Mo2fdbQueries->update_user_details( $user->ID, array( 'mo_2factor_user_registration_status' => $mo_2factor_user_registration_status ) );
							update_user_meta( $user->ID, 'skipped_flow_driven_setup', $skipped_flow_driven_setup );
							update_user_meta( $user->ID, 'current_modal', $current_modal );
							$configured_2FA_method = 'NONE';
							$user_email            = $Mo2fdbQueries->get_user_detail( 'mo2f_user_email', $user->ID );
							$enduser               = new Two_Factor_Setup();
							$userinfo              = json_decode( $enduser->mo2f_get_userinfo( $user_email ), true );

							$mo2f_second_factor = 'NONE';
							if ( json_last_error() == JSON_ERROR_NONE ) {
								if ( $userinfo['status'] == 'SUCCESS' ) {
									$mo2f_second_factor = mo2f_update_and_sync_user_two_factor( $user->ID, $userinfo );

								}
							}
							if ( $mo2f_second_factor != 'NONE' ) {
								$configured_2FA_method = MO2f_Utility::mo2f_decode_2_factor( $mo2f_second_factor, "servertowpdb" );

								if ( get_option( 'mo2f_is_NC' ) == 0 ) {

									$auth_method_abr = str_replace( ' ', '', $configured_2FA_method );
									$Mo2fdbQueries->update_user_details( $user->ID, array(
										'mo2f_configured_2FA_method'                  => $configured_2FA_method,
										'mo2f_' . $auth_method_abr . '_config_status' => true
									) );

								} else {
									if ( in_array( $configured_2FA_method, array(
										'Email Verification',
										'Authy Authenticator',
										'OTP over SMS'
									) ) ) {
										$enduser->mo2f_update_userinfo( $user_email, 'NONE', null, '', true );
									}
								}


							}

							$mo2f_message = Mo2fConstants:: langTranslate( "ACCOUNT_RETRIEVED_SUCCESSFULLY" );
							if ( $configured_2FA_method != 'NONE' && get_option( 'mo2f_is_NC' ) == 0 ) {
								$mo2f_message .= ' <b>' . $configured_2FA_method . '</b> ' . Mo2fConstants:: langTranslate( "DEFAULT_2ND_FACTOR" ) . '.';
							}
							$mo2f_message .= ' ' . '<a href=\"admin.php?page=miniOrange_2_factor_settings&amp;mo2f_tab=mobile_configure\" >' . Mo2fConstants:: langTranslate( "CLICK_HERE" ) . '</a> ' . Mo2fConstants:: langTranslate( "CONFIGURE_2FA" );

							update_option( 'mo2f_message', $mo2f_message );
							$this->mo_auth_show_success_message();
						} else {
							update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "INVALID_EMAIL_OR_PASSWORD" ) );
							$mo_2factor_user_registration_status = 'MO_2_FACTOR_VERIFY_CUSTOMER';
							$Mo2fdbQueries->update_user_details( $user->ID, array( 'mo_2factor_user_registration_status' => $mo_2factor_user_registration_status ) );
							$this->mo_auth_show_error_message();
						}

					}
				} else {
					update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "INVALID_EMAIL_OR_PASSWORD" ) );
					$mo_2factor_user_registration_status = 'MO_2_FACTOR_VERIFY_CUSTOMER';
					$Mo2fdbQueries->update_user_details( $user->ID, array( 'mo_2factor_user_registration_status' => $mo_2factor_user_registration_status ) );
					$this->mo_auth_show_error_message();
				}

				delete_option( 'mo2f_password' );
			}

			if ( isset( $_POST['option'] ) and $_POST['option'] == 'mo_2factor_phone_verification' ) { //at registration time
				$phone = sanitize_text_field( $_POST['phone_number'] );
				$Mo2fdbQueries->update_user_details( $user->ID, array( 'mo2f_user_phone' => $phone ) );

				$phone     = str_replace( ' ', '', $phone );
				$auth_type = 'SMS';
				$customer  = new Customer_Setup();

				$send_otp_response = json_decode( $customer->send_otp_token( $phone, $auth_type, $defaultCustomerKey, $defaultApiKey ), true );

				if ( strcasecmp( $send_otp_response['status'], 'SUCCESS' ) == 0 ) {
					$mo_2factor_user_registration_status = 'MO_2_FACTOR_OTP_DELIVERED_SUCCESS';
					$Mo2fdbQueries->update_user_details( $user->ID, array( 'mo_2factor_user_registration_status' => $mo_2factor_user_registration_status ) );
					update_user_meta( $user->ID, 'mo_2fa_verify_otp_create_account', $send_otp_response['txId'] );

					if ( get_user_meta( $user->ID, 'mo2f_sms_otp_count', true ) ) {
						update_option( 'mo2f_message', 'Another One Time Passcode has been sent <b>( ' . get_user_meta( $user->ID, 'mo2f_sms_otp_count', true ) . ' )</b> for verification to ' . $phone );
						update_user_meta( $user->ID, 'mo2f_sms_otp_count', get_user_meta( $user->ID, 'mo2f_sms_otp_count', true ) + 1 );
					} else {
						update_option( 'mo2f_message', 'One Time Passcode has been sent for verification to ' . $phone );
						update_user_meta( $user->ID, 'mo2f_sms_otp_count', 1 );
					}

					$this->mo_auth_show_success_message();
				} else {
					update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "ERROR_WHILE_SENDING_SMS" ) );
					$mo_2factor_user_registration_status = 'MO_2_FACTOR_OTP_DELIVERED_FAILURE';
					$Mo2fdbQueries->update_user_details( $user->ID, array( 'mo_2factor_user_registration_status' => $mo_2factor_user_registration_status ) );
					$this->mo_auth_show_error_message();
				}

			}

			if ( isset( $_POST['option'] ) and $_POST['option'] == "mo_2factor_resend_otp" ) { //resend OTP over email for admin
				$customer = new Customer_Setup();
				$content  = json_decode( $customer->send_otp_token( get_option( 'mo2f_email' ), 'EMAIL', $defaultCustomerKey, $defaultApiKey ), true );
				if ( strcasecmp( $content['status'], 'SUCCESS' ) == 0 ) {
					if ( get_user_meta( $user->ID, 'mo2f_email_otp_count', true ) ) {
						update_user_meta( $user->ID, 'mo2f_email_otp_count', get_user_meta( $user->ID, 'mo2f_email_otp_count', true ) + 1 );
						update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "RESENT_OTP" ) . ' <b>( ' . get_user_meta( $user->ID, 'mo2f_email_otp_count', true ) . ' )</b> to <b>' . ( get_option( 'mo2f_email' ) ) . '</b> ' . Mo2fConstants:: langTranslate( "ENTER_OTP" ) );
					} else {
						update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "OTP_SENT" ) . '<b> ' . ( get_option( 'mo2f_email' ) ) . ' </b>' . Mo2fConstants:: langTranslate( "ENTER_OTP" ) );
						update_user_meta( $user->ID, 'mo2f_email_otp_count', 1 );
					}
					$mo_2factor_user_registration_status = 'MO_2_FACTOR_OTP_DELIVERED_SUCCESS';
					$Mo2fdbQueries->update_user_details( $user->ID, array( 'mo_2factor_user_registration_status' => $mo_2factor_user_registration_status ) );
					update_user_meta( $user->ID, 'mo_2fa_verify_otp_create_account', $content['txId'] );

					$this->mo_auth_show_success_message();
				} else {
					update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "ERROR_IN_SENDING_EMAIL" ) );
					$mo_2factor_user_registration_status = 'MO_2_FACTOR_OTP_DELIVERED_FAILURE';
					$Mo2fdbQueries->update_user_details( $user->ID, array( 'mo_2factor_user_registration_status' => $mo_2factor_user_registration_status ) );
					$this->mo_auth_show_error_message();
				}


			}

			if ( isset( $_POST['option'] ) and $_POST['option'] == "mo2f_fix_bug_option" ) {
				$user_id = get_option('mo2f_miniorange_admin');
				$check_if_user_column_exists = $Mo2fdbQueries->check_if_user_column_exists($user_id);
				update_option( 'mo2f_bug_fix_done', 1 );
				
                if($check_if_user_column_exists == 0)
				    $this->mo2f_fix_the_bug();
			}

			if ( isset( $_POST['option'] ) and $_POST['option'] == "mo2f_dismiss_notice_option" ) {
				update_option( 'mo2f_bug_fix_done', 1 );
			}


			if ( isset( $_POST['option'] ) and $_POST['option'] == "mo_2factor_validate_otp" ) { //validate OTP over email for admin

				//validation and sanitization
				$otp_token = '';
				if ( MO2f_Utility::mo2f_check_empty_or_null( $_POST['otp_token'] ) ) {
					update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "INVALID_ENTRY" ) );
					$this->mo_auth_show_error_message();

					return;
				} else {
					$otp_token = sanitize_text_field( $_POST['otp_token'] );
				}

				$customer = new Customer_Setup();

				$transactionId = get_user_meta( $user->ID, 'mo_2fa_verify_otp_create_account', true );

				$content = json_decode( $customer->validate_otp_token( 'EMAIL', null, $transactionId, $otp_token, $defaultCustomerKey, $defaultApiKey ), true );
				if ( $content['status'] == 'ERROR' ) {
					update_option( 'mo2f_message', Mo2fConstants:: langTranslate( $content['message'] ) );
					$this->mo_auth_show_error_message();
				} else {
					if ( strcasecmp( $content['status'], 'SUCCESS' ) == 0 ) { //OTP validated
						$this->mo2f_create_customer( $user );
						delete_user_meta( $user->ID, 'mo_2fa_verify_otp_create_account' );
					} else {  // OTP Validation failed.
						update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "INVALID_OTP" ) );
						$Mo2fdbQueries->update_user_details( $user->ID, array( 'mo_2factor_user_registration_status' => 'MO_2_FACTOR_OTP_DELIVERED_FAILURE' ) );
						$this->mo_auth_show_error_message();
					}
				}
			}

			if ( isset( $_POST['option'] ) and $_POST['option'] == "mo_2factor_validate_user_otp" ) { //validate OTP over email for additional admin

				//validation and sanitization
				$otp_token = '';
				if ( MO2f_Utility::mo2f_check_empty_or_null( $_POST['otp_token'] ) ) {
					update_option( 'mo2f_message', 'All the fields are required. Please enter valid entries.' );
					$this->mo_auth_show_error_message();

					return;
				} else {
					$otp_token = sanitize_text_field( $_POST['otp_token'] );
				}

				$user_email = get_user_meta( $user->ID, 'user_email', true );

				//if(!MO2f_Utility::check_if_email_is_already_registered($user_email)){
				$customer           = new Customer_Setup();
				$mo2f_transactionId = isset( $_SESSION['mo2f_transactionId'] ) && ! empty( $_SESSION['mo2f_transactionId'] ) ? $_SESSION['mo2f_transactionId'] : get_option( 'mo2f_transactionId' );

				$content = json_decode( $customer->validate_otp_token( 'EMAIL', '', $mo2f_transactionId, $otp_token, get_option( 'mo2f_customerKey' ), get_option( 'mo2f_api_key' ) ), true );

				if ( $content['status'] == 'ERROR' ) {
					update_option( 'mo2f_message', $content['message'] );
					$this->mo_auth_show_error_message();
				} else {
					if ( strcasecmp( $content['status'], 'SUCCESS' ) == 0 ) { //OTP validated and generate QRCode
						$this->mo2f_create_user( $user, $user_email );
						delete_user_meta( $user->ID, 'mo_2fa_verify_otp_create_account' );
					} else {
						update_option( 'mo2f_message', 'Invalid OTP. Please try again.' );
						$Mo2fdbQueries->update_user_details( $user->ID, array( 'mo_2factor_user_registration_status' => 'MO_2_FACTOR_OTP_DELIVERED_FAILURE' ) );
						$this->mo_auth_show_error_message();
					}
				}
				/*}else{
					update_option('mo2f_message','The email is already used by other user. Please register with other email by clicking on Back button.');
					$this->mo_auth_show_error_message();
				}*/
			}

			if ( isset( $_POST['option'] ) and $_POST['option'] == "mo_2factor_send_query" ) { //Help me or support
				$query = '';
				if ( MO2f_Utility::mo2f_check_empty_or_null( $_POST['EMAIL_MANDATORY'] ) || MO2f_Utility::mo2f_check_empty_or_null( $_POST['query'] ) ) {
					update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "EMAIL_MANDATORY" ) );
					$this->mo_auth_show_error_message();

					return;
				} else {
					$query      = sanitize_text_field( $_POST['query'] );
					$email      = sanitize_text_field( $_POST['EMAIL_MANDATORY'] );
					$phone      = sanitize_text_field( $_POST['query_phone'] );
					$contact_us = new Customer_Setup();
					$submited   = json_decode( $contact_us->submit_contact_us( $email, $phone, $query ), true );
					if ( json_last_error() == JSON_ERROR_NONE ) {
						if ( is_array( $submited ) && array_key_exists( 'status', $submited ) && $submited['status'] == 'ERROR' ) {
							update_option( 'mo2f_message', Mo2fConstants:: langTranslate( $submited['message'] ) );
							$this->mo_auth_show_error_message();
						} else {
							if ( $submited == false ) {
								update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "ERROR_WHILE_SUBMITTING_QUERY" ) );
								$this->mo_auth_show_error_message();
							} else {
								update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "QUERY_SUBMITTED_SUCCESSFULLY" ) );
								$this->mo_auth_show_success_message();
							}
						}
					}

				}
			}

			if ( isset( $_POST['option'] ) and $_POST['option'] == 'mo_auth_advanced_options_save' ) {
				update_option( 'mo2f_enable_2fa_for_woocommerce', isset( $_POST['mo2f_enable_2fa_for_woocommerce'] ) ? $_POST['mo2f_enable_2fa_for_woocommerce'] : 0 );
				update_option( 'mo2f_enable_custom_icon', isset( $_POST['mo2f_enable_custom_icon'] ) ? $_POST['mo2f_enable_custom_icon'] : 0 );
				update_option( 'mo2f_custom_plugin_name', isset( $_POST['mo2f_custom_plugin_name'] ) ? $_POST['mo2f_custom_plugin_name'] : 'miniOrange 2-Factor' );
				update_option( 'mo2f_message', 'Your settings are saved successfully.' );
				$this->mo_auth_show_success_message();
			}

			if ( isset( $_POST['option'] ) and $_POST['option'] == 'mo_auth_login_settings_save' ) {
				$mo_2factor_user_registration_status = $Mo2fdbQueries->get_user_detail( 'mo_2factor_user_registration_status', $user->ID );
				if ( $mo_2factor_user_registration_status == 'MO_2_FACTOR_PLUGIN_SETTINGS' ) {

					update_option( 'mo2f_login_option', isset( $_POST['mo2f_login_option'] ) ? $_POST['mo2f_login_option'] : 0 );
					update_option( 'mo2f_remember_device', isset( $_POST['mo2f_remember_device'] ) ? $_POST['mo2f_remember_device'] : 0 );
					if ( get_site_option( 'mo2f_login_option' ) == 0 ) {

						update_option( 'mo2f_remember_device', 0 );
					}
					update_option( 'mo2f_enable_forgotphone', isset( $_POST['mo2f_forgotphone'] ) ? $_POST['mo2f_forgotphone'] : 0 );
					update_option( 'mo2f_enable_login_with_2nd_factor', isset( $_POST['mo2f_login_with_username_and_2factor'] ) ? $_POST['mo2f_login_with_username_and_2factor'] : 0 );
					update_option( 'mo2f_enable_xmlrpc', isset( $_POST['mo2f_enable_xmlrpc'] ) ? $_POST['mo2f_enable_xmlrpc'] : 0 );


					if ( get_option( 'mo2f_remember_device' ) && ! get_option( 'mo2f_app_secret' ) ) {
						$get_app_secret = new Miniorange_Rba_Attributes();
						$rba_response   = json_decode( $get_app_secret->mo2f_get_app_secret(), true ); //fetch app secret
						if ( json_last_error() == JSON_ERROR_NONE ) {
							if ( $rba_response['status'] == 'SUCCESS' ) {
								update_option( 'mo2f_app_secret', $rba_response['appSecret'] );
							} else {
								update_option( 'mo2f_remember_device', 0 );
								update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "ERROR_WHILE_SAVING_SETTINGS" ) );
								$this->mo_auth_show_error_message();
							}
						} else {
							update_option( 'mo2f_remember_device', 0 );
							update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "ERROR_WHILE_SAVING_SETTINGS" ) );
							$this->mo_auth_show_error_message();
						}
					}

					update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "SETTINGS_SAVED" ) );
					$this->mo_auth_show_success_message();

				} else {
					update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "INVALID_REQUEST" ) );
					$this->mo_auth_show_error_message();
				}
			}

			if ( isset( $_POST['option'] ) and $_POST['option'] == 'mo_2factor_gobackto_registration_page' ) { //back to registration page for admin
				delete_option( 'mo2f_email' );
				delete_option( 'mo2f_password' );
				delete_option( 'mo2f_customerKey' );
				delete_option( 'mo2f_app_secret' );
				delete_option( 'mo2f_admin_company' );
				MO2f_Utility::unset_session_variables( 'mo2f_transactionId' );
				delete_option( 'mo2f_transactionId' );
				delete_user_meta( $user->ID, 'mo2f_sms_otp_count' );
				delete_user_meta( $user->ID, 'mo2f_email_otp_count' );
				$Mo2fdbQueries->update_user_details( $user->ID, array( 'mo_2factor_user_registration_status' => '' ) );

			}

			if ( isset( $_POST['option'] ) && $_POST['option'] == 'mo2f_step1_next' ) {
				update_user_meta( $user->ID, 'current_modal', 2 );
				update_option( 'mo2f_message', "" );
			}

			if ( isset( $_POST['option'] ) && $_POST['option'] == 'mo2f_skip_test' ) {
				update_user_meta( $user->ID, 'current_modal', 6 );
				update_option( 'mo2f_message', "" );
			}


			if ( isset( $_POST['option'] ) && $_POST['option'] == 'mo2f_skip_flow_driven_setup' ) {

				$current_modal = get_user_meta( $user->ID, 'current_modal', true );

				if ( $current_modal == 2 ) {
					delete_user_meta( $user->ID, 'mo2f_2FA_method_to_configure' );
				} else if ( $current_modal == 3 ) {
					delete_user_meta( $user->ID, 'mo2f_2FA_method_to_test' );
				} else if ( $current_modal == 6 ) {
					update_user_meta( $user->ID, 'current_modal', 0 );
				}

				update_user_meta( $user->ID, 'skipped_flow_driven_setup', 1 );

				update_option( 'mo2f_message', "" );

			}

			if ( isset( $_POST['option'] ) && $_POST['option'] == 'mo2f_back_to_previous_step' ) {
				update_user_meta( $user->ID, 'current_modal', get_user_meta( $user->ID, 'current_modal', true ) - 1 );
				$current_modal = get_user_meta( $user->ID, 'current_modal', true );

				if ( $current_modal == 2 ) {
					delete_user_meta( $user->ID, 'mo2f_2FA_method_to_configure' );
				} else if ( $current_modal == 3 ) {
					delete_user_meta( $user->ID, 'mo2f_2FA_method_to_test' );
				}

				update_option( 'mo2f_message', "" );
			}

			if ( isset( $_POST['option'] ) && $_POST['option'] == 'mo2f_go_back_to_reconfigure_2FA' ) {
				$configured_2FA_method = $Mo2fdbQueries->get_user_detail( 'mo2f_configured_2FA_method', $user->ID );

				$current_modal = get_user_meta( $user->ID, 'current_modal', true );

				update_user_meta( $user->ID, 'current_modal', $current_modal - 2 );
				update_user_meta( $user->ID, 'mo2f_2FA_method_to_configure', $configured_2FA_method );

				delete_user_meta( $user->ID, 'mo2f_2FA_method_to_test' );
				$Mo2fdbQueries->update_user_details( $user->ID, array( 'mo2f_' . str_replace( ' ', '', $configured_2FA_method ) . '_config_status' => false ) );

				if ( $configured_2FA_method == 'Google Authenticator' ) {
					$Mo2fdbQueries->update_user_details( $user->ID, array(
						"mo2f_GoogleAuthenticator_config_status" => false
					) );
					delete_user_meta( $user->ID, 'mo2f_external_app_type' );

					$session_variables = array( 'mo2f_google_auth' );
					MO2f_Utility::unset_session_variables( $session_variables );

				} else {
					$Mo2fdbQueries->update_user_details( $user->ID, array(
						'mo2f_miniOrangeQRCodeAuthentication_config_status' => false,
						'mo2f_miniOrangeSoftToken_config_status'            => false,
						'mo2f_miniOrangePushNotification_config_status'     => false
					) );
				}
				$Mo2fdbQueries->update_user_details( $user->ID, array( "mo2f_configured_2FA_method" => '' ) );

				update_option( 'mo2f_message', "" );
			}


			if ( isset( $_POST['option'] ) and $_POST['option'] == "mo_auth_sync_sms_transactions" ) {
				$customer = new Customer_Setup();
				$content  = json_decode( $customer->get_customer_transactions( get_option( 'mo2f_customerKey' ), get_option( 'mo2f_api_key' ) ), true );
				if ( ! array_key_exists( 'smsRemaining', $content ) ) {
					$smsRemaining = 0;
				} else {
					$smsRemaining = $content['smsRemaining'];

					if ( $smsRemaining == null ) {
						$smsRemaining = 0;
					}
				}

				update_option( 'mo2f_number_of_transactions', $smsRemaining );
			}


		} else {
			if ( isset( $_POST['option'] ) && $_POST['option'] == 'mo2f_step1_next' ) {
				update_user_meta( $user->ID, 'current_modal', 2 );
			}

			if ( isset( $_POST['option'] ) && $_POST['option'] == 'mo2f_skip_test' ) {
				update_user_meta( $user->ID, 'current_modal', 6 );
			}


			if ( isset( $_POST['option'] ) && $_POST['option'] == 'mo2f_skip_flow_driven_setup' ) {

				$current_modal = get_user_meta( $user->ID, 'current_modal', true );

				if ( $current_modal == 2 ) {
					delete_user_meta( $user->ID, 'mo2f_2FA_method_to_configure' );
				} else if ( $current_modal == 3 ) {
					delete_user_meta( $user->ID, 'mo2f_2FA_method_to_test' );
				} else if ( $current_modal == 6 ) {
					update_user_meta( $user->ID, 'current_modal', 0 );
				}

				update_user_meta( $user->ID, 'skipped_flow_driven_setup', 1 );

				update_option( 'mo2f_message', "" );

			}

			if ( isset( $_POST['option'] ) && $_POST['option'] == 'mo2f_back_to_previous_step' ) {
				update_user_meta( $user->ID, 'current_modal', get_user_meta( $user->ID, 'current_modal', true ) - 1 );
				$current_modal = get_user_meta( $user->ID, 'current_modal', true );

				if ( $current_modal == 2 ) {
					delete_user_meta( $user->ID, 'mo2f_2FA_method_to_configure' );
				} else if ( $current_modal == 3 ) {
					delete_user_meta( $user->ID, 'mo2f_2FA_method_to_test' );
				}

				update_option( 'mo2f_message', "" );
			}

			if ( isset( $_POST['option'] ) && $_POST['option'] == 'mo2f_go_back_to_reconfigure_2FA' ) {
				$configured_2FA_method = $Mo2fdbQueries->get_user_detail( 'mo2f_configured_2FA_method', $user->ID );

				$current_modal = get_user_meta( $user->ID, 'current_modal', true );

				update_user_meta( $user->ID, 'current_modal', $current_modal - 2 );
				update_user_meta( $user->ID, 'mo2f_2FA_method_to_configure', $configured_2FA_method );

				delete_user_meta( $user->ID, 'mo2f_2FA_method_to_test' );
				$Mo2fdbQueries->update_user_details( $user->ID, array( 'mo2f_' . str_replace( ' ', '', $configured_2FA_method ) . '_config_status' => false ) );

				if ( $configured_2FA_method == 'Google Authenticator' ) {
					$Mo2fdbQueries->update_user_details( $user->ID, array(
						"mo2f_GoogleAuthenticator_config_status" => false
					) );
					delete_user_meta( $user->ID, 'mo2f_external_app_type' );

				} else {
					$Mo2fdbQueries->update_user_details( $user->ID, array(
						'mo2f_miniOrangeQRCodeAuthentication_config_status' => false,
						'mo2f_miniOrangeSoftToken_config_status'            => false,
						'mo2f_miniOrangePushNotification_config_status'     => false
					) );
				}

				$Mo2fdbQueries->update_user_details( $user->ID, array( "mo2f_configured_2FA_method" => '' ) );

				update_option( 'mo2f_message', "" );
			}


			if ( isset( $_POST['miniorange_flow_driven_setup_2factor_method_nonce'] ) ) { // select 2 factor method during flow driven setup
				$nonce = $_POST['miniorange_flow_driven_setup_2factor_method_nonce'];
				if ( ! wp_verify_nonce( $nonce, 'miniorange-2-factor-flow-driven-setup-2factor-method-nonce' ) ) {
					update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "INVALID_REQ" ) );
				} else {
					$selected_2FA_method = $_POST['mo2f_selected_2factor_method'];

					//show configuration form of respective Two Factor method
					update_user_meta( $user->ID, 'mo2f_2FA_method_to_configure', $selected_2FA_method );
					update_user_meta( $user->ID, 'current_modal', 3 );

				}
			}
		}

		if ( isset( $_POST['option'] ) and $_POST['option'] == "mo_2factor_resend_user_otp" ) { //resend OTP over email for additional admin and non-admin user
			$customer = new Customer_Setup();
			$content  = json_decode( $customer->send_otp_token( get_user_meta( $user->ID, 'user_email', true ), 'EMAIL', get_option( 'mo2f_customerKey' ), get_option( 'mo2f_api_key' ) ), true );
			if ( strcasecmp( $content['status'], 'SUCCESS' ) == 0 ) {
				update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "OTP_SENT" ) . ' <b>' . ( get_user_meta( $user->ID, 'user_email', true ) ) . '</b>. ' . Mo2fConstants:: langTranslate( "ENTER_OTP" ) );
				update_user_meta( $user->ID, 'mo_2fa_verify_otp_create_account', $content['txId'] );
				$mo_2factor_user_registration_status = 'MO_2_FACTOR_OTP_DELIVERED_SUCCESS';
				$Mo2fdbQueries->update_user_details( $user->ID, array( 'mo_2factor_user_registration_status' => $mo_2factor_user_registration_status ) );
				$this->mo_auth_show_success_message();
			} else {
				update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "ERROR_IN_SENDING_EMAIL" ) );
				$mo_2factor_user_registration_status = 'MO_2_FACTOR_OTP_DELIVERED_FAILURE';
				$Mo2fdbQueries->update_user_details( $user->ID, array( 'mo_2factor_user_registration_status' => $mo_2factor_user_registration_status ) );
				$this->mo_auth_show_error_message();
			}

		}

		if ( isset( $_POST['option'] ) and ( $_POST['option'] == "mo2f_configure_miniorange_authenticator_validate" || $_POST['option'] == 'mo_auth_mobile_reconfiguration_complete' ) ) { //mobile registration successfully complete for all users

			delete_option( 'mo2f_transactionId' );
			$session_variables = array( 'mo2f_qrCode', 'mo2f_transactionId', 'mo2f_show_qr_code' );
			MO2f_Utility::unset_session_variables( $session_variables );

			$email                     = $Mo2fdbQueries->get_user_detail( 'mo2f_user_email', $user->ID );
			$TwoFA_method_to_configure = get_user_meta( $user->ID, 'mo2f_2FA_method_to_configure', true );
			$enduser                   = new Two_Factor_Setup();
			$current_method            = MO2f_Utility::mo2f_decode_2_factor( $TwoFA_method_to_configure, "server" );

			$response = json_decode( $enduser->mo2f_update_userinfo( $email, $current_method, null, null, null ), true );

			if ( json_last_error() == JSON_ERROR_NONE ) { /* Generate Qr code */
				if ( $response['status'] == 'ERROR' ) {
					update_option( 'mo2f_message', Mo2fConstants:: langTranslate( $response['message'] ) );

					if ( ! $is_flow_driven_setup ) {
						$this->mo_auth_show_error_message();
					}

				} else if ( $response['status'] == 'SUCCESS' ) {

					$selectedMethod = $TwoFA_method_to_configure;

					$message = '<b> ' . Mo2fConstants:: langTranslate( $selectedMethod ) . '</b> ' . Mo2fConstants:: langTranslate( "SET_AS_2ND_FACTOR" );
					update_option( 'mo2f_message', $message );

					delete_user_meta( $user->ID, 'mo2f_2FA_method_to_configure' );

					if ( $is_flow_driven_setup ) {
						update_user_meta( $user->ID, 'current_modal', 4 );
					}

					$Mo2fdbQueries->update_user_details( $user->ID, array(
						'mo2f_configured_2FA_method'                        => $selectedMethod,
						'mobile_registration_status'                        => true,
						'mo2f_miniOrangeQRCodeAuthentication_config_status' => true,
						'mo2f_miniOrangeSoftToken_config_status'            => true,
						'mo2f_miniOrangePushNotification_config_status'     => true,
						'user_registration_with_miniorange'                 => 'SUCCESS',
						'mo_2factor_user_registration_status'               => 'MO_2_FACTOR_PLUGIN_SETTINGS'
					) );

					if ( ! $is_flow_driven_setup ) {
						delete_user_meta( $user->ID, 'configure_2FA' );
						$this->mo_auth_show_success_message();
					}
				} else {
					update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "ERROR_DURING_PROCESS" ) );
					if ( ! $is_flow_driven_setup ) {
						$this->mo_auth_show_error_message();
					}
				}

			} else {
				update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "INVALID_REQ" ) );
				if ( ! $is_flow_driven_setup ) {
					$this->mo_auth_show_error_message();
				}
			}

		}

		if ( isset( $_POST['option'] ) and $_POST['option'] == 'mo2f_mobile_authenticate_success' ) { // mobile registration for all users(common)
			if ( current_user_can( 'manage_options' ) ) {
				update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "COMPLETED_TEST" ) );
			} else {
				update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "COMPLETED_TEST" ) );
			}

			if ( $is_flow_driven_setup ) {
				update_user_meta( $user->ID, 'current_modal', 6 );
				update_option( 'mo2f_message', "" );
			}

			$session_variables = array( 'mo2f_qrCode', 'mo2f_transactionId', 'mo2f_show_qr_code' );
			MO2f_Utility::unset_session_variables( $session_variables );

			if ( ! $is_flow_driven_setup ) {
				delete_user_meta( $user->ID, 'test_2FA' );
				$this->mo_auth_show_success_message();
			}


		}

		if ( isset( $_POST['option'] ) and $_POST['option'] == 'mo2f_mobile_authenticate_error' ) { //mobile registration failed for all users(common)
			update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "AUTHENTICATION_FAILED" ) );
			MO2f_Utility::unset_session_variables( 'mo2f_show_qr_code' );
			if ( ! $is_flow_driven_setup ) {
				$this->mo_auth_show_error_message();
			}
		}

		if ( isset( $_POST['option'] ) and $_POST['option'] == "mo_auth_setting_configuration" )  // redirect to setings page
		{
			$Mo2fdbQueries->update_user_details( $user->ID, array( 'mo_2factor_user_registration_status' => 'MO_2_FACTOR_PLUGIN_SETTINGS' ) );

		}

		if ( isset( $_POST['option'] ) and $_POST['option'] == "mo_auth_refresh_mobile_qrcode" ) { // refrsh Qrcode for all users

			$mo_2factor_user_registration_status = $Mo2fdbQueries->get_user_detail( 'mo_2factor_user_registration_status', $user->ID );
			if ( in_array( $mo_2factor_user_registration_status, array(
				'MO_2_FACTOR_INITIALIZE_TWO_FACTOR',
				'MO_2_FACTOR_INITIALIZE_MOBILE_REGISTRATION',
				'MO_2_FACTOR_PLUGIN_SETTINGS'
			) ) ) {
				$email = $Mo2fdbQueries->get_user_detail( 'mo2f_user_email', $user->ID );
				$this->mo2f_get_qr_code_for_mobile( $email, $user->ID );
			} else {
				update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "REGISTER_WITH_MO" ) );
				if ( ! $is_flow_driven_setup ) {
					$this->mo_auth_show_error_message();
				}
			}
		}

		if ( isset( $_POST['miniorange_get_started'] ) && isset( $_POST['miniorange_user_reg_nonce'] ) ) { //registration with miniOrange for additional admin and non-admin
			$nonce = $_POST['miniorange_user_reg_nonce'];
			$Mo2fdbQueries->insert_user( $user_id, array( 'user_id' => $user_id ) );
			if ( ! wp_verify_nonce( $nonce, 'miniorange-2-factor-user-reg-nonce' ) ) {
				update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "INVALID_REQ" ) );
			} else {
				$email = '';
				if ( MO2f_Utility::mo2f_check_empty_or_null( $_POST['mo_useremail'] ) ) {
					update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "ENTER_EMAILID" ) );

					return;
				} else {
					$email = sanitize_email( $_POST['mo_useremail'] );
				}

				if ( ! MO2f_Utility::check_if_email_is_already_registered( $email ) ) {
					update_user_meta( $user->ID, 'user_email', $email );

					$enduser    = new Two_Factor_Setup();
					$check_user = json_decode( $enduser->mo_check_user_already_exist( $email ), true );

					if ( json_last_error() == JSON_ERROR_NONE ) {
						if ( $check_user['status'] == 'ERROR' ) {
							update_option( 'mo2f_message', Mo2fConstants:: langTranslate( $check_user['message'] ) );
							$this->mo_auth_show_error_message();

							return;
						} else if ( strcasecmp( $check_user['status'], 'USER_FOUND_UNDER_DIFFERENT_CUSTOMER' ) == 0 ) {
							update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "EMAIL_IN_USE" ) );
							$this->mo_auth_show_error_message();

							return;
						} else if ( strcasecmp( $check_user['status'], 'USER_FOUND' ) == 0 || strcasecmp( $check_user['status'], 'USER_NOT_FOUND' ) == 0 ) {


							$enduser = new Customer_Setup();
							$content = json_decode( $enduser->send_otp_token( $email, 'EMAIL', get_option( 'mo2f_customerKey' ), get_option( 'mo2f_api_key' ) ), true );
							if ( strcasecmp( $content['status'], 'SUCCESS' ) == 0 ) {
								update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "OTP_SENT" ) . ' <b>' . ( $email ) . '</b>. ' . Mo2fConstants:: langTranslate( "ENTER_OTP" ) );
								$_SESSION['mo2f_transactionId'] = $content['txId'];
								update_option( 'mo2f_transactionId', $content['txId'] );
								$mo_2factor_user_registration_status = 'MO_2_FACTOR_OTP_DELIVERED_SUCCESS';
								$Mo2fdbQueries->update_user_details( $user->ID, array( 'mo_2factor_user_registration_status' => $mo_2factor_user_registration_status ) );
								update_user_meta( $user->ID, 'mo_2fa_verify_otp_create_account', $content['txId'] );
								$this->mo_auth_show_success_message();
							} else {
								$mo_2factor_user_registration_status = 'MO_2_FACTOR_OTP_DELIVERED_FAILURE';
								$Mo2fdbQueries->update_user_details( $user->ID, array( 'mo_2factor_user_registration_status' => $mo_2factor_user_registration_status ) );
								update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "ERROR_IN_SENDING_OTP_OVER_EMAIL" ) );
								$this->mo_auth_show_error_message();
							}


						}
					}
				} else {
					update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "EMAIL_IN_USE" ) );
					$this->mo_auth_show_error_message();
				}
			}
		}

		if ( isset( $_POST['miniorange_flow_driven_setup_2factor_method_nonce'] ) ) { // select 2 factor method during flow driven setup
			$nonce = $_POST['miniorange_flow_driven_setup_2factor_method_nonce'];
			if ( ! wp_verify_nonce( $nonce, 'miniorange-2-factor-flow-driven-setup-2factor-method-nonce' ) ) {
				update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "INVALID_REQ" ) );
			} else {
				$selected_2FA_method = $_POST['mo2f_selected_2factor_method'];

				//show configuration form of respective Two Factor method
				update_user_meta( $user->ID, 'mo2f_2FA_method_to_configure', $selected_2FA_method );
				update_user_meta( $user->ID, 'current_modal', 3 );

			}
		}

		if ( isset( $_POST['option'] ) and $_POST['option'] == 'mo_2factor_backto_user_registration' ) { //back to registration page for additional admin and non-admin
			delete_user_meta( $user->ID, 'user_email' );
			$Mo2fdbQueries->delete_user_details( $user->ID );
			MO2f_Utility::unset_session_variables( 'mo2f_transactionId' );
			delete_option( 'mo2f_transactionId' );


		}

		if ( isset( $_POST['option'] ) && $_POST['option'] == 'mo2f_validate_soft_token' ) {  // validate Soft Token during test for all users
			$otp_token = '';
			if ( MO2f_Utility::mo2f_check_empty_or_null( $_POST['otp_token'] ) ) {
				update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "ENTER_VALUE" ) );
				$this->mo_auth_show_error_message();

				return;
			} else {
				$otp_token = sanitize_text_field( $_POST['otp_token'] );
			}
			$email    = $Mo2fdbQueries->get_user_detail( 'mo2f_user_email', $user->ID );
			$customer = new Customer_Setup();
			$content  = json_decode( $customer->validate_otp_token( 'SOFT TOKEN', $email, null, $otp_token, get_option( 'mo2f_customerKey' ), get_option( 'mo2f_api_key' ) ), true );
			if ( $content['status'] == 'ERROR' ) {
				update_option( 'mo2f_message', Mo2fConstants:: langTranslate( $content['message'] ) );
				if ( ! $is_flow_driven_setup ) {
					$this->mo_auth_show_error_message();
				}
			} else {
				if ( strcasecmp( $content['status'], 'SUCCESS' ) == 0 ) { //OTP validated and generate QRCode
					update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "COMPLETED_TEST" ) );

					if ( ! $is_flow_driven_setup ) {
						delete_user_meta( $user->ID, 'test_2FA' );
						$this->mo_auth_show_success_message();
					} else {
						update_user_meta( $user->ID, 'current_modal', 6 );
						update_option( 'mo2f_message', "" );
					}

				} else {  // OTP Validation failed.
					update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "INVALID_OTP" ) );
					if ( ! $is_flow_driven_setup ) {
						$this->mo_auth_show_error_message();
					}
				}
			}
		}

		if ( isset( $_POST['option'] ) && $_POST['option'] == 'mo2f_validate_otp_over_sms' ) { //validate otp over sms and phone call during test for all users
			$otp_token = '';
			if ( MO2f_Utility::mo2f_check_empty_or_null( $_POST['otp_token'] ) ) {
				update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "ENTER_VALUE" ) );
				$this->mo_auth_show_error_message();

				return;
			} else {
				$otp_token = sanitize_text_field( $_POST['otp_token'] );
			}

			//if the php session folder has insufficient permissions, temporary options to be used
			$mo2f_transactionId        = isset( $_SESSION['mo2f_transactionId'] ) && ! empty( $_SESSION['mo2f_transactionId'] ) ? $_SESSION['mo2f_transactionId'] : get_option( 'mo2f_transactionId' );
			$email                     = $Mo2fdbQueries->get_user_detail( 'mo2f_user_email', $user->ID );
			$selected_2_2factor_method = $Mo2fdbQueries->get_user_detail( 'mo2f_user_email', $user->ID );
			$customer                  = new Customer_Setup();
			$content                   = json_decode( $customer->validate_otp_token( get_user_meta( $user->ID, 'mo2f_2FA_method_to_configure', true ), $email, $mo2f_transactionId, $otp_token, get_option( 'mo2f_customerKey' ), get_option( 'mo2f_api_key' ) ), true );

			if ( $content['status'] == 'ERROR' ) {
				update_option( 'mo2f_message', Mo2fConstants:: langTranslate( $content['message'] ) );
				$this->mo_auth_show_error_message();
			} else {
				if ( strcasecmp( $content['status'], 'SUCCESS' ) == 0 ) { //OTP validated
					if ( current_user_can( 'manage_options' ) ) {
						update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "COMPLETED_TEST" ) );
					} else {
						update_option( 'mo2f_message', Mo2fConstants::langTranslate( "COMPLETED_TEST" ) );
					}

					delete_user_meta( $user->ID, 'test_2FA' );
					$this->mo_auth_show_success_message();

				} else {  // OTP Validation failed.
					update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "INVALID_OTP" ) );
					$this->mo_auth_show_error_message();
				}

			}
		}

		if ( isset( $_POST['option'] ) && $_POST['option'] == 'mo2f_out_of_band_success' ) {

			if ( $is_flow_driven_setup ) {
				update_user_meta( $user->ID, 'current_modal', 6 );
				update_option( 'mo2f_message', "" );
			}
			$mo2f_configured_2FA_method           = $Mo2fdbQueries->get_user_detail( 'mo2f_configured_2FA_method', $user->ID );
			$mo2f_EmailVerification_config_status = $Mo2fdbQueries->get_user_detail( 'mo2f_EmailVerification_config_status', $user->ID );
			if ( ! current_user_can( 'manage_options' ) && $mo2f_configured_2FA_method == 'OUT OF BAND EMAIL' ) {
				if ( $mo2f_EmailVerification_config_status ) {
					update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "COMPLETED_TEST" ) );
				} else {
					$email    = $Mo2fdbQueries->get_user_detail( 'mo2f_user_email', $user->ID );
					$enduser  = new Two_Factor_Setup();
					$response = json_decode( $enduser->mo2f_update_userinfo( $email, $mo2f_configured_2FA_method, null, null, null ), true );
					update_option( 'mo2f_message', '<b> ' . Mo2fConstants:: langTranslate( "EMAIL_VERFI" ) . '</b> ' . Mo2fConstants:: langTranslate( "SET_AS_2ND_FACTOR" ) );
				}
			} else {
				update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "COMPLETED_TEST" ) );
			}
			delete_user_meta( $user->ID, 'test_2FA' );
			if ( ! $is_flow_driven_setup ) {

				$Mo2fdbQueries->update_user_details( $user->ID, array(
					'mo_2factor_user_registration_status'  => 'MO_2_FACTOR_PLUGIN_SETTINGS',
					'mo2f_EmailVerification_config_status' => true
				) );

				$this->mo_auth_show_success_message();
			}

		}

		if ( isset( $_POST['option'] ) and $_POST['option'] == 'mo2f_out_of_band_error' ) { //push and out of band email denied
			update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "DENIED_REQUEST" ) );
			delete_user_meta( $user->ID, 'test_2FA' );
			$Mo2fdbQueries->update_user_details( $user->ID, array(
				'mo_2factor_user_registration_status'  => 'MO_2_FACTOR_PLUGIN_SETTINGS',
				'mo2f_EmailVerification_config_status' => true
			) );
			if ( $is_flow_driven_setup ) {
				update_user_meta( $user->ID, 'current_modal', get_user_meta( $user->ID, 'current_modal', true ) - 1 );
			}
			if ( ! $is_flow_driven_setup ) {
				$this->mo_auth_show_error_message();
			}
		}

		if ( isset( $_POST['option'] ) && $_POST['option'] == 'mo2f_validate_google_authy_test' ) {

			$otp_token = '';
			if ( MO2f_Utility::mo2f_check_empty_or_null( $_POST['otp_token'] ) ) {
				update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "ENTER_VALUE" ) );
				$this->mo_auth_show_error_message();

				return;
			} else {
				$otp_token = sanitize_text_field( $_POST['otp_token'] );
			}
			$email    = $Mo2fdbQueries->get_user_detail( 'mo2f_user_email', $user->ID );
			$customer = new Customer_Setup();
			$content  = json_decode( $customer->validate_otp_token( 'GOOGLE AUTHENTICATOR', $email, null, $otp_token, get_option( 'mo2f_customerKey' ), get_option( 'mo2f_api_key' ) ), true );
			if ( json_last_error() == JSON_ERROR_NONE ) {

				if ( strcasecmp( $content['status'], 'SUCCESS' ) == 0 ) { //Google OTP validated
					if ( ! $is_flow_driven_setup ) {
						if ( current_user_can( 'manage_options' ) ) {
							update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "COMPLETED_TEST" ) );
						} else {
							update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "COMPLETED_TEST" ) );
						}

						delete_user_meta( $user->ID, 'test_2FA' );
						if ( ! $is_flow_driven_setup ) {
							$this->mo_auth_show_success_message();
						}
					} else {
						update_user_meta( $user->ID, 'current_modal', 6 );
						update_option( 'mo2f_message', "" );
					}

				} else {  // OTP Validation failed.
					update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "INVALID_OTP" ) );
					if ( ! $is_flow_driven_setup ) {
						$this->mo_auth_show_error_message();
					}
				}
			} else {
				update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "ERROR_WHILE_VALIDATING_OTP" ) );
				if ( ! $is_flow_driven_setup ) {
					$this->mo_auth_show_error_message();
				}
			}
		}

		if ( isset( $_POST['option'] ) && $_POST['option'] == 'mo2f_configure_google_auth_phone_type' ) {
			$email           = $Mo2fdbQueries->get_user_detail( 'mo2f_user_email', $user->ID );
			$phone_type      = $_POST['mo2f_app_type_radio'];
			$google_auth     = new Miniorange_Rba_Attributes();
			$google_response = json_decode( $google_auth->mo2f_google_auth_service( $email ), true );
			if ( json_last_error() == JSON_ERROR_NONE ) {
				if ( $google_response['status'] == 'SUCCESS' ) {
					$mo2f_google_auth              = array();
					$mo2f_google_auth['ga_qrCode'] = $google_response['qrCodeData'];
					$mo2f_google_auth['ga_secret'] = $google_response['secret'];
					$mo2f_google_auth['ga_phone']  = $phone_type;
					$_SESSION['mo2f_google_auth']  = $mo2f_google_auth;
				} else {
					update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "ERROR_DURING_USER_REGISTRATION" ) );
					if ( ! $is_flow_driven_setup ) {
						$this->mo_auth_show_error_message();
					}
				}
			} else {
				update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "ERROR_DURING_USER_REGISTRATION" ) );
				if ( ! $is_flow_driven_setup ) {
					$this->mo_auth_show_error_message();
				}
			}
		}

		if ( isset( $_POST['option'] ) && $_POST['option'] == 'mo2f_configure_google_authenticator_validate' ) {
			$otpToken  = $_POST['google_token'];
			$ga_secret = isset( $_POST['google_auth_secret'] ) ? $_POST['google_auth_secret'] : null;
			if ( MO2f_Utility::mo2f_check_number_length( $otpToken ) ) {
				$email           = $Mo2fdbQueries->get_user_detail( 'mo2f_user_email', $user->ID );
				$google_auth     = new Miniorange_Rba_Attributes();
				$google_response = json_decode( $google_auth->mo2f_validate_google_auth( $email, $otpToken, $ga_secret ), true );
				if ( json_last_error() == JSON_ERROR_NONE ) {
					if ( $google_response['status'] == 'SUCCESS' ) {
						$enduser  = new Two_Factor_Setup();
						$response = json_decode( $enduser->mo2f_update_userinfo( $email, "GOOGLE AUTHENTICATOR", null, null, null ), true );


						if ( json_last_error() == JSON_ERROR_NONE ) {

							if ( $response['status'] == 'SUCCESS' ) {
								if ( $is_flow_driven_setup ) {
									update_user_meta( $user->ID, 'current_modal', 4 );
									update_option( 'mo2f_message', '' );
								}


								delete_user_meta( $user->ID, 'mo2f_2FA_method_to_configure' );

								delete_user_meta( $user->ID, 'configure_2FA' );

								$Mo2fdbQueries->update_user_details( $user->ID, array(
									'mo2f_GoogleAuthenticator_config_status' => true,
									'mo2f_AuthyAuthenticator_config_status'  => false,
									'mo2f_configured_2FA_method'             => "Google Authenticator",
									'user_registration_with_miniorange'      => 'SUCCESS',
									'mo_2factor_user_registration_status'    => 'MO_2_FACTOR_PLUGIN_SETTINGS'
								) );

								update_user_meta( $user->ID, 'mo2f_external_app_type', "Google Authenticator" );
								if ( ! $is_flow_driven_setup ) {
									$message = '<b> ' . Mo2fConstants:: langTranslate( "G_AUTH" ) . '</b> ' . Mo2fConstants:: langTranslate( "SET_AS_2ND_FACTOR" );
									update_option( 'mo2f_message', $message );
									$this->mo_auth_show_success_message();
								}

							} else {
								update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "ERROR_DURING_PROCESS" ) );
								if ( ! $is_flow_driven_setup ) {
									$this->mo_auth_show_error_message();
								}
							}
						} else {
							update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "ERROR_DURING_PROCESS" ) );
							if ( ! $is_flow_driven_setup ) {
								$this->mo_auth_show_error_message();
							}
						}
					} else {
						update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "ERROR_IN_SENDING_OTP_CAUSES" ) . '<br>1. ' . Mo2fConstants:: langTranslate( "INVALID_OTP" ) . '<br>2. ' . Mo2fConstants:: langTranslate( "APP_TIME_SYNC" ) );
						if ( ! $is_flow_driven_setup ) {
							$this->mo_auth_show_error_message();
						}
					}
				} else {
					update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "ERROR_WHILE_VALIDATING_USER" ) );
					if ( ! $is_flow_driven_setup ) {
						$this->mo_auth_show_error_message();
					}
				}
			} else {
				update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "ONLY_DIGITS_ALLOWED" ) );
				if ( ! $is_flow_driven_setup ) {
					$this->mo_auth_show_error_message();
				}
			}
		}


		if ( isset( $_POST['option'] ) && $_POST['option'] == 'mo2f_configure_authy_authenticator' ) {
			$authy          = new Miniorange_Rba_Attributes();
			$user_email     = $Mo2fdbQueries->get_user_detail( 'mo2f_user_email', $user->ID );
			$authy_response = json_decode( $authy->mo2f_google_auth_service( $user_email ), true );
			if ( json_last_error() == JSON_ERROR_NONE ) {
				if ( $authy_response['status'] == 'SUCCESS' ) {
					$mo2f_authy_keys                      = array();
					$mo2f_authy_keys['authy_qrCode']      = $authy_response['qrCodeData'];
					$mo2f_authy_keys['mo2f_authy_secret'] = $authy_response['secret'];
					$_SESSION['mo2f_authy_keys']          = $mo2f_authy_keys;
				} else {
					update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "ERROR_DURING_USER_REGISTRATION" ) );
					$this->mo_auth_show_error_message();
				}
			} else {
				update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "ERROR_DURING_USER_REGISTRATION" ) );
				$this->mo_auth_show_error_message();
			}
		}

		if ( isset( $_POST['option'] ) && $_POST['option'] == 'mo2f_configure_authy_authenticator_validate' ) {
			$otpToken     = $_POST['mo2f_authy_token'];
			$authy_secret = isset( $_POST['mo2f_authy_secret'] ) ? $_POST['mo2f_authy_secret'] : null;
			if ( MO2f_Utility::mo2f_check_number_length( $otpToken ) ) {
				$email          = $Mo2fdbQueries->get_user_detail( 'mo2f_user_email', $user->ID );
				$authy_auth     = new Miniorange_Rba_Attributes();
				$authy_response = json_decode( $authy_auth->mo2f_validate_google_auth( $email, $otpToken, $authy_secret ), true );
				if ( json_last_error() == JSON_ERROR_NONE ) {
					if ( $authy_response['status'] == 'SUCCESS' ) {
						$enduser  = new Two_Factor_Setup();
						$response = json_decode( $enduser->mo2f_update_userinfo( $email, 'GOOGLE AUTHENTICATOR', null, null, null ), true );
						if ( json_last_error() == JSON_ERROR_NONE ) {

							if ( $response['status'] == 'SUCCESS' ) {
								$Mo2fdbQueries->update_user_details( $user->ID, array(
									'mo2f_GoogleAuthenticator_config_status' => false,
									'mo2f_AuthyAuthenticator_config_status'  => true,
									'mo2f_configured_2FA_method'             => "Authy Authenticator",
									'user_registration_with_miniorange'      => 'SUCCESS',
									'mo_2factor_user_registration_status'    => 'MO_2_FACTOR_PLUGIN_SETTINGS'
								) );
								update_user_meta( $user->ID, 'mo2f_external_app_type', "Authy Authenticator" );
								$message = '<b>Authy 2-Factor Authentication</b> has been set as your 2nd factor method.';
								delete_user_meta( $user->ID, 'mo2f_2FA_method_to_configure' );
								delete_user_meta( $user->ID, 'configure_2FA' );
								update_option( 'mo2f_message', $message );
								$this->mo_auth_show_success_message();


							} else {
								update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "ERROR_DURING_PROCESS" ) );
								$this->mo_auth_show_error_message();
							}
						} else {
							update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "ERROR_DURING_PROCESS" ) );
							$this->mo_auth_show_error_message();
						}
					} else {
						update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "ERROR_IN_SENDING_OTP_CAUSES" ) . '<br>1. ' . Mo2fConstants:: langTranslate( "INVALID_OTP" ) . '<br>2. ' . Mo2fConstants:: langTranslate( "APP_TIME_SYNC" ) );
						$this->mo_auth_show_error_message();
					}
				} else {
					update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "ERROR_WHILE_VALIDATING_USER" ) );
					$this->mo_auth_show_error_message();
				}
			} else {
				update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "ONLY_DIGITS_ALLOWED" ) );
				$this->mo_auth_show_error_message();
			}
		}

		if ( isset( $_POST['option'] ) && $_POST['option'] == 'mo2f_save_kba' ) {

			if ( MO2f_Utility::mo2f_check_empty_or_null( $_POST['mo2f_kbaquestion_1'] ) || MO2f_Utility::mo2f_check_empty_or_null( $_POST['mo2f_kba_ans1'] ) || MO2f_Utility::mo2f_check_empty_or_null( $_POST['mo2f_kbaquestion_2'] ) || MO2f_Utility::mo2f_check_empty_or_null( $_POST['mo2f_kba_ans2'] ) || MO2f_Utility::mo2f_check_empty_or_null( $_POST['mo2f_kbaquestion_3'] ) || MO2f_Utility::mo2f_check_empty_or_null( $_POST['mo2f_kba_ans3'] ) ) {
				update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "INVALID_ENTRY" ) );
				if ( ! $is_flow_driven_setup ) {
					$this->mo_auth_show_error_message();
				}

				return;
			}

			$kba_q1 = $_POST['mo2f_kbaquestion_1'];
			$kba_a1 = sanitize_text_field( $_POST['mo2f_kba_ans1'] );
			$kba_q2 = $_POST['mo2f_kbaquestion_2'];
			$kba_a2 = sanitize_text_field( $_POST['mo2f_kba_ans2'] );
			$kba_q3 = sanitize_text_field( $_POST['mo2f_kbaquestion_3'] );
			$kba_a3 = sanitize_text_field( $_POST['mo2f_kba_ans3'] );


			if ( strcasecmp( $kba_q1, $kba_q2 ) == 0 || strcasecmp( $kba_q2, $kba_q3 ) == 0 || strcasecmp( $kba_q3, $kba_q1 ) == 0 ) {
				update_option( 'mo2f_message', 'The questions you select must be unique.' );
				if ( ! $is_flow_driven_setup ) {
					$this->mo_auth_show_error_message();
				}

				return;
			}
			$kba_q1 = addcslashes( stripslashes( $kba_q1 ), '"\\' );
			$kba_a1 = addcslashes( stripslashes( $kba_a1 ), '"\\' );
			$kba_q2 = addcslashes( stripslashes( $kba_q2 ), '"\\' );
			$kba_a2 = addcslashes( stripslashes( $kba_a2 ), '"\\' );
			$kba_q3 = addcslashes( stripslashes( $kba_q3 ), '"\\' );
			$kba_a3 = addcslashes( stripslashes( $kba_a3 ), '"\\' );

			$email            = $Mo2fdbQueries->get_user_detail( 'mo2f_user_email', $user->ID );
			$kba_registration = new Two_Factor_Setup();
			$kba_reg_reponse  = json_decode( $kba_registration->register_kba_details( $email, $kba_q1, $kba_a1, $kba_q2, $kba_a2, $kba_q3, $kba_a3 ), true );
			if ( json_last_error() == JSON_ERROR_NONE ) {
				if ( $kba_reg_reponse['status'] == 'SUCCESS' ) {
					if ( isset( $_POST['mobile_kba_option'] ) && $_POST['mobile_kba_option'] == 'mo2f_request_for_kba_as_emailbackup' ) {
						MO2f_Utility::unset_session_variables( 'mo2f_mobile_support' );

						delete_user_meta( $user->ID, 'configure_2FA' );
						delete_user_meta( $user->ID, 'mo2f_2FA_method_to_configure' );

						$message = mo2f_lt( 'Your KBA as alternate 2 factor is configured successfully.' );
						update_option( 'mo2f_message', $message );
						if ( ! $is_flow_driven_setup ) {
							$this->mo_auth_show_success_message();
						}
					} else {
						$enduser  = new Two_Factor_Setup();
						$response = json_decode( $enduser->mo2f_update_userinfo( $email, 'KBA', null, null, null ), true );
						if ( json_last_error() == JSON_ERROR_NONE ) {
							if ( $response['status'] == 'ERROR' ) {
								update_option( 'mo2f_message', Mo2fConstants:: langTranslate( $response['message'] ) );
								if ( ! $is_flow_driven_setup ) {
									$this->mo_auth_show_error_message();
								}
							} else if ( $response['status'] == 'SUCCESS' ) {
								delete_user_meta( $user->ID, 'configure_2FA' );

								$Mo2fdbQueries->update_user_details( $user->ID, array(
									'mo2f_SecurityQuestions_config_status' => true,
									'mo2f_configured_2FA_method'           => "Security Questions",
									'mo_2factor_user_registration_status'  => "MO_2_FACTOR_PLUGIN_SETTINGS"
								) );

								$authType = 'Security Questions';
								$message  = '<b> ' . $authType . ' </b> ' . Mo2fConstants:: langTranslate( "SET_AS_2ND_FACTOR" );
								update_option( 'mo2f_message', $message );

								if ( ! $is_flow_driven_setup ) {
									$this->mo_auth_show_success_message();
								} else {
									update_user_meta( $user->ID, 'current_modal', 4 );
								}

							} else {
								update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "ERROR_DURING_PROCESS" ) );
								if ( ! $is_flow_driven_setup ) {
									$this->mo_auth_show_error_message();
								}
							}
						} else {
							update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "INVALID_REQ" ) );
							if ( ! $is_flow_driven_setup ) {
								$this->mo_auth_show_error_message();
							}
						}
					}
				} else {
					update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "ERROR_WHILE_SAVING_KBA" ) );
					if ( ! $is_flow_driven_setup ) {
						$this->mo_auth_show_error_message();
					}

					return;
				}
			} else {
				update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "ERROR_WHILE_SAVING_KBA" ) );
				if ( ! $is_flow_driven_setup ) {
					$this->mo_auth_show_error_message();
				}

				return;
			}

		}


		if ( isset( $_POST['option'] ) && $_POST['option'] == 'mo2f_validate_kba_details' ) {

			$kba_ans_1 = '';
			$kba_ans_2 = '';
			if ( MO2f_Utility::mo2f_check_empty_or_null( $_POST['mo2f_answer_1'] ) || MO2f_Utility::mo2f_check_empty_or_null( $_POST['mo2f_answer_1'] ) ) {
				update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "INVALID_ENTRY" ) );
				if ( ! $is_flow_driven_setup ) {
					$this->mo_auth_show_error_message();
				}

				return;
			} else {
				$kba_ans_1 = sanitize_text_field( $_POST['mo2f_answer_1'] );
				$kba_ans_2 = sanitize_text_field( $_POST['mo2f_answer_2'] );
			}

			//if the php session folder has insufficient permissions, temporary options to be used
			$kba_questions = isset( $_SESSION['mo_2_factor_kba_questions'] ) && ! empty( $_SESSION['mo_2_factor_kba_questions'] ) ? $_SESSION['mo_2_factor_kba_questions'] : get_option( 'kba_questions' );

			$kbaAns    = array();
			$kbaAns[0] = $kba_questions[0];
			$kbaAns[1] = $kba_ans_1;
			$kbaAns[2] = $kba_questions[1];
			$kbaAns[3] = $kba_ans_2;

			//if the php session folder has insufficient permissions, temporary options to be used
			$mo2f_transactionId = isset( $_SESSION['mo2f_transactionId'] ) && ! empty( $_SESSION['mo2f_transactionId'] ) ? $_SESSION['mo2f_transactionId'] : get_option( 'mo2f_transactionId' );

			$kba_validate          = new Customer_Setup();
			$kba_validate_response = json_decode( $kba_validate->validate_otp_token( 'KBA', null, $mo2f_transactionId, $kbaAns, get_option( 'mo2f_customerKey' ), get_option( 'mo2f_api_key' ) ), true );

			if ( json_last_error() == JSON_ERROR_NONE ) {
				if ( strcasecmp( $kba_validate_response['status'], 'SUCCESS' ) == 0 ) {
					update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "COMPLETED_TEST" ) );
					delete_user_meta( $user->ID, 'test_2FA' );
					if ( ! $is_flow_driven_setup ) {
						$this->mo_auth_show_success_message();
					} else {
						update_option( 'mo2f_message', "" );
						update_user_meta( $user->ID, 'current_modal', 6 );
					}
				} else {  // KBA Validation failed.
					update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "INVALID_ANSWERS" ) );
					if ( ! $is_flow_driven_setup ) {
						$this->mo_auth_show_error_message();
					}
				}
			}
		}


		if ( isset( $_POST['option'] ) && $_POST['option'] == 'mo2f_configure_otp_over_sms_send_otp' ) { // sendin otp for configuring OTP over SMS
			$phone = sanitize_text_field( $_POST['verify_phone'] );

			if ( MO2f_Utility::mo2f_check_empty_or_null( $phone ) ) {
				update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "INVALID_ENTRY" ) );
				$this->mo_auth_show_error_message();

				return;
			}

			$phone                  = str_replace( ' ', '', $phone );
			$_SESSION['user_phone'] = $phone;
			update_option( 'user_phone_temp', $phone );
			$customer      = new Customer_Setup();
			$currentMethod = "SMS";

			$content = json_decode( $customer->send_otp_token( $phone, $currentMethod, get_option( 'mo2f_customerKey' ), get_option( 'mo2f_api_key' ) ), true );

			if ( json_last_error() == JSON_ERROR_NONE ) { /* Generate otp token */
				if ( $content['status'] == 'ERROR' ) {
					update_option( 'mo2f_message', Mo2fConstants:: langTranslate( $response['message'] ) );
					$this->mo_auth_show_error_message();
				} else if ( $content['status'] == 'SUCCESS' ) {
					$_SESSION['mo2f_transactionId'] = $content['txId'];
					update_option( 'mo2f_transactionId', $content['txId'] );
					update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "OTP_SENT" ) . ' ' . $phone . ' .' . Mo2fConstants:: langTranslate( "ENTER_OTP" ) );
					update_option( 'mo2f_number_of_transactions', get_option( 'mo2f_number_of_transactions' ) - 1 );
					$this->mo_auth_show_success_message();
				} else {
					update_option( 'mo2f_message', Mo2fConstants::langTranslate( $content['message'] ) );
					$this->mo_auth_show_error_message();
				}

			} else {
				update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "INVALID_REQ" ) );
				$this->mo_auth_show_error_message();
			}
		}

		if ( isset( $_POST['option'] ) && $_POST['option'] == 'mo2f_configure_otp_over_sms_validate' ) {
			$otp_token = '';
			if ( MO2f_Utility::mo2f_check_empty_or_null( $_POST['otp_token'] ) ) {
				update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "INVALID_ENTRY" ) );
				$this->mo_auth_show_error_message();

				return;
			} else {
				$otp_token = sanitize_text_field( $_POST['otp_token'] );
			}

			//if the php session folder has insufficient permissions, temporary options to be used
			$mo2f_transactionId         = isset( $_SESSION['mo2f_transactionId'] ) && ! empty( $_SESSION['mo2f_transactionId'] ) ? $_SESSION['mo2f_transactionId'] : get_option( 'mo2f_transactionId' );
			$user_phone                 = isset( $_SESSION['user_phone'] ) && $_SESSION['user_phone'] != 'false' ? $_SESSION['user_phone'] : get_option( 'user_phone_temp' );
			$mo2f_configured_2FA_method = $Mo2fdbQueries->get_user_detail( 'mo2f_configured_2FA_method', $user->ID );
			$phone                      = $Mo2fdbQueries->get_user_detail( 'mo2f_user_phone', $user->ID );
			$customer                   = new Customer_Setup();
			$content                    = json_decode( $customer->validate_otp_token( $mo2f_configured_2FA_method, null, $mo2f_transactionId, $otp_token, get_option( 'mo2f_customerKey' ), get_option( 'mo2f_api_key' ) ), true );

			if ( $content['status'] == 'ERROR' ) {
				update_option( 'mo2f_message', Mo2fConstants:: langTranslate( $content['message'] ) );

			} else if ( strcasecmp( $content['status'], 'SUCCESS' ) == 0 ) { //OTP validated
				if ( $phone && strlen( $phone ) >= 4 ) {
					if ( $user_phone != $phone ) {
						$Mo2fdbQueries->update_user_details( $user->ID, array( 'mobile_registration_status' => false ) );

					}
				}
				$email = $Mo2fdbQueries->get_user_detail( 'mo2f_user_email', $user->ID );

				$enduser                   = new Two_Factor_Setup();
				$TwoFA_method_to_configure = get_user_meta( $user->ID, 'mo2f_2FA_method_to_configure', true );
				$current_method            = MO2f_Utility::mo2f_decode_2_factor( $TwoFA_method_to_configure, "server" );
				$response                  = json_decode( $enduser->mo2f_update_userinfo( $email, $current_method, $user_phone, null, null ), true );

				if ( json_last_error() == JSON_ERROR_NONE ) {

					if ( $response['status'] == 'ERROR' ) {
						MO2f_Utility::unset_session_variables( 'user_phone' );
						delete_option( 'user_phone_temp' );

						update_option( 'mo2f_message', Mo2fConstants:: langTranslate( $response['message'] ) );
						$this->mo_auth_show_error_message();
					} else if ( $response['status'] == 'SUCCESS' ) {

						$Mo2fdbQueries->update_user_details( $user->ID, array(
							'mo2f_configured_2FA_method'          => 'OTP Over SMS',
							'mo2f_OTPOverSMS_config_status'       => true,
							'user_registration_with_miniorange'   => 'SUCCESS',
							'mo_2factor_user_registration_status' => 'MO_2_FACTOR_PLUGIN_SETTINGS',
							'mo2f_user_phone'                     => $user_phone
						) );

						delete_user_meta( $user->ID, 'configure_2FA' );
						delete_user_meta( $user->ID, 'mo2f_2FA_method_to_configure' );

						unset( $_SESSION['user_phone'] );
						MO2f_Utility::unset_session_variables( 'user_phone' );
						delete_option( 'user_phone_temp' );

						$message = '<b> OTP Over SMS </b> ' . Mo2fConstants:: langTranslate( "SET_AS_2ND_FACTOR" );
						update_option( 'mo2f_message', $message );
						$this->mo_auth_show_success_message();
					} else {
						MO2f_Utility::unset_session_variables( 'user_phone' );
						delete_option( 'user_phone_temp' );
						update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "ERROR_DURING_PROCESS" ) );
						$this->mo_auth_show_error_message();
					}
				} else {
					MO2f_Utility::unset_session_variables( 'user_phone' );
					delete_option( 'user_phone_temp' );
					update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "INVALID_REQ" ) );
					$this->mo_auth_show_error_message();
				}

			} else {  // OTP Validation failed.
				update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "INVALID_OTP" ) );
				$this->mo_auth_show_error_message();
			}

		}

		// user clicks on Set 2-Factor method
		if ( ( isset( $_POST['option'] ) && $_POST['option'] == 'mo2f_save_free_plan_auth_methods' ) ||
		     ( isset( $_POST['option'] ) && $_POST['option'] == 'mo2f_save_standard_plan_auth_methods' )
		) {

			$selected_2FA_method = MO2f_Utility::mo2f_decode_2_factor( isset( $_POST['mo2f_configured_2FA_method_free_plan'] ) ? $_POST['mo2f_configured_2FA_method_free_plan'] : $_POST['mo2f_selected_action_standard_plan'], "wpdb" );
			$selected_action     = isset( $_POST['mo2f_selected_action_free_plan'] ) ? $_POST['mo2f_selected_action_free_plan'] : $_POST['mo2f_selected_action_standard_plan'];
			$user_phone          = '';
			if ( isset( $_SESSION['user_phone'] ) ) {
				$user_phone = $_SESSION['user_phone'] != 'false' ? $_SESSION['user_phone'] : $Mo2fdbQueries->get_user_detail( 'mo2f_user_phone', $user->ID );
			}

			// set it as his 2-factor in the WP database and server
			if ( $selected_action == "select2factor" ) {

				if ( $selected_2FA_method == 'OTP Over SMS' && $user_phone == 'false' ) {
					update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "PHONE_NOT_CONFIGURED" ) );
					$this->mo_auth_show_error_message();
				} else {
					// update in the Wordpress DB
					$Mo2fdbQueries->update_user_details( $user->ID, array( 'mo2f_configured_2FA_method' => $selected_2FA_method ) );

					// update the server
					$this->mo2f_save_2_factor_method( $user, $selected_2FA_method );
				}

			} else if ( $selected_action == "configure2factor" ) {

				//show configuration form of respective Two Factor method
				update_user_meta( $user->ID, 'configure_2FA', 1 );
				update_user_meta( $user->ID, 'mo2f_2FA_method_to_configure', $selected_2FA_method );

			}
		}

		if ( isset( $_POST['option'] ) && $_POST['option'] == 'mo2f_enable_2FA_for_users_option' ) {
			update_option( 'mo2f_enable_2fa_for_users', isset( $_POST['mo2f_enable_2fa_for_users'] ) ? $_POST['mo2f_enable_2fa_for_users'] : 0 );
		}

		if ( isset( $_POST['option'] ) && $_POST['option'] == 'mo2f_enable_2FA_option' ) {
			update_option( 'mo2f_enable_2fa', isset( $_POST['mo2f_enable_2fa'] ) ? $_POST['mo2f_enable_2fa'] : 0 );
		}

		if ( isset( $_POST['option'] ) && $_POST['option'] == 'mo_2factor_resume_flow_driven_setup' ) {
			update_option( 'mo2f_message', "" );

			update_user_meta( $user->ID, 'skipped_flow_driven_setup', 0 );
		}
		if ( isset( $_POST['option'] ) && $_POST['option'] == 'mo_2factor_test_authentication_method' ) {

                    if ( $is_flow_driven_setup ) {
                        update_user_meta( $user->ID, 'current_modal', 5 );
                    }else{
                        update_user_meta( $user->ID, 'test_2FA', 1 );
                    }

			$selected_2FA_method        = $_POST['mo2f_configured_2FA_method_test'];
			$selected_2FA_method_server = MO2f_Utility::mo2f_decode_2_factor( $selected_2FA_method, "server" );
			$customer                   = new Customer_Setup();
			$email                      = $Mo2fdbQueries->get_user_detail( 'mo2f_user_email', $user->ID );
			$customer_key               = get_option( 'mo2f_customerKey' );
			$api_key                    = get_option( 'mo2f_api_key' );

			if ( $selected_2FA_method == 'Security Questions' ) {
				$response = json_decode( $customer->send_otp_token( $email, $selected_2FA_method_server, $customer_key, $api_key ), true );

				if ( json_last_error() == JSON_ERROR_NONE ) { /* Generate KBA Questions*/
					if ( $response['status'] == 'SUCCESS' ) {
						$_SESSION['mo2f_transactionId'] = $response['txId'];
						update_option( 'mo2f_transactionId', $response['txId'] );
						$questions                             = array();
						$questions[0]                          = $response['questions'][0]['question'];
						$questions[1]                          = $response['questions'][1]['question'];
						$_SESSION['mo_2_factor_kba_questions'] = $questions;
						update_option( 'kba_questions', $questions );

						update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "ANSWER_SECURITY_QUESTIONS" ) );
						if ( ! $is_flow_driven_setup ) {
							$this->mo_auth_show_success_message();
						}
					} else if ( $response['status'] == 'ERROR' ) {
						update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "ERROR_FETCHING_QUESTIONS" ) );
						if ( ! $is_flow_driven_setup ) {
							$this->mo_auth_show_error_message();
						}
					}
				} else {
					update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "ERROR_FETCHING_QUESTIONS" ) );
					if ( ! $is_flow_driven_setup ) {
						$this->mo_auth_show_error_message();
					}
				}

			} else if ( $selected_2FA_method == 'miniOrange Push Notification' ) {
				$response = json_decode( $customer->send_otp_token( $email, $selected_2FA_method_server, $customer_key, $api_key ), true );
				if ( json_last_error() == JSON_ERROR_NONE ) { /* Generate Qr code */
					if ( $response['status'] == 'ERROR' ) {
						update_option( 'mo2f_message', Mo2fConstants:: langTranslate( $response['message'] ) );
						if ( ! $is_flow_driven_setup ) {
							$this->mo_auth_show_error_message();
						}
					} else {
						if ( $response['status'] == 'SUCCESS' ) {
							$_SESSION['mo2f_transactionId'] = $response['txId'];
							update_option( 'mo2f_transactionId', $response['txId'] );
							$_SESSION['mo2f_show_qr_code'] = 'MO_2_FACTOR_SHOW_QR_CODE';
							update_option( 'mo2f_transactionId', $response['txId'] );
							update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "PUSH_NOTIFICATION_SENT" ) );
							if ( ! $is_flow_driven_setup ) {
								$this->mo_auth_show_success_message();
							}
						} else {
							$session_variables = array( 'mo2f_qrCode', 'mo2f_transactionId', 'mo2f_show_qr_code' );
							MO2f_Utility::unset_session_variables( $session_variables );

							delete_option( 'mo2f_transactionId' );
							update_option( 'mo2f_message', 'An error occurred while processing your request. Please Try again.' );
							if ( ! $is_flow_driven_setup ) {
								$this->mo_auth_show_error_message();
							}
						}
					}
				} else {
					update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "INVALID_REQ" ) );
					if ( ! $is_flow_driven_setup ) {
						$this->mo_auth_show_error_message();
					}
				}
			} else if ( $selected_2FA_method == 'OTP Over SMS' ) {
				$phone    = $Mo2fdbQueries->get_user_detail( 'mo2f_user_phone', $user->ID );
				$response = json_decode( $customer->send_otp_token( $phone, $selected_2FA_method_server, $customer_key, $api_key ), true );
				if ( strcasecmp( $response['status'], 'SUCCESS' ) == 0 ) {
					update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "OTP_SENT" ) . ' <b>' . ( $phone ) . '</b>. ' . Mo2fConstants:: langTranslate( "ENTER_OTP" ) );
					update_option( 'mo2f_number_of_transactions', get_option( 'mo2f_number_of_transactions' ) - 1 );

					$_SESSION['mo2f_transactionId'] = $response['txId'];
					update_option( 'mo2f_transactionId', $response['txId'] );
					if ( ! $is_flow_driven_setup ) {
						$this->mo_auth_show_success_message();
					}
				} else {
					update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "ERROR_IN_SENDING_OTP" ) );
					if ( ! $is_flow_driven_setup ) {
						$this->mo_auth_show_error_message();
					}
				}
			} else if ( $selected_2FA_method == 'miniOrange QR Code Authentication' ) {
				$response = json_decode( $customer->send_otp_token( $email, $selected_2FA_method_server, $customer_key, $api_key ), true );

				if ( json_last_error() == JSON_ERROR_NONE ) { /* Generate Qr code */

					if ( $response['status'] == 'ERROR' ) {
						update_option( 'mo2f_message', Mo2fConstants:: langTranslate( $response['message'] ) );
						if ( ! $is_flow_driven_setup ) {
							$this->mo_auth_show_error_message();
						}
					} else {
						if ( $response['status'] == 'SUCCESS' ) {
							$_SESSION['mo2f_qrCode']        = $response['qrCode'];
							$_SESSION['mo2f_transactionId'] = $response['txId'];
							$_SESSION['mo2f_show_qr_code']  = 'MO_2_FACTOR_SHOW_QR_CODE';
							update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "SCAN_QR_CODE" ) );
							if ( ! $is_flow_driven_setup ) {
								$this->mo_auth_show_success_message();
							}
						} else {
							unset( $_SESSION['mo2f_qrCode'] );
							unset( $_SESSION['mo2f_transactionId'] );
							unset( $_SESSION['mo2f_show_qr_code'] );
							update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "ERROR_DURING_PROCESS" ) );
							if ( ! $is_flow_driven_setup ) {
								$this->mo_auth_show_error_message();
							}
						}
					}
				} else {
					update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "INVALID_REQ" ) );
					if ( ! $is_flow_driven_setup ) {
						$this->mo_auth_show_error_message();
					}
				}
			} else if ( $selected_2FA_method == 'Email Verification' ) {
				$this->miniorange_email_verification_call( $user );
			}



			update_user_meta( $user->ID, 'mo2f_2FA_method_to_test', $selected_2FA_method );

		}

		if ( isset( $_POST['option'] ) && $_POST['option'] == 'mo2f_go_back' ) {
			$session_variables = array(
				'mo2f_qrCode',
				'mo2f_transactionId',
				'mo2f_show_qr_code',
				'user_phone',
				'mo2f_google_auth',
				'mo2f_mobile_support',
				'mo2f_authy_keys'
			);
			MO2f_Utility::unset_session_variables( $session_variables );
			delete_option( 'mo2f_transactionId' );
			delete_option( 'user_phone_temp' );

			delete_user_meta( $user->ID, 'test_2FA' );
			delete_user_meta( $user->ID, 'configure_2FA' );
		}

	}

	function mo_auth_deactivate() {
		global $Mo2fdbQueries;
		$mo2f_register_with_another_email = get_option( 'mo2f_register_with_another_email' );
		$is_EC = !get_option('mo2f_is_NC') ? 1: 0;
		$is_NNC = get_option('mo2f_is_NC') && get_option('mo2f_is_NNC') ? 1: 0;

		if ( $mo2f_register_with_another_email || $is_EC || $is_NNC ) {
			update_option( 'mo2f_register_with_another_email', 0 );
			$users = get_users( array() );
			$this->mo2f_delete_user_details( $users );
			$this->mo2f_delete_mo_options();
			$url = admin_url( 'plugins.php' );
			wp_redirect( $url );
		}

	}

	function mo2f_delete_user_details( $users ) {
		global $Mo2fdbQueries;
		foreach ( $users as $user ) {
			$Mo2fdbQueries->delete_user_details( $user->ID );
			delete_user_meta( $user->ID, 'phone_verification_status' );
			delete_user_meta( $user->ID, 'test_2FA' );
			delete_user_meta( $user->ID, 'mo2f_2FA_method_to_configure' );
			delete_user_meta( $user->ID, 'configure_2FA' );
			delete_user_meta( $user->ID, 'skipped_flow_driven_setup' );
			delete_user_meta( $user->ID, 'current_modal' );
			delete_user_meta( $user->ID, 'mo2f_2FA_method_to_test' );
			delete_user_meta( $user->ID, 'mo2f_phone' );
		}

	}

	function mo2f_delete_mo_options() {
		delete_option( 'mo2f_email' );
		delete_option( 'mo2f_host_name' );
		delete_option( 'user_phone' );
		//delete_option( 'mo2f_customerKey' );
		delete_option( 'mo2f_api_key' );
		delete_option( 'mo2f_customer_token' );
		delete_option( 'mo_2factor_admin_registration_status' );
		delete_option( 'mo2f_number_of_transactions' );
		delete_option( 'mo2f_set_transactions' );
		delete_option( 'mo2f_show_sms_transaction_message' );
		delete_option( 'mo_app_password' );
		delete_option( 'mo2f_login_option' );
		delete_option( 'mo2f_remember_device' );
		delete_option( 'mo2f_enable_forgotphone' );
		delete_option( 'mo2f_enable_login_with_2nd_factor' );
		delete_option( 'mo2f_enable_xmlrpc' );
		delete_option( 'mo2f_register_with_another_email' );
	}

	function mo_auth_show_error_message() {
		remove_action( 'admin_notices', array( $this, 'mo_auth_error_message' ) );
		add_action( 'admin_notices', array( $this, 'mo_auth_success_message' ) );
	}

	function mo_auth_show_success_message() {
		remove_action( 'admin_notices', array( $this, 'mo_auth_success_message' ) );
		add_action( 'admin_notices', array( $this, 'mo_auth_error_message' ) );
	}

	function mo2f_fix_the_bug() {
		global $Mo2fdbQueries;
		$user_id = get_site_option( 'mo2f_miniorange_admin' );
		$Mo2fdbQueries->generate_tables();
		$Mo2fdbQueries->insert_user( $user_id, array( 'user_id' => $user_id ) );

		add_option( 'mo2f_phone', get_option( 'user_phone' ) );
		add_option( 'mo2f_enable_login_with_2nd_factor', get_option( 'mo2f_show_loginwith_phone' ) );
		add_option( 'mo2f_remember_device', get_option( 'mo2f_deviceid_enabled' ) );
		add_option( 'mo2f_transactionId', get_option( 'mo2f-login-transactionId' ) );
		add_option( 'mo2f_is_NC', 0 );
		$phone      = get_user_meta( $user_id, 'mo2f_user_phone', true );
		$user_phone = $phone ? $phone : get_user_meta( $user_id, 'mo2f_phone', true );

		$Mo2fdbQueries->update_user_details( $user_id,
			array(
				'mo2f_GoogleAuthenticator_config_status' => get_user_meta( $user_id, 'mo2f_google_authentication_status', true ),
				'mo2f_SecurityQuestions_config_status'   => get_user_meta( $user_id, 'mo2f_kba_registration_status', true ),
				'mo2f_EmailVerification_config_status'   => true,
				'mo2f_AuthyAuthenticator_config_status'  => get_user_meta( $user_id, 'mo2f_authy_authentication_status', true ),
				'mo2f_user_email'                        => get_user_meta( $user_id, 'mo_2factor_map_id_with_email', true ),
				'mo2f_user_phone'                        => $user_phone,
				'user_registration_with_miniorange'      => get_user_meta( $user_id, 'mo_2factor_user_registration_with_miniorange', true ),
				'mobile_registration_status'             => get_user_meta( $user_id, 'mo2f_mobile_registration_status', true ),
				'mo2f_configured_2FA_method'             => get_user_meta( $user_id, 'mo2f_selected_2factor_method', true ),
				'mo_2factor_user_registration_status'    => get_user_meta( $user_id, 'mo_2factor_user_registration_status', true )
			) );

		if ( get_user_meta( $user_id, 'mo2f_mobile_registration_status', true ) ) {
			$Mo2fdbQueries->update_user_details( $user_id,
				array(
					'mo2f_miniOrangeSoftToken_config_status'            => true,
					'mo2f_miniOrangeQRCodeAuthentication_config_status' => true,
					'mo2f_miniOrangePushNotification_config_status'     => true
				) );
		}

		if ( get_user_meta( $user_id, 'mo2f_otp_registration_status', true ) ) {
			$Mo2fdbQueries->update_user_details( $user_id,
				array(
					'mo2f_OTPOverSMS_config_status' => true
				) );
		}

		$mo2f_external_app_type = get_user_meta( $user_id, 'mo2f_external_app_type', true ) == 'AUTHY 2-FACTOR AUTHENTICATION' ?
			'Authy Authenticator' : 'Google Authenticator';

		update_user_meta( $user_id, 'mo2f_external_app_type', $mo2f_external_app_type );
		update_user_meta( $user_id, 'skipped_flow_driven_setup', false );
		update_user_meta( $user_id, 'current_modal', 0 );

		delete_option( 'mo2f_show_loginwith_phone' );
		delete_option( 'mo2f_deviceid_enabled' );
		delete_option( 'mo2f-login-transactionId' );
		delete_user_meta( $user_id, 'mo2f_google_authentication_status' );
		delete_user_meta( $user_id, 'mo2f_kba_registration_status' );
		delete_user_meta( $user_id, 'mo2f_email_verification_status' );
		delete_user_meta( $user_id, 'mo2f_authy_authentication_status' );
		delete_user_meta( $user_id, 'mo_2factor_map_id_with_email' );
		delete_user_meta( $user_id, 'mo_2factor_user_registration_with_miniorange' );
		delete_user_meta( $user_id, 'mo2f_mobile_registration_status' );
		delete_user_meta( $user_id, 'mo2f_otp_registration_status' );
		delete_user_meta( $user_id, 'mo2f_selected_2factor_method' );
		delete_user_meta( $user_id, 'mo2f_configure_test_option' );
		delete_user_meta( $user_id, 'mo_2factor_user_registration_status' );

	}

	function mo2f_create_customer( $user ) {
		global $Mo2fdbQueries;
		delete_user_meta( $user->ID, 'mo2f_sms_otp_count' );
		delete_user_meta( $user->ID, 'mo2f_email_otp_count' );
		$customer    = new Customer_Setup();
		$customerKey = json_decode( $customer->create_customer(), true );
		if ( $customerKey['status'] == 'ERROR' ) {
			update_option( 'mo2f_message', Mo2fConstants:: langTranslate( $customerKey['message'] ) );
			$this->mo_auth_show_error_message();
		} else {
			if ( strcasecmp( $customerKey['status'], 'CUSTOMER_USERNAME_ALREADY_EXISTS' ) == 0 ) {    //admin already exists in miniOrange
				$content     = $customer->get_customer_key();
				$customerKey = json_decode( $content, true );

				if ( json_last_error() == JSON_ERROR_NONE ) {
					if ( array_key_exists( "status", $customerKey ) && $customerKey['status'] == 'ERROR' ) {
						update_option( 'mo2f_message', Mo2fConstants::langTranslate( $customerKey['message'] ) );
						$this->mo_auth_show_error_message();
					} else {
						if ( isset( $customerKey['id'] ) && ! empty( $customerKey['id'] ) ) {
							update_option( 'mo2f_customerKey', $customerKey['id'] );
							update_option( 'mo2f_api_key', $customerKey['apiKey'] );
							update_option( 'mo2f_customer_token', $customerKey['token'] );
							update_option( 'mo2f_app_secret', $customerKey['appSecret'] );
							update_option( 'mo2f_miniorange_admin', $user->ID );
							delete_option( 'mo2f_password' );
							$email = get_option( 'mo2f_email' );
							$Mo2fdbQueries->update_user_details( $user->ID, array(
								'mo2f_EmailVerification_config_status' => true,
								'user_registration_with_miniorange'    => 'SUCCESS',
								'mo2f_user_email'                      => $email
							) );
							$mo_2factor_user_registration_status = 'MO_2_FACTOR_PLUGIN_SETTINGS';


							$Mo2fdbQueries->update_user_details( $user->ID, array( 'mo_2factor_user_registration_status' => $mo_2factor_user_registration_status ) );

							update_option( 'mo_2factor_admin_registration_status', 'MO_2_FACTOR_CUSTOMER_REGISTERED_SUCCESS' );
							$enduser = new Two_Factor_Setup();
							$enduser->mo2f_update_userinfo( $email, 'OUT OF BAND EMAIL', null, 'API_2FA', true );

							update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "ACCOUNT_RETRIEVED_SUCCESSFULLY" ) . ' <b>' . Mo2fConstants:: langTranslate( "EMAIL_VERFI" ) . '</b> ' . Mo2fConstants:: langTranslate( "DEFAULT_2ND_FACTOR" ) . ' <a href=\"admin.php?page=miniOrange_2_factor_settings&amp;mo2f_tab=mobile_configure\" >' . Mo2fConstants:: langTranslate( "CLICK_HERE" ) . '</a> ' . Mo2fConstants:: langTranslate( "CONFIGURE_2FA" ) );
							$this->mo_auth_show_success_message();
						} else {
							update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "ERROR_CREATE_ACC_OTP" ) );
							$mo_2factor_user_registration_status = 'MO_2_FACTOR_OTP_DELIVERED_FAILURE';
							$Mo2fdbQueries->update_user_details( $user->ID, array( 'mo_2factor_user_registration_status' => $mo_2factor_user_registration_status ) );
							$this->mo_auth_show_error_message();
						}

					}

				} else {
					update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "INVALID_EMAIL_OR_PASSWORD" ) );
					$mo_2factor_user_registration_status = 'MO_2_FACTOR_VERIFY_CUSTOMER';
					$Mo2fdbQueries->update_user_details( $user->ID, array( 'mo_2factor_user_registration_status' => $mo_2factor_user_registration_status ) );

					$this->mo_auth_show_error_message();
				}


			} else {
				if ( isset( $customerKey['id'] ) && ! empty( $customerKey['id'] ) ) {
					update_option( 'mo2f_customerKey', $customerKey['id'] );
					update_option( 'mo2f_api_key', $customerKey['apiKey'] );
					update_option( 'mo2f_customer_token', $customerKey['token'] );
					update_option( 'mo2f_app_secret', $customerKey['appSecret'] );
					update_option( 'mo2f_miniorange_admin', $user->ID );
					delete_option( 'mo2f_password' );

					$email = get_option( 'mo2f_email' );

					update_option( 'mo2f_is_NC', 1 );
					update_option( 'mo2f_is_NNC', 1 );

					update_user_meta( $user->ID, 'skipped_flow_driven_setup', 0 );
					update_user_meta( $user->ID, 'current_modal', 0 );

					update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "ACCOUNT_CREATED" ) );
					$mo_2factor_user_registration_status = 'MO_2_FACTOR_PLUGIN_SETTINGS';
					$Mo2fdbQueries->update_user_details( $user->ID, array(
						'mo2f_2factor_enable_2fa_byusers'     => 1,
						'user_registration_with_miniorange'   => 'SUCCESS',
						'mo2f_configured_2FA_method'          => 'NONE',
						'mo2f_user_email'                     => $email,
						'mo_2factor_user_registration_status' => $mo_2factor_user_registration_status
					) );

					update_option( 'mo_2factor_admin_registration_status', 'MO_2_FACTOR_CUSTOMER_REGISTERED_SUCCESS' );

					$enduser = new Two_Factor_Setup();
					$enduser->mo2f_update_userinfo( $email, 'NONE', null, 'API_2FA', true );

					$this->mo_auth_show_success_message();
					header( 'Location: admin.php?page=miniOrange_2_factor_settings&mo2f_tab=mobile_configure' );
				} else {
					update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "ERROR_CREATE_ACC_OTP" ) );
					$mo_2factor_user_registration_status = 'MO_2_FACTOR_OTP_DELIVERED_FAILURE';
					$Mo2fdbQueries->update_user_details( $user->ID, array( 'mo_2factor_user_registration_status' => $mo_2factor_user_registration_status ) );
					$this->mo_auth_show_error_message();
				}


			}
		}
	}

	function mo2f_create_user( $user, $email ) {
		global $Mo2fdbQueries;
		$email      = strtolower( $email );
		$enduser    = new Two_Factor_Setup();
		$check_user = json_decode( $enduser->mo_check_user_already_exist( $email ), true );

		if ( json_last_error() == JSON_ERROR_NONE ) {
			if ( $check_user['status'] == 'ERROR' ) {
				update_option( 'mo2f_message', Mo2fConstants:: langTranslate( $check_user['message'] ) );
				$this->mo_auth_show_error_message();
			} else {
				if ( strcasecmp( $check_user['status'], 'USER_FOUND' ) == 0 ) {

					$Mo2fdbQueries->update_user_details( $user->ID, array(
						'user_registration_with_miniorange'   => 'SUCCESS',
						'mo2f_user_email'                     => $email,
						'mo2f_configured_2FA_method'          => 'NONE',
						'mo_2factor_user_registration_status' => 'MO_2_FACTOR_PLUGIN_SETTINGS'
					) );


					delete_user_meta( $user->ID, 'user_email' );
					$enduser->mo2f_update_userinfo( $email, 'NONE', null, 'API_2FA', true );
					$message = Mo2fConstants:: langTranslate( "REGISTRATION_SUCCESS" );
					update_option( 'mo2f_message', $message );
					$this->mo_auth_show_success_message();
					header( 'Location: admin.php?page=miniOrange_2_factor_settings&mo2f_tab=mobile_configure' );

				} else if ( strcasecmp( $check_user['status'], 'USER_NOT_FOUND' ) == 0 ) {
					$content = json_decode( $enduser->mo_create_user( $user, $email ), true );
					if ( json_last_error() == JSON_ERROR_NONE ) {
						if ( $content['status'] == 'ERROR' ) {
							update_option( 'mo2f_message', Mo2fConstants:: langTranslate( $content['message'] ) );
							$this->mo_auth_show_error_message();
						} else {
							if ( strcasecmp( $content['status'], 'SUCCESS' ) == 0 ) {
								delete_user_meta( $user->ID, 'user_email' );
								$Mo2fdbQueries->update_user_details( $user->ID, array(
									'user_registration_with_miniorange'   => 'SUCCESS',
									'mo2f_user_email'                     => $email,
									'mo2f_configured_2FA_method'          => 'NONE',
									'mo_2factor_user_registration_status' => 'MO_2_FACTOR_PLUGIN_SETTINGS'
								) );
								$enduser->mo2f_update_userinfo( $email, 'NONE', null, 'API_2FA', true );
								$message = Mo2fConstants:: langTranslate( "REGISTRATION_SUCCESS" );
								update_option( 'mo2f_message', $message );
								$this->mo_auth_show_success_message();
								header( 'Location: admin.php?page=miniOrange_2_factor_settings&mo2f_tab=mobile_configure' );

							} else {
								update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "ERROR_DURING_USER_REGISTRATION" ) );
								$this->mo_auth_show_error_message();
							}
						}
					} else {
						update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "ERROR_DURING_USER_REGISTRATION" ) );
						$this->mo_auth_show_error_message();
					}
				} else {
					update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "ERROR_DURING_USER_REGISTRATION" ) );
					$this->mo_auth_show_error_message();
				}
			}
		} else {
			update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "ERROR_DURING_USER_REGISTRATION" ) );
			$this->mo_auth_show_error_message();
		}
	}

	function mo2f_get_qr_code_for_mobile( $email, $id ) {
		$is_flow_driven_setup = get_user_meta( $id, 'skipped_flow_driven_setup', true ) ? 0 : 1;

		$registerMobile = new Two_Factor_Setup();
		$content        = $registerMobile->register_mobile( $email );
		$response       = json_decode( $content, true );
		if ( json_last_error() == JSON_ERROR_NONE ) {
			if ( $response['status'] == 'ERROR' ) {
				update_option( 'mo2f_message', Mo2fConstants:: langTranslate( $response['message'] ) );
				$session_variables = array( 'mo2f_qrCode', 'mo2f_transactionId', 'mo2f_show_qr_code' );
				MO2f_Utility::unset_session_variables( $session_variables );
				delete_option( 'mo2f_transactionId' );
				if ( ! $is_flow_driven_setup ) {
					$this->mo_auth_show_error_message();
				}
			} else {
				if ( $response['status'] == 'IN_PROGRESS' ) {
					update_option( 'mo2f_message', Mo2fConstants::langTranslate( "SCAN_QR_CODE" ) );
					$_SESSION['mo2f_qrCode']        = $response['qrCode'];
					$_SESSION['mo2f_transactionId'] = $response['txId'];
					update_option( 'mo2f_transactionId', $response['txId'] );
					$_SESSION['mo2f_show_qr_code'] = 'MO_2_FACTOR_SHOW_QR_CODE';
					if ( ! $is_flow_driven_setup ) {
						$this->mo_auth_show_success_message();
					}
				} else {
					update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "ERROR_DURING_PROCESS" ) );
					$session_variables = array( 'mo2f_qrCode', 'mo2f_transactionId', 'mo2f_show_qr_code' );
					MO2f_Utility::unset_session_variables( $session_variables );
					delete_option( 'mo2f_transactionId' );
					if ( ! $is_flow_driven_setup ) {
						$this->mo_auth_show_error_message();
					}
				}
			}
		}
	}

	function mo2f_save_2_factor_method( $user, $mo2f_configured_2FA_method ) {
		global $Mo2fdbQueries;
		$email          = $Mo2fdbQueries->get_user_detail( 'mo2f_user_email', $user->ID );
		$enduser        = new Two_Factor_Setup();
		$phone          = $Mo2fdbQueries->get_user_detail( 'mo2f_user_phone', $user->ID );
		$current_method = MO2f_Utility::mo2f_decode_2_factor( $mo2f_configured_2FA_method, "server" );

		$response = json_decode( $enduser->mo2f_update_userinfo( $email, $current_method, $phone, null, null ), true );

		if ( json_last_error() == JSON_ERROR_NONE ) {
			if ( $response['status'] == 'ERROR' ) {
				update_option( 'mo2f_message', Mo2fConstants:: langTranslate( $response['message'] ) );
				$this->mo_auth_show_error_message();
			} else if ( $response['status'] == 'SUCCESS' ) {
				$configured_2fa_method = $Mo2fdbQueries->get_user_detail( 'mo2f_configured_2FA_method', $user->ID );

				if ( in_array( $configured_2fa_method, array( "Google Authenticator", "Authy Authenticator" ) ) ) {
					update_user_meta( $user->ID, 'mo2f_external_app_type', $configured_2fa_method );
				}

				$Mo2fdbQueries->update_user_details( $user->ID, array(
					'mo_2factor_user_registration_status' => 'MO_2_FACTOR_PLUGIN_SETTINGS'
				) );
				delete_user_meta( $user->ID, 'configure_2FA' );
				update_option( 'mo2f_message', Mo2fConstants:: langTranslate( $configured_2fa_method ) . ' ' . Mo2fConstants:: langTranslate( "SET_2FA" ) );

				$this->mo_auth_show_success_message();
			} else {
				update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "ERROR_DURING_PROCESS" ) );
				$this->mo_auth_show_error_message();
			}
		} else {
			update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "INVALID_REQ" ) );
			$this->mo_auth_show_error_message();
		}
	}

	function miniorange_email_verification_call( $user ) {
		global $Mo2fdbQueries;
		$challengeMobile = new Customer_Setup();
		$email           = $Mo2fdbQueries->get_user_detail( 'mo2f_user_email', $user->ID );
		$content         = $challengeMobile->send_otp_token( $email, 'OUT OF BAND EMAIL', $this->defaultCustomerKey, $this->defaultApiKey );
		$response        = json_decode( $content, true );
		if ( json_last_error() == JSON_ERROR_NONE ) { /* Generate out of band email */
			if ( $response['status'] == 'ERROR' ) {
				update_option( 'mo2f_message', Mo2fConstants:: langTranslate( $response['message'] ) );
				$this->mo_auth_show_error_message();
			} else {
				if ( $response['status'] == 'SUCCESS' ) {
					$_SESSION['mo2f_transactionId'] = $response['txId'];
					update_option( 'mo2f_transactionId', $response['txId'] );
					update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "VERIFICATION_EMAIL_SENT" ) . '<b> ' . $email . '</b>. ' . Mo2fConstants:: langTranslate( "ACCEPT_LINK_TO_VERIFY_EMAIL" ) );
					$this->mo_auth_show_success_message();
				} else {
					unset( $_SESSION['mo2f_transactionId'] );
					update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "ERROR_DURING_PROCESS" ) );
					$this->mo_auth_show_error_message();
				}
			}
		} else {
			update_option( 'mo2f_message', Mo2fConstants:: langTranslate( "INVALID_REQ" ) );
			$this->mo_auth_show_error_message();
		}
	}

	function mo_auth_activate() {
		if ( get_option( 'mo2f_customerKey' ) && ! get_option( 'mo2f_is_NC' ) ) {
			update_option( 'mo2f_is_NC', 0 );
		} else {
			update_option( 'mo2f_is_NC', 1 );
			update_option( 'mo2f_is_NNC', 1 );
		}

		global $Mo2fdbQueries;
		$Mo2fdbQueries->mo_plugin_activate();
	}

	function mo_get_2fa_shorcode( $atts ) {
		if ( ! is_user_logged_in() && mo2f_is_customer_registered() ) {
			$mo2f_shorcode = new MO2F_ShortCode();
			$html          = $mo2f_shorcode->mo2FAFormShortCode( $atts );

			return $html;
		}
	}

	function mo_get_login_form_shortcode( $atts ) {
		if ( ! is_user_logged_in() && mo2f_is_customer_registered() ) {
			$mo2f_shorcode = new MO2F_ShortCode();
			$html          = $mo2f_shorcode->mo2FALoginFormShortCode( $atts );

			return $html;
		}
	}
}

function mo2f_is_customer_registered() {
	$email       = get_option( 'mo2f_email' );
	$customerKey = get_option( 'mo2f_customerKey' );
	if ( ! $email || ! $customerKey || ! is_numeric( trim( $customerKey ) ) ) {
		return 0;
	} else {
		return 1;
	}
}


new Miniorange_Authentication;
?>
