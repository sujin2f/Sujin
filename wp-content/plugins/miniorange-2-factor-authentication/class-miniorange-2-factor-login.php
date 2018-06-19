<?Php
/** miniOrange enables user to log in through mobile authentication as an additional layer of security over password.
 * Copyright (C) 2015  miniOrange
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>
 * @package        miniOrange OAuth
 * @license        http://www.gnu.org/copyleft/gpl.html GNU/GPL, see LICENSE.php
 */
/**
 * This library is miniOrange Authentication Service.
 * Contains Request Calls to Customer service.
 **/
include_once dirname( __FILE__ ) . '/miniorange_2_factor_common_login.php';


class Miniorange_Mobile_Login {

	function mo2fa_default_login( $user, $username, $password ) {
		global $Mo2fdbQueries;

		$currentuser = wp_authenticate_username_password( $user, $username, $password );
		if ( is_wp_error( $currentuser ) ) {
			return $currentuser;
		} else {
			$this->miniorange_login_start_session();

			$current_roles = miniorange_get_user_role( $currentuser );

			$enabled     = miniorange_check_if_2fa_enabled_for_roles( $current_roles );
			$redirect_to = isset( $_REQUEST['redirect_to'] ) ? $_REQUEST['redirect_to'] : null;

			if ( $enabled ) {

				$mo2f_user_email               = $Mo2fdbQueries->get_user_detail( 'mo2f_user_email', $currentuser->ID );
				$mo2f_user_registration_status = $Mo2fdbQueries->get_user_detail( 'mo_2factor_user_registration_status', $currentuser->ID );

				if ( $mo2f_user_email && $mo2f_user_registration_status == 'MO_2_FACTOR_PLUGIN_SETTINGS' ) { //checking if user has configured any 2nd factor method
					$_SESSION['mo2f-login-message'] = '<strong>' . mo2f_lt( 'ERROR' ) . '</strong>: ' . mo2f_lt( 'Login with password is disabled for you. Please Login using your phone.' );
					MO2f_Utility::mo2f_set_cookie_values( "mo2f-login-message", '<strong>ERROR</strong>: Login with password is disabled for you. Please Login using your phone.' );
					$this->mo_auth_show_error_message();
					$this->mo2f_redirectto_wp_login();
					$error = new WP_Error();

					return $error;
				} else { //if user has not configured any 2nd factor method then logged him in without asking 2nd factor

					$this->mo2f_verify_and_authenticate_userlogin( $currentuser, $redirect_to );
				}
			} else { //plugin is not activated for non-admin then logged him in


				$this->mo2f_verify_and_authenticate_userlogin( $currentuser, $redirect_to );

			}
		}
	}

	public function miniorange_login_start_session() {
		if ( ! session_id() || session_id() == '' || ! isset( $_SESSION ) ) {
			session_start();
		}
	}

	function mo_auth_show_error_message() {
		remove_filter( 'login_message', array( $this, 'mo_auth_success_message' ) );
		add_filter( 'login_message', array( $this, 'mo_auth_error_message' ) );

	}

	function mo2f_redirectto_wp_login() {
		remove_action( 'login_enqueue_scripts', array( $this, 'mo_2_factor_hide_login' ) );
		add_action( 'login_dequeue_scripts', array( $this, 'mo_2_factor_show_login' ) );
		if ( get_option( 'mo2f_enable_login_with_2nd_factor' ) ) {
			$_SESSION['mo_2factor_login_status'] = 'MO_2_FACTOR_LOGIN_WHEN_PHONELOGIN_ENABLED';
			//if the php session folder has insufficient permissions, cookies to be used
			MO2f_Utility::mo2f_set_cookie_values( "mo_2factor_login_status", 'MO_2_FACTOR_LOGIN_WHEN_PHONELOGIN_ENABLED' );

		} else {
			$_SESSION['mo_2factor_login_status'] = 'MO_2_FACTOR_SHOW_USERPASS_LOGIN_FORM';
			//if the php session folder has insufficient permissions, cookies to be used
			MO2f_Utility::mo2f_set_cookie_values( "mo_2factor_login_status", 'MO_2_FACTOR_SHOW_USERPASS_LOGIN_FORM' );

		}
	}

	function mo2f_verify_and_authenticate_userlogin( $user, $redirect_to = null ) {

		$user_id = $user->ID;
		wp_set_current_user( $user_id, $user->user_login );
		$this->remove_current_activity();
		wp_set_auth_cookie( $user_id, true );
		do_action( 'wp_login', $user->user_login, $user );
		redirect_user_to( $user, $redirect_to );
		exit;

	}

	function remove_current_activity() {
		$session_variables = array(
			'mo2f_current_user_id',
			'mo2f_1stfactor_status',
			'mo_2factor_login_status',
			'mo2f-login-qrCode',
			'mo2f_transactionId',
			'mo2f-login-message',
			'mo2f_rba_status',
			'mo_2_factor_kba_questions',
			'mo2f_show_qr_code',
			'mo2f_google_auth',
			'mo2f_authy_keys'
		);

		$cookie_variables = array(
			'mo2f_current_user_id',
			'mo2f_1stfactor_status',
			'mo_2factor_login_status',
			'mo2f-login-qrCode',
			'mo2f_transactionId',
			'mo2f-login-message',
			'mo2f_rba_status_status',
			'mo2f_rba_status_sessionUuid',
			'mo2f_rba_status_decision_flag',
			'kba_question1',
			'kba_question2',
			'mo2f_show_qr_code',
			'mo2f_google_auth',
			'mo2f_authy_keys'
		);

		MO2f_Utility::unset_session_variables( $session_variables );
		MO2f_Utility::unset_cookie_variables( $cookie_variables );
	}

	function custom_login_enqueue_scripts() {
		wp_enqueue_script( 'jquery' );
		wp_enqueue_script( 'bootstrap_script', plugins_url( 'includes/js/bootstrap.min.js', __FILE__ ) );
	}

	function mo_2_factor_hide_login() {
		wp_register_style( 'hide-login', plugins_url( 'includes/css/hide-login.css?version=5.0.6', __FILE__ ) );
		wp_register_style( 'bootstrap', plugins_url( 'includes/css/bootstrap.min.css?version=5.0.6', __FILE__ ) );

		wp_enqueue_style( 'hide-login' );
		wp_enqueue_style( 'bootstrap' );

	}

	function mo_auth_success_message() {
		$message = $_SESSION['mo2f-login-message'];
		//if the php session folder has insufficient permissions, cookies to be used
		$message = MO2f_Utility::mo2f_retrieve_session_or_cookie_values( 'mo2f-login-message' );

		return "<div> <p class='message'>" . $message . "</p></div>";
	}

	function mo_auth_error_message() {
		$id      = "login_error1";
		$message = $_SESSION['mo2f-login-message'];

		//if the php session folder has insufficient permissions, cookies to be used
		$message = MO2f_Utility::mo2f_retrieve_session_or_cookie_values( 'mo2f-login-message' );

		return "<div id='" . $id . "'> <p>" . $message . "</p></div>";
	}

	function mo_auth_show_success_message() {
		remove_filter( 'login_message', array( $this, 'mo_auth_error_message' ) );
		add_filter( 'login_message', array( $this, 'mo_auth_success_message' ) );
	}

	function miniorange_login_form_fields( $mo2fa_login_status = null, $mo2fa_login_message = null ) {

		if ( get_option( 'mo2f_enable_login_with_2nd_factor' ) ) { //login with phone overwrite default login form

			//if the php session folder has insufficient permissions, cookies to be used
			$login_status_phone_enable = MO2f_Utility::mo2f_retrieve_session_or_cookie_values( 'mo_2factor_login_status' );

			if ( $login_status_phone_enable == 'MO_2_FACTOR_LOGIN_WHEN_PHONELOGIN_ENABLED' && isset( $_POST['miniorange_login_nonce'] ) && wp_verify_nonce( $_POST['miniorange_login_nonce'], 'miniorange-2-factor-login-nonce' ) ) {


				$this->mo_2_factor_show_login_with_password_when_phonelogin_enabled();
				$this->mo_2_factor_show_wp_login_form_when_phonelogin_enabled();
				$user            = isset( $_SESSION['mo2f_current_user'] ) ? unserialize( $_SESSION['mo2f_current_user'] ) : null;
				$mo2f_user_login = is_null( $user ) ? null : $user->user_login;
				?>
                <script>
                    jQuery('#user_login').val(<?php echo "'" . $mo2f_user_login . "'"; ?>);
                </script><?php
			} else {
				$this->mo_2_factor_show_login();
				$this->mo_2_factor_show_wp_login_form();
			}

		} else { //Login with phone is alogin with default login form

			$this->mo_2_factor_show_login();
			$this->mo_2_factor_show_wp_login_form();
		}

	}

	function mo_2_factor_show_login_with_password_when_phonelogin_enabled() {
		wp_register_style( 'show-login', plugins_url( 'includes/css/show-login.css?version=5.0.6', __FILE__ ) );
		wp_enqueue_style( 'show-login' );
	}


	// login form fields

	function mo_2_factor_show_wp_login_form_when_phonelogin_enabled() {
		?>
        <script>
            var content = ' <a href="javascript:void(0)" id="backto_mo" onClick="mo2fa_backtomologin()" style="float:right">← Back</a>';
            jQuery('#login').append(content);

            function mo2fa_backtomologin() {
                jQuery('#mo2f_backto_mo_loginform').submit();
            }
        </script>
		<?php
	}

	function mo_2_factor_show_login() {
		if ( get_option( 'mo2f_enable_login_with_2nd_factor' ) ) {
			wp_register_style( 'show-login', plugins_url( 'includes/css/hide-login-form.css?version=5.0.6', __FILE__ ) );
		} else {
			wp_register_style( 'show-login', plugins_url( 'includes/css/show-login.css?version=5.0.6', __FILE__ ) );
		}
		wp_enqueue_style( 'show-login' );
	}

	function mo_2_factor_show_wp_login_form() {
		$mo2f_enable_login_with_2nd_factor = get_option( 'mo2f_enable_login_with_2nd_factor' );
		?>
        <div class="mo2f-login-container">
			<?php if ( ! $mo2f_enable_login_with_2nd_factor ) { ?>
                <div style="position: relative" class="or-container">
                    <div class="login_with_2factor_inner_div"></div>
                    <h2 class="login_with_2factor_h2"><?php echo mo2f_lt( 'or' ); ?></h2>
                </div>
			<?php } ?>
            <div class="mo2f-button-container" id="mo2f_button_container">
                <input type="text" name="mo2fa_usernamekey" id="mo2fa_usernamekey" autofocus="true"
                       placeholder="<?php echo mo2f_lt( 'Username' ); ?>"/>
                <p>
                    <input type="button" name="miniorange_login_submit" style="width:100% !important;"
                           onclick="mouserloginsubmit();" id="miniorange_login_submit"
                           class="miniorange-button button-add"
                           value="<?php echo mo2f_lt( 'Login with 2nd factor' ); ?>"/>
                </p>
				<?php if ( ! $mo2f_enable_login_with_2nd_factor ) { ?><br><br><?php } ?>
            </div>
        </div>

        <script>
            jQuery(window).scrollTop(jQuery('#mo2f_button_container').offset().top);

            function mouserloginsubmit() {
                var username = jQuery('#mo2fa_usernamekey').val();
                document.getElementById("mo2f_show_qrcode_loginform").elements[0].value = username;
                jQuery('#mo2f_show_qrcode_loginform').submit();

            }

            jQuery('#mo2fa_usernamekey').keypress(function (e) {
                if (e.which == 13) {//Enter key pressed
                    e.preventDefault();
                    var username = jQuery('#mo2fa_usernamekey').val();
                    document.getElementById("mo2f_show_qrcode_loginform").elements[0].value = username;
                    jQuery('#mo2f_show_qrcode_loginform').submit();
                }

            });
        </script>
		<?php
	}

	function miniorange_login_footer_form() {

		?>
        <input type="hidden" name="miniorange_login_nonce"
               value="<?php echo wp_create_nonce( 'miniorange-2-factor-login-nonce' ); ?>"/>
        <form name="f" id="mo2f_backto_mo_loginform" method="post" action="<?php echo wp_login_url(); ?>" hidden>
            <input type="hidden" name="miniorange_mobile_validation_failed_nonce"
                   value="<?php echo wp_create_nonce( 'miniorange-2-factor-mobile-validation-failed-nonce' ); ?>"/>
        </form>
        <form name="f" id="mo2f_show_qrcode_loginform" method="post" action="" hidden>
            <input type="text" name="mo2fa_username" id="mo2fa_username" hidden/>
            <input type="hidden" name="miniorange_login_nonce"
                   value="<?php echo wp_create_nonce( 'miniorange-2-factor-login-nonce' ); ?>"/>
        </form>
		<?php

	}
}

?>