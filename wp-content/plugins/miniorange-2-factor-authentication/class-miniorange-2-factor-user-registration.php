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
class Miniorange_User_Register {

	function __construct() {
		add_action( 'admin_init', array( $this, 'miniorange_user_save_settings' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'plugin_settings_style' ) );
	}

	function plugin_settings_style() {
		wp_enqueue_style( 'mo_2_factor_admin_settings_style', plugins_url( 'includes/css/style_settings.css?version=5.0.6', __FILE__ ) );
	}

	function mo_auth_success_message() {
		$message = get_option( 'mo2f_message' ); ?>
        <script>

            jQuery(document).ready(function () {

                var message = "<?php echo $message; ?>";
                jQuery('#messages').append("<div class='error notice is-dismissible mo2f_error_container'> <p class='mo2f_msgs'>" + message + "</p></div>");
            });
        </script>
		<?php
	}

	function mo_auth_error_message() {
		$message = get_option( 'mo2f_message' ); ?>
        <script>
            jQuery(document).ready(function () {

                var message = "<?php echo $message; ?>";
                jQuery('#messages').append("<div class='updated notice is-dismissible mo2f_success_container'> <p class='mo2f_msgs'>" + message + "</p></div>");

                jQuery('a[href=\"#test\"]').click(function () {
                    var currentMethod = jQuery(this).data("method");

                    if (currentMethod == 'MOBILE AUTHENTICATION') {
                        jQuery('#mo2f_2factor_test_mobile_form').submit();
                    } else if (currentMethod == 'PUSH NOTIFICATIONS') {
                        jQuery('#mo2f_2factor_test_push_form').submit();
                    } else if (currentMethod == 'SOFT TOKEN') {
                        jQuery('#mo2f_2factor_test_softtoken_form').submit();
                    } else if (currentMethod == 'SMS' || currentMethod == 'PHONE VERIFICATION') {
                        jQuery('#mo2f_test_2factor_method').val(currentMethod);
                        jQuery('#mo2f_2factor_test_smsotp_form').submit();
                    } else if (currentMethod == 'OUT OF BAND EMAIL') {
                        jQuery('#mo2f_2factor_test_out_of_band_email_form').submit();
                    } else if (currentMethod == 'GOOGLE AUTHENTICATOR') {
                        jQuery('#mo2f_2factor_test_google_auth_form').submit();
                    }
                });

            });
        </script>
		<?php
	}

	public function mo2f_register_user() {
		global $wpdb;
		global $Mo2fdbQueries;
		global $user;
		$user = wp_get_current_user();
		if ( mo_2factor_is_curl_installed() == 0 ) { ?>
            <p style="color:red;"> (<?php echo mo2f_lt( 'Warning: ' ); ?><a
                        href="http://php.net/manual/en/curl.installation.php"
                        target="_blank"> <?php echo mo2f_lt( 'PHP CURL extension' ); ?></a> <?php echo mo2f_lt( 'is not installed or disabled' ); ?>
                )</p>
			<?php
		}


		$mo2f_active_tab                     = isset( $_GET['mo2f_tab'] ) ? $_GET['mo2f_tab'] : '2factor_setup';
		$mo_2factor_user_registration_status = $Mo2fdbQueries->get_user_detail( 'mo_2factor_user_registration_status', $user->ID );

		?>

        <div class="wrap">
        <div><img style="float:left;" src="<?php echo plugins_url( 'includes/images/logo.png"', __FILE__ ); ?>"></div>
        <div style="display:block;font-size:23px;padding:9px 0 10px;line-height:29px; margin-left:3%">
            <a class="add-new-h2" href="https://faq.miniorange.com/kb/two-factor-authentication"
               target="_blank"><?php echo mo2f_lt( 'FAQ' ); ?></a>
        </div>
        <div id="tab">
            <h2 class="nav-tab-wrapper">
                <a href="admin.php?page=miniOrange_2_factor_settings&amp;mo2f_tab=2factor_setup"
                   class="nav-tab <?php echo $mo2f_active_tab == '2factor_setup' ? 'nav-tab-active' : ''; ?>"
                   id="mo2f_tab1"><?php if ( in_array( $mo_2factor_user_registration_status, array(
						'MO_2_FACTOR_INITIALIZE_TWO_FACTOR',
						'MO_2_FACTOR_INITIALIZE_MOBILE_REGISTRATION',
						'MO_2_FACTOR_PLUGIN_SETTINGS'
					) ) ) { ?><?php echo mo2f_lt( 'User Profile ' ); ?><?php } else { ?><?php echo mo2f_lt( 'Account Setup ' ); ?><?php } ?></a>
                <a href="admin.php?page=miniOrange_2_factor_settings&amp;mo2f_tab=mobile_configure"
                   class="nav-tab <?php echo $mo2f_active_tab == 'mobile_configure' ? 'nav-tab-active' : ''; ?>"
                   id="mo2f_tab2"><?php echo mo2f_lt( 'Setup Two-Factor' ); ?></a>
            </h2>
        </div>

        <div class="mo2f_container">
            <div id="messages"></div>
            <table style="width:100%;padding:20px;">
                <tr>
                    <td style="width:60%;vertical-align:top;">
						<?php
						$session_variables = array( 'mo2f_google_auth', 'mo2f_mobile_support' );
						if ( $mo2f_active_tab == 'mobile_configure' ) {
							$mo2f_second_factor = mo2f_get_activated_second_factor( $user );

							mo2f_select_2_factor_method( $user, $mo2f_second_factor );
							?>
                            <script>
                                jQuery(document).ready(function () {
                                    jQuery("#mo2f_support_table").hide();
                                });
                            </script>
							<?php
						} else if ( get_option( 'mo2f_remember_device' ) && $mo2f_active_tab == 'advance_option' ) {
							MO2f_Utility::unset_session_variables( $session_variables );
							show_2_factor_advanced_options( $user ); //Login Settings tab
						} else {
							MO2f_Utility::unset_session_variables( $session_variables );
							if ( in_array( $mo_2factor_user_registration_status, array(
								'MO_2_FACTOR_OTP_DELIVERED_SUCCESS',
								'MO_2_FACTOR_OTP_DELIVERED_FAILURE'
							) ) ) {
								mo2f_show_user_otp_validation_page();
							} else if ( $mo_2factor_user_registration_status == 'MO_2_FACTOR_INITIALIZE_MOBILE_REGISTRATION' ) {
								$mo2f_second_factor = mo2f_get_activated_second_factor( $user );
								mo2f_show_instruction_to_allusers( $user, $mo2f_second_factor );
							} else if ( $mo_2factor_user_registration_status == 'MO_2_FACTOR_INITIALIZE_TWO_FACTOR' ) {
								mo2f_show_instruction_to_allusers( $user, 'NONE' );
							} else if ( $mo_2factor_user_registration_status == 'MO_2_FACTOR_PLUGIN_SETTINGS' ) {
								$mo2f_second_factor = mo2f_get_activated_second_factor( $user );
								mo2f_show_instruction_to_allusers( $user, $mo2f_second_factor );
							} else {
								show_user_welcome_page( $user );
							}
						}
						?>
                    </td>
                    <td style="vertical-align:top;padding-left:1%;" id="mo2f_support_table">
                    </td>
                </tr>
            </table>
        </div>
		<?php
	}

	function miniorange_user_save_settings() {
		global $wpdb;
		global $Mo2fdbQueries;
		global $user;
		$user = wp_get_current_user();

		if ( ! current_user_can( 'manage_options' ) ) {
			if ( isset( $_POST['option'] ) and $_POST['option'] == "mo_2factor_validate_user_otp" ) { //validate OTP
				//validation and sanitization
				$otp_token = '';
				if ( MO2f_Utility::mo2f_check_empty_or_null( $_POST['otp_token'] ) ) {
					update_option( 'mo2f_message', Mo2fConstants::langTranslate( "INVALID_ENTRY" ) );
					$this->mo_auth_show_error_message();

					return;
				} else {
					$otp_token = sanitize_text_field( $_POST['otp_token'] );
				}
				$email = get_user_meta( $user->ID, 'user_email', true );
				if ( ! MO2f_Utility::check_if_email_is_already_registered( $email ) ) {
					$customer      = new Customer_Setup();
					$transactionId = get_user_meta( $user->ID, 'mo_2fa_verify_otp_create_account', true );

					$content = json_decode( $customer->validate_otp_token( 'EMAIL', null, $transactionId, $otp_token, get_option( 'mo2f_customerKey' ), get_option( 'mo2f_api_key' ) ), true );
					if ( $content['status'] == 'ERROR' ) {
						update_option( 'mo2f_message', Mo2fConstants:: langTranslate( $content['message'] ) );
						delete_user_meta( $user->ID, 'mo_2fa_verify_otp_create_account' );
						$this->mo_auth_show_error_message();
					} else {
						if ( strcasecmp( $content['status'], 'SUCCESS' ) == 0 ) { //OTP validated and generate QRCode
							$this->mo2f_create_user( $user, get_user_meta( $user->ID, 'user_email', true ) );
							delete_user_meta( $user->ID, 'mo_2fa_verify_otp_create_account' );
						} else {  // OTP Validation failed.
							update_option( 'mo2f_message', Mo2fConstants::langTranslate( "INVALID_OTP" ) );
							$Mo2fdbQueries->update_user_details( $user->ID, array( 'mo_2factor_user_registration_status' => 'MO_2_FACTOR_OTP_DELIVERED_FAILURE' ) );
							$this->mo_auth_show_error_message();
						}
					}

				} else {
					update_option( 'mo2f_message', Mo2fConstants::langTranslate( "EMAIL_IN_USE" ) );
					$this->mo_auth_show_error_message();
				}
			}
		}

	}

	private function mo_auth_show_error_message() {
		remove_action( 'admin_notices', array( $this, 'mo_auth_error_message' ) );
		add_action( 'admin_notices', array( $this, 'mo_auth_success_message' ) );
	}

	function mo2f_create_user( $user, $email ) {  //creating user in miniOrange of wordpress non-admin
		global $Mo2fdbQueries;
		$email      = strtolower( $email );
		$enduser    = new Two_Factor_Setup();
		$check_user = json_decode( $enduser->mo_check_user_already_exist( $email ), true );
		if ( json_last_error() == JSON_ERROR_NONE ) {
			if ( $check_user['status'] == 'ERROR' ) {
				update_option( 'mo2f_message', Mo2fConstants::langTranslate( $check_user['message'] ) );
				$this->mo_auth_show_error_message();
			} else {
				if ( strcasecmp( $check_user['status'], 'USER_FOUND' ) == 0 ) {
					delete_user_meta( $user->ID, 'user_email' );

					$Mo2fdbQueries->update_user_details( $user->ID, array(
						'user_registration_with_miniorange'   => 'SUCCESS',
						'mo2f_user_email'                     => $email,
						'mo_2factor_user_registration_status' => 'MO_2_FACTOR_INITIALIZE_TWO_FACTOR',
					) );
					$enduser->mo2f_update_userinfo( $email, 'OUT OF BAND EMAIL', null, null, null );
					$message = Mo2fConstants::langTranslate( "REGISTRATION_SUCCESS" ) . ' <a href=\"admin.php?page=miniOrange_2_factor_settings&amp;mo2f_tab=mobile_configure\" >' . Mo2fConstants::langTranslate( "CLICK_HERE" ) . '</a> ' . Mo2fConstants::langTranslate( "CONFIGURE_2FA" );
					update_option( 'mo2f_message', $message );
					$this->mo_auth_show_success_message();
					header( 'Location: admin.php?page=miniOrange_2_factor_settings&mo2f_tab=mobile_configure' );

				} else if ( strcasecmp( $check_user['status'], 'USER_NOT_FOUND' ) == 0 ) {
					$content = json_decode( $enduser->mo_create_user( $user, $email ), true );
					if ( json_last_error() == JSON_ERROR_NONE ) {
						if ( $content['status'] == 'ERROR' ) {
							update_option( 'mo2f_message', Mo2fConstants::langTranslate( $content['message'] ) );
						} else {
							if ( strcasecmp( $content['status'], 'SUCCESS' ) == 0 ) {
								delete_user_meta( $user->ID, 'user_email' );
								$Mo2fdbQueries->update_user_details( $user->ID, array(
									'user_registration_with_miniorange'   => 'SUCCESS',
									'mo2f_user_email'                     => $email,
									'mo_2factor_user_registration_status' => 'MO_2_FACTOR_INITIALIZE_TWO_FACTOR',
								) );
								$enduser->mo2f_update_userinfo( $email, 'OUT OF BAND EMAIL', null, null, null );
								$message = Mo2fConstants::langTranslate( "REGISTRATION_SUCCESS" ) . ' <a href=\"admin.php?page=miniOrange_2_factor_settings&amp;mo2f_tab=mobile_configure\" > ' . Mo2fConstants::langTranslate( "CLICK_HERE" ) . '</a> ' . Mo2fConstants::langTranslate( "CONFIGURE_2FA" );
								update_option( 'mo2f_message', $message );
								$this->mo_auth_show_success_message();
								header( 'Location: admin.php?page=miniOrange_2_factor_settings&mo2f_tab=mobile_configure' );

							} else {
								update_option( 'mo2f_message', Mo2fConstants::langTranslate( "ERROR_DURING_USER_REGISTRATION" ) );
								$this->mo_auth_show_error_message();
							}
						}
					} else {
						update_option( 'mo2f_message', Mo2fConstants::langTranslate( "ERROR_DURING_USER_REGISTRATION_ADMIN" ) );
						$this->mo_auth_show_error_message();
					}
				} else {
					update_option( 'mo2f_message', Mo2fConstants::langTranslate( "ERROR_DURING_USER_REGISTRATION" ) );
					$this->mo_auth_show_error_message();
				}
			}
		} else {
			update_option( 'mo2f_message', Mo2fConstants::langTranslate( "ERROR_DURING_USER_REGISTRATION" ) );
			$this->mo_auth_show_error_message();
		}
	}

	private function mo_auth_show_success_message() {
		remove_action( 'admin_notices', array( $this, 'mo_auth_success_message' ) );
		add_action( 'admin_notices', array( $this, 'mo_auth_error_message' ) );
	}

}