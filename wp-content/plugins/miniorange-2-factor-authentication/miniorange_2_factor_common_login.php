<?php
function mo2f_collect_device_attributes_handler( $redirect_to = null ) {
	?>
    <html>
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
		<?php
		echo '<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>';
		?>
    </head>
    <body>
    <div>
        <form id="morba_loginform" method="post">
            <h1><?php echo mo2f_lt( 'Please wait' ); ?>...</h1>
            <img src="<?php echo plugins_url( 'includes/images/ajax-loader-login.gif', __FILE__ ); ?>"/>
			<?php
			if ( get_site_option( 'mo2f_remember_device' ) ) {
				?>
                <p><input type="hidden" id="miniorange_rba_attribures" name="miniorange_rba_attribures" value=""/></p>
				<?php
				echo '<script src="' . plugins_url( 'includes/js/rba/js/jquery-1.9.1.js', __FILE__ ) . '" ></script>';
				echo '<script src="' . plugins_url( 'includes/js/rba/js/jquery.flash.js', __FILE__ ) . '" ></script>';
				echo '<script src="' . plugins_url( 'includes/js/rba/js/ua-parser.js', __FILE__ ) . '" ></script>';
				echo '<script src="' . plugins_url( 'includes/js/rba/js/client.js', __FILE__ ) . '" ></script>';
				echo '<script src="' . plugins_url( 'includes/js/rba/js/device_attributes.js', __FILE__ ) . '" ></script>';
				echo '<script src="' . plugins_url( 'includes/js/rba/js/swfobject.js', __FILE__ ) . '" ></script>';
				echo '<script src="' . plugins_url( 'includes/js/rba/js/fontdetect.js', __FILE__ ) . '" ></script>';
				echo '<script src="' . plugins_url( 'includes/js/rba/js/murmurhash3.js', __FILE__ ) . '" ></script>';
				echo '<script src="' . plugins_url( 'includes/js/rba/js/miniorange-fp.js', __FILE__ ) . '" ></script>';
			}
			?>
            <input type="hidden" name="miniorange_attribute_collection_nonce"
                   value="<?php echo wp_create_nonce( 'miniorange-2-factor-login-attribute-collection-nonce' ); ?>"/>
            <input type="hidden" name="redirect_to" value="<?php echo $redirect_to; ?>"/>
        </form>
    </div>
    </body>
    </html>
	<?php
}

function miniorange_get_user_role( $user ) {
	return $user->roles;
}

function miniorange_check_if_2fa_enabled_for_roles( $current_roles ) {
	if ( empty( $current_roles ) ) {
		return 0;
	}

	foreach ( $current_roles as $value ) {
		if ( get_site_option( 'mo2fa_' . $value ) ) {
			return 1;
		}
	}

	return 0;
}

function redirect_user_to( $user, $redirect_to ) {
	$roles        = $user->roles;
	$current_role = array_shift( $roles );
	$redirectUrl  = isset( $redirect_to ) && ! empty( $redirect_to ) ? $redirect_to : null;
	if ( $current_role == 'administrator' ) {
		$redirectUrl = empty( $redirectUrl ) ? admin_url() : $redirectUrl;
		wp_redirect( $redirectUrl );
	} else {
		$redirectUrl = empty( $redirectUrl ) ? home_url() : $redirectUrl;
		wp_redirect( $redirectUrl );
	}
}


function mo2f_register_profile( $email, $deviceKey, $mo2f_rba_status ) {

	if ( isset( $deviceKey ) && $deviceKey == 'true' ) {
		if ( $mo2f_rba_status['status'] == 'WAIT_FOR_INPUT' && $mo2f_rba_status['decision_flag'] ) {
			$rba_profile = new Miniorange_Rba_Attributes();
			//register profile
			json_decode( $rba_profile->mo2f_register_rba_profile( $email, $mo2f_rba_status['sessionUuid'] ), true );

			return true;
		} else {
			return false;
		}
	}

	return false;
}

function mo2f_collect_attributes( $email, $attributes ) {
	$mo2f_rba_status                  = array();
	$mo2f_rba_status['decision_flag'] = false;
	$mo2f_rba_status['sessionUuid']   = '';

	if ( get_option( 'mo2f_remember_device' ) ) {
		$rba_attributes = new Miniorange_Rba_Attributes();
		//collect rba attributes
		$rba_response = json_decode( $rba_attributes->mo2f_collect_attributes( $email, $attributes ), true );
		if ( json_last_error() == JSON_ERROR_NONE ) {
			//attributes are collected successfully
			if ( $rba_response['status'] == 'SUCCESS' ) {
				$sessionUuid = $rba_response['sessionUuid'];
				// evaluate the rba risk
				$rba_risk_response = json_decode( $rba_attributes->mo2f_evaluate_risk( $email, $sessionUuid ), true );

				if ( json_last_error() == JSON_ERROR_NONE ) {
					if ( $rba_risk_response['status'] == 'SUCCESS' || $rba_risk_response['status'] == 'WAIT_FOR_INPUT' ) {

						$mo2f_rba_status['status']        = $rba_risk_response['status'];
						$mo2f_rba_status['sessionUuid']   = $sessionUuid;
						$mo2f_rba_status['decision_flag'] = true;

					} else {
						$mo2f_rba_status['status']      = $rba_risk_response['status'];
						$mo2f_rba_status['sessionUuid'] = $sessionUuid;

					}
				} else {
					$mo2f_rba_status['status']      = 'JSON_EVALUATE_ERROR';
					$mo2f_rba_status['sessionUuid'] = $sessionUuid;

				}
			} else {
				$mo2f_rba_status['status'] = 'ATTR_NOT_COLLECTED';

			}
		} else {
			$mo2f_rba_status['status'] = 'JSON_ATTR_NOT_COLLECTED';

		}
	} else {
		$mo2f_rba_status['status'] = 'RBA_NOT_ENABLED';

	}

	return $mo2f_rba_status;
}

function mo2f_get_user_2ndfactor( $user ) {
	global $Mo2fdbQueries;

	$mo2f_user_email = $Mo2fdbQueries->get_user_detail( 'mo2f_user_email', $user->ID );
	$enduser         = new Two_Factor_Setup();
	$userinfo        = json_decode( $enduser->mo2f_get_userinfo( $mo2f_user_email ), true );
	if ( json_last_error() == JSON_ERROR_NONE ) {
		if ( $userinfo['status'] == 'ERROR' ) {
			$mo2f_second_factor = 'NONE';
		} else if ( $userinfo['status'] == 'SUCCESS' ) {
			$mo2f_second_factor = $userinfo['authType'];
		} else if ( $userinfo['status'] == 'FAILED' ) {
			$mo2f_second_factor = 'USER_NOT_FOUND';
		} else {
			$mo2f_second_factor = 'NONE';
		}
	} else {
		$mo2f_second_factor = 'NONE';
	}

	return $mo2f_second_factor;
}

function mo2f_get_forgotphone_form( $login_status, $login_message, $redirect_to ) {
	$mo2f_forgotphone_enabled     = get_option( 'mo2f_enable_forgotphone' );
	$mo2f_email_as_backup_enabled = get_option( 'mo2f_enable_forgotphone_email' );
	$mo2f_kba_as_backup_enabled   = get_option( 'mo2f_enable_forgotphone_kba' );
	?>
    <html>
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
		<?php
		echo_js_css_files(); ?>
    </head>
    <body>
    <div class="mo2f_modal" tabindex="-1" role="dialog">
        <div class="mo2f-modal-backdrop"></div>
        <div class="mo_customer_validation-modal-dialog mo_customer_validation-modal-md">
            <div class="login mo_customer_validation-modal-content">
                <div class="mo2f_modal-header">
                    <h4 class="mo2f_modal-title">
                        <button type="button" class="mo2f_close" data-dismiss="modal" aria-label="Close"
                                title="<?php echo mo2f_lt( 'Back to login' ); ?>"
                                onclick="mologinback();"><span aria-hidden="true">&times;</span></button>
						<?php echo mo2f_lt( 'How would you like to authenticate yourself?' ); ?>
                    </h4>
                </div>
                <div class="mo2f_modal-body">
					<?php if ( $mo2f_forgotphone_enabled ) {
						if ( isset( $login_message ) && ! empty( $login_message ) ) { ?>
                            <div id="otpMessage" class="mo2fa_display_message_frontend">
                                <p cclass="mo2fa_display_message_frontend"><?php echo $login_message; ?></p>
                            </div>
						<?php } ?>
                        <p class="mo2f_backup_options"><?php echo mo2f_lt( 'Please choose the options from below:' ); ?></p>
                        <div class="mo2f_backup_options_div">
							<?php if ( $mo2f_email_as_backup_enabled ) { ?>
                                <input type="radio" name="mo2f_selected_forgotphone_option"
                                       value="One Time Passcode over Email"
                                       checked="checked"/><?php echo mo2f_lt( 'Send a one time passcode to my registered email' ); ?>
                                <br><br>
							<?php }
							if ( $mo2f_kba_as_backup_enabled ) { ?>
                                <input type="radio" name="mo2f_selected_forgotphone_option"
                                       value="KBA"/><?php echo mo2f_lt( 'Answer your Security Questions (KBA)' ); ?>
							<?php } ?>
                            <br><br>
                            <input type="button" name="miniorange_validate_otp"
                                   value=<?php echo mo2f_lt( 'Continue' ); ?> class="miniorange_validate_otp"
                                   onclick="mo2fselectforgotphoneoption();"/>
                        </div>
						<?php mo2f_customize_logo();
					}
					?>
                </div>
            </div>
        </div>
    </div>
    <form name="f" id="mo2f_backto_mo_loginform" method="post" action="<?php echo wp_login_url(); ?>"
          class="mo2f_display_none_forms">
        <input type="hidden" name="miniorange_mobile_validation_failed_nonce"
               value="<?php echo wp_create_nonce( 'miniorange-2-factor-mobile-validation-failed-nonce' ); ?>"/>
    </form>
    <form name="f" id="mo2f_challenge_forgotphone_form" method="post" class="mo2f_display_none_forms">
        <input type="hidden" name="mo2f_configured_2FA_method"/>
        <input type="hidden" name="miniorange_challenge_forgotphone_nonce"
               value="<?php echo wp_create_nonce( 'miniorange-2-factor-challenge-forgotphone-nonce' ); ?>"/>
        <input type="hidden" name="redirect_to" value="<?php echo $redirect_to; ?>"/>
    </form>

    <script>
        function mologinback() {
            jQuery('#mo2f_backto_mo_loginform').submit();
        }

        function mo2fselectforgotphoneoption() {
            var option = jQuery('input[name=mo2f_selected_forgotphone_option]:checked').val();
            document.getElementById("mo2f_challenge_forgotphone_form").elements[0].value = option;
            jQuery('#mo2f_challenge_forgotphone_form').submit();
        }
    </script>
    </body>
    </html>
<?php }

function mo2f_get_kba_authentication_prompt( $login_message, $redirect_to ) {
	$mo2f_login_option            = get_option( 'mo2f_login_option' );
	$mo2f_remember_device_enabled = get_option( 'mo2f_remember_device' );
	?>
    <html>
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
		<?php
		echo_js_css_files(); ?>
    </head>
    <body>
    <div class="mo2f_modal" tabindex="-1" role="dialog">
        <div class="mo2f-modal-backdrop"></div>
        <div class="mo_customer_validation-modal-dialog mo_customer_validation-modal-md">
            <div class="login mo_customer_validation-modal-content">
                <div class="mo2f_modal-header">
                    <h4 class="mo2f_modal-title">
                        <button type="button" class="mo2f_close" data-dismiss="modal" aria-label="Close"
                                title="<?php echo mo2f_lt( 'Back to login' ); ?>"
                                onclick="mologinback();"><span aria-hidden="true">&times;</span></button>
						<?php
						echo mo2f_lt( 'Validate Security Questions' ); ?>
                    </h4>
                </div>
                <div class="mo2f_modal-body">
                    <div id="kbaSection" class="kbaSectiondiv">
                        <div id="otpMessage">
                            <p style="font-size:13px;"
                               class="mo2fa_display_message_frontend"><?php echo ( isset( $login_message ) && ! empty( $login_message ) ) ? $login_message : __( 'Please answer the following questions:' ); ?></p>
                        </div>
                        <form name="f" id="mo2f_submitkba_loginform" method="post">
                            <div id="mo2f_kba_content">
                                <p style="font-size:15px;">
									<?php $kba_questions = MO2f_Utility::mo2f_retrieve_session_or_cookie_values( 'mo_2_factor_kba_questions' );
									echo $kba_questions[0]; ?><br>
                                    <input class="mo2f-textbox" type="password" name="mo2f_answer_1" id="mo2f_answer_1"
                                           required="true" autofocus="true"
                                           pattern="(?=\S)[A-Za-z0-9_@.$#&amp;+-\s]{1,100}"
                                           title="Only alphanumeric letters with special characters(_@.$#&amp;+-) are allowed."
                                           autocomplete="off"><br>
									<?php echo $kba_questions[1]; ?><br>
                                    <input class="mo2f-textbox" type="password" name="mo2f_answer_2" id="mo2f_answer_2"
                                           required="true" pattern="(?=\S)[A-Za-z0-9_@.$#&amp;+-\s]{1,100}"
                                           title="Only alphanumeric letters with special characters(_@.$#&amp;+-) are allowed."
                                           autocomplete="off">

                                </p>
                            </div>
							<?php if ( $mo2f_login_option && $mo2f_remember_device_enabled ) {
								?>
                                <span class="mo2f_rememberdevice">
                                    <input type="checkbox" name="mo2f_trust_device" class="mo2f_trust_device"
                                           id="mo2f_trust_device"/><?php echo mo2f_lt( 'Remember this device.' ); ?>
                                </span>
                                <br>
                                <br>
								<?php
							}
							?>
                            <input type="submit" name="miniorange_kba_validate" id="miniorange_kba_validate"
                                   class="miniorange_kba_validate" style="float:left;"
                                   value="<?php echo mo2f_lt( 'Validate' ); ?>"/>
                            <input type="hidden" name="miniorange_kba_nonce"
                                   value="<?php echo wp_create_nonce( 'miniorange-2-factor-kba-nonce' ); ?>"/>
                            <input type="hidden" name="redirect_to" value="<?php echo $redirect_to; ?>"/>
                        </form>
                        <br>
                    </div>
					<?php mo2f_customize_logo() ?>
                </div>
            </div>
        </div>
    </div>
    <form name="f" id="mo2f_backto_mo_loginform" method="post" action="<?php echo wp_login_url(); ?>"
          class="mo2f_display_none_forms">
        <input type="hidden" name="miniorange_mobile_validation_failed_nonce"
               value="<?php echo wp_create_nonce( 'miniorange-2-factor-mobile-validation-failed-nonce' ); ?>"/>
    </form>

    <script>
        function mologinback() {
            jQuery('#mo2f_backto_mo_loginform').submit();
        }
    </script>
    </body>

    </html>
	<?php
}

function mo2f_get_push_notification_oobemail_prompt( $id, $login_status, $login_message, $redirect_to ) {
	global $Mo2fdbQueries;
	$mo2f_enable_forgotphone = get_option( 'mo2f_enable_forgotphone' );
	$mo2f_KBA_config_status  = $Mo2fdbQueries->get_user_detail( 'mo2f_SecurityQuestions_config_status', $id );
	$mo2f_is_new_customer    = get_option( 'mo2f_is_NC' );
	?>
    <html>
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
		<?php
		echo_js_css_files(); ?>
    </head>
    <body>
    <div class="mo2f_modal" tabindex="-1" role="dialog">
        <div class="mo2f-modal-backdrop"></div>
        <div class="mo_customer_validation-modal-dialog mo_customer_validation-modal-md">
            <div class="login mo_customer_validation-modal-content">
                <div class="mo2f_modal-header">
                    <h4 class="mo2f_modal-title">
                        <button type="button" class="mo2f_close" data-dismiss="modal" aria-label="Close"
                                title="<?php echo mo2f_lt( 'Back to login' ); ?>"
                                onclick="mologinback();"><span aria-hidden="true">&times;</span></button>
						<?php echo mo2f_lt( 'Accept Your Transaction' ); ?></h4>
                </div>
                <div class="mo2f_modal-body">
					<?php if ( isset( $login_message ) && ! empty( $login_message ) ) { ?>
                        <div id="otpMessage">
                            <p class="mo2fa_display_message_frontend"><?php echo $login_message; ?></p>
                        </div>
					<?php } ?>
                    <div id="pushSection">

                        <div>
                            <center>
                                <p class="mo2f_push_oob_message"><?php echo mo2f_lt( 'Waiting for your approval...' ); ?></p>
                            </center>
                        </div>
                        <div id="showPushImage">
                            <center>
                                <img src="<?php echo plugins_url( 'includes/images/ajax-loader-login.gif', __FILE__ ); ?>"/>
                            </center>
                        </div>


                        <span style="padding-right:2%;">
                           <?php if ( isset( $login_status ) && $login_status == 'MO_2_FACTOR_CHALLENGE_PUSH_NOTIFICATIONS' ) { ?>
                               <center>
                                   <?php if ( $mo2f_enable_forgotphone && ! $mo2f_is_new_customer ) { ?>
                                       <input type="button" name="miniorange_login_forgotphone"
                                              onclick="mologinforgotphone();" id="miniorange_login_forgotphone"
                                              class="miniorange_login_forgotphone"
                                              value="<?php echo mo2f_lt( 'Forgot Phone?' ); ?>"/>
                                   <?php } ?>
                                   &emsp;&emsp;
                              <input type="button" name="miniorange_login_offline" onclick="mologinoffline();"
                                     id="miniorange_login_offline" class="miniorange_login_offline"
                                     value="<?php echo mo2f_lt( 'Phone is Offline?' ); ?>"/>
                           </center>
                           <?php } else if ( isset( $login_status ) && $login_status == 'MO_2_FACTOR_CHALLENGE_OOB_EMAIL' && $mo2f_enable_forgotphone && $mo2f_KBA_config_status ) { ?>
                               <center>
                              <a href="#mo2f_alternate_login_kba">
                                 <p class="mo2f_push_oob_backup"><?php echo mo2f_lt( 'Didn\'t receive mail?' ); ?></p>
                              </a>
                           </center>
                           <?php } ?>
                        </span>
                    </div>

					<?php mo2f_customize_logo() ?>
                </div>
            </div>
        </div>
    </div>
    <form name="f" id="mo2f_backto_mo_loginform" method="post" action="<?php echo wp_login_url(); ?>"
          class="mo2f_display_none_forms">
        <input type="hidden" name="miniorange_mobile_validation_failed_nonce"
               value="<?php echo wp_create_nonce( 'miniorange-2-factor-mobile-validation-failed-nonce' ); ?>"/>
    </form>
    <form name="f" id="mo2f_mobile_validation_form" method="post" class="mo2f_display_none_forms">
        <input type="hidden" name="miniorange_mobile_validation_nonce"
               value="<?php echo wp_create_nonce( 'miniorange-2-factor-mobile-validation-nonce' ); ?>"/>
        <input type="hidden" name="redirect_to" value="<?php echo $redirect_to; ?>"/>
    </form>
    <form name="f" id="mo2f_show_softtoken_loginform" method="post" class="mo2f_display_none_forms">
        <input type="hidden" name="miniorange_softtoken"
               value="<?php echo wp_create_nonce( 'miniorange-2-factor-softtoken' ); ?>"/>
        <input type="hidden" name="redirect_to" value="<?php echo $redirect_to; ?>"/>
    </form>
    <form name="f" id="mo2f_show_forgotphone_loginform" method="post" class="mo2f_display_none_forms">
        <input type="hidden" name="request_origin_method" value="<?php echo $login_status; ?>"/>
        <input type="hidden" name="miniorange_forgotphone"
               value="<?php echo wp_create_nonce( 'miniorange-2-factor-forgotphone' ); ?>"/>
        <input type="hidden" name="redirect_to" value="<?php echo $redirect_to; ?>"/>
    </form>
    <form name="f" id="mo2f_alternate_login_kbaform" method="post" class="mo2f_display_none_forms">
        <input type="hidden" name="miniorange_alternate_login_kba_nonce"
               value="<?php echo wp_create_nonce( 'miniorange-2-factor-alternate-login-kba-nonce' ); ?>"/>
        <input type="hidden" name="redirect_to" value="<?php echo $redirect_to; ?>"/>
    </form>

    <script>
        var timeout;
        pollPushValidation();

        function pollPushValidation() {
            var transId = "<?php echo MO2f_Utility::mo2f_retrieve_session_or_cookie_values( 'mo2f_transactionId' ); ?>";
            var jsonString = "{\"txId\":\"" + transId + "\"}";
            var postUrl = "<?php echo get_option( 'mo2f_host_name' );  ?>" + "/moas/api/auth/auth-status";

            jQuery.ajax({
                url: postUrl,
                type: "POST",
                dataType: "json",
                data: jsonString,
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var status = JSON.parse(JSON.stringify(result)).status;
                    if (status == 'SUCCESS') {
                        jQuery('#mo2f_mobile_validation_form').submit();
                    } else if (status == 'ERROR' || status == 'FAILED' || status == 'DENIED') {
                        jQuery('#mo2f_backto_mo_loginform').submit();
                    } else {
                        timeout = setTimeout(pollPushValidation, 3000);
                    }
                }
            });
        }

        function mologinoffline() {
            jQuery('#mo2f_show_softtoken_loginform').submit();
        }

        function mologinforgotphone() {
            jQuery('#mo2f_show_forgotphone_loginform').submit();
        }

        function mologinback() {
            jQuery('#mo2f_backto_mo_loginform').submit();
        }

        jQuery('a[href="#mo2f_alternate_login_kba"]').click(function () {
            jQuery('#mo2f_alternate_login_kbaform').submit();
        });

    </script>
    </body>
    </html>
	<?php
}

function mo2f_get_qrcode_authentication_prompt( $login_status, $login_message, $redirect_to, $qrCode ) {
	$mo2f_enable_forgotphone = get_option( 'mo2f_enable_forgotphone' );
	$mo2f_is_new_customer    = get_option( 'mo2f_is_NC' );
	?>
    <html>
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
		<?php
		echo_js_css_files(); ?>
    </head>
    <body>
    <div class="mo2f_modal" tabindex="-1" role="dialog">
        <div class="mo2f-modal-backdrop"></div>
        <div class="mo_customer_validation-modal-dialog mo_customer_validation-modal-md">
            <div class="login mo_customer_validation-modal-content">
                <div class="mo2f_modal-header">
                    <h4 class="mo2f_modal-title">
                        <button type="button" class="mo2f_close" data-dismiss="modal" aria-label="Close"
                                title="<?php echo mo2f_lt( 'Back to login' ); ?>"
                                onclick="mologinback();"><span aria-hidden="true">&times;</span></button>
						<?php echo mo2f_lt( 'Scan QR Code' ); ?></h4>
                </div>
                <div class="mo2f_modal-body center">
					<?php if ( isset( $login_message ) && ! empty( $login_message ) ) { ?>
                        <div id="otpMessage">
                            <p class="mo2fa_display_message_frontend"><?php echo $login_message; ?></p>
                        </div>
                        <br>
					<?php } ?>
                    <div id="scanQRSection">
                        <div style="margin-bottom:10%;">
                            <center>
                                <p class="mo2f_login_prompt_messages"><?php echo mo2f_lt( 'Identify yourself by scanning the QR code with miniOrange Authenticator app.' ); ?></p>
                            </center>
                        </div>
                        <div id="showQrCode" style="margin-bottom:10%;">
                            <center><?php echo '<img src="data:image/jpg;base64,' . $qrCode . '" />'; ?></center>
                        </div>
                        <span style="padding-right:2%;">
                           <center>
			   <?php if ( ! $mo2f_is_new_customer ) { ?>
				   <?php if ( $mo2f_enable_forgotphone ) { ?>
                       <input type="button" name="miniorange_login_forgotphone" onclick="mologinforgotphone();"
                              id="miniorange_login_forgotphone" class="miniorange_login_forgotphone"
                              style="margin-right:5%;"
                              value="<?php echo mo2f_lt( 'Forgot Phone?' ); ?>"/>
				   <?php } ?>
                   &emsp;&emsp;
			   <?php } ?>
                               <input type="button" name="miniorange_login_offline" onclick="mologinoffline();"
                                      id="miniorange_login_offline" class="miniorange_login_offline"
                                      value="<?php echo mo2f_lt( 'Phone is Offline?' ); ?>"/>
                        </center>
                     </span>
                    </div>
					<?php mo2f_customize_logo() ?>
                </div>
            </div>
        </div>
    </div>
    <form name="f" id="mo2f_backto_mo_loginform" method="post" action="<?php echo wp_login_url(); ?>"
          class="mo2f_display_none_forms">
        <input type="hidden" name="miniorange_mobile_validation_failed_nonce"
               value="<?php echo wp_create_nonce( 'miniorange-2-factor-mobile-validation-failed-nonce' ); ?>"/>
    </form>
    <form name="f" id="mo2f_mobile_validation_form" method="post" class="mo2f_display_none_forms">
        <input type="hidden" name="miniorange_mobile_validation_nonce"
               value="<?php echo wp_create_nonce( 'miniorange-2-factor-mobile-validation-nonce' ); ?>"/>
        <input type="hidden" name="redirect_to" value="<?php echo $redirect_to; ?>"/>
    </form>
    <form name="f" id="mo2f_show_softtoken_loginform" method="post" class="mo2f_display_none_forms">
        <input type="hidden" name="miniorange_softtoken"
               value="<?php echo wp_create_nonce( 'miniorange-2-factor-softtoken' ); ?>"/>
        <input type="hidden" name="redirect_to" value="<?php echo $redirect_to; ?>"/>
    </form>
    <form name="f" id="mo2f_show_forgotphone_loginform" method="post" class="mo2f_display_none_forms">
        <input type="hidden" name="request_origin_method" value="<?php echo $login_status; ?>"/>
        <input type="hidden" name="miniorange_forgotphone"
               value="<?php echo wp_create_nonce( 'miniorange-2-factor-forgotphone' ); ?>"/>
        <input type="hidden" name="redirect_to" value="<?php echo $redirect_to; ?>"/>
    </form>
    <script>
        var timeout;
        pollMobileValidation();

        function pollMobileValidation() {
            var transId = "<?php echo MO2f_Utility::mo2f_retrieve_session_or_cookie_values( 'mo2f_transactionId' ); ?>";
            var jsonString = "{\"txId\":\"" + transId + "\"}";
            var postUrl = "<?php echo get_option( 'mo2f_host_name' );  ?>" + "/moas/api/auth/auth-status";
            jQuery.ajax({
                url: postUrl,
                type: "POST",
                dataType: "json",
                data: jsonString,
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var status = JSON.parse(JSON.stringify(result)).status;
                    if (status == 'SUCCESS') {
                        var content = "<div id='success'><center><img src='" + "<?php echo plugins_url( 'includes/images/right.png', __FILE__ );?>" + "' /></center></div>";
                        jQuery("#showQrCode").empty();
                        jQuery("#showQrCode").append(content);
                        setTimeout(function () {
                            jQuery("#mo2f_mobile_validation_form").submit();
                        }, 100);
                    } else if (status == 'ERROR' || status == 'FAILED') {
                        var content = "<div id='error'><center><img src='" + "<?php echo plugins_url( 'includes/images/wrong.png', __FILE__ );?>" + "' /></center></div>";
                        jQuery("#showQrCode").empty();
                        jQuery("#showQrCode").append(content);
                        setTimeout(function () {
                            jQuery('#mo2f_backto_mo_loginform').submit();
                        }, 1000);
                    } else {
                        timeout = setTimeout(pollMobileValidation, 3000);
                    }
                }
            });
        }

        function mologinoffline() {
            jQuery('#mo2f_show_softtoken_loginform').submit();
        }

        function mologinforgotphone() {
            jQuery('#mo2f_show_forgotphone_loginform').submit();
        }

        function mologinback() {
            jQuery('#mo2f_backto_mo_loginform').submit();
        }

    </script>
    </body>
    </html>
	<?php
}

function mo2f_get_otp_authentication_prompt( $login_status, $login_message, $redirect_to ) {
	$mo2f_enable_forgotphone = get_option( 'mo2f_enable_forgotphone' );
	$mo2f_is_new_customer    = get_option( 'mo2f_is_NC' );
	?>
    <html>
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
		<?php
		echo_js_css_files();
		?>
    </head>
    <body>
    <div class="mo2f_modal" tabindex="-1" role="dialog">
        <div class="mo2f-modal-backdrop"></div>
        <div class="mo_customer_validation-modal-dialog mo_customer_validation-modal-md">
            <div class="login mo_customer_validation-modal-content">
                <div class="mo2f_modal-header">
                    <h4 class="mo2f_modal-title">
                        <button type="button" class="mo2f_close" data-dismiss="modal" aria-label="Close"
                                title="<?php echo mo2f_lt( 'Back to login' ); ?>"
                                onclick="mologinback();"><span aria-hidden="true">&times;</span></button>
						<?php echo mo2f_lt( 'Validate OTP' ); ?>
                    </h4>
                </div>
                <div class="mo2f_modal-body center">
					<?php if ( isset( $login_message ) && ! empty( $login_message ) ) { ?>
                        <div id="otpMessage">
                            <p class="mo2fa_display_message_frontend"><?php echo $login_message; ?></p>
                        </div>
					<?php } ?>
                    <br>
                    <div id="showOTP">
                        <div class="mo2f-login-container">
                            <form name="f" id="mo2f_submitotp_loginform" method="post">
                                <center>
                                    <input type="text" name="mo2fa_softtoken" style="height:28px !important;"
                                           placeholder="<?php echo mo2f_lt( 'Enter code' ); ?>"
                                           id="mo2fa_softtoken" required="true" class="mo_otp_token" autofocus="true"
                                           pattern="[0-9]{4,8}"
                                           title="<?php echo mo2f_lt( 'Only digits within range 4-8 are allowed.' ); ?>"/>
                                </center>
                                <br>
                                <input type="submit" name="miniorange_otp_token_submit" id="miniorange_otp_token_submit"
                                       class="miniorange_otp_token_submit"
                                       value="<?php echo mo2f_lt( 'Validate' ); ?>"/>
                                <input type="hidden" name="request_origin_method" value="<?php echo $login_status; ?>"/>
                                <input type="hidden" name="miniorange_soft_token_nonce"
                                       value="<?php echo wp_create_nonce( 'miniorange-2-factor-soft-token-nonce' ); ?>"/>
                                <input type="hidden" name="redirect_to" value="<?php echo $redirect_to; ?>"/>
                            </form>
                            <br>
							<?php if ( ! $mo2f_is_new_customer ) { ?>
								<?php if ( $mo2f_enable_forgotphone && isset( $login_status ) && $login_status != 'MO_2_FACTOR_CHALLENGE_OTP_OVER_EMAIL' ) { ?>
                                    <a name="miniorange_login_forgotphone" onclick="mologinforgotphone();"
                                       id="miniorange_login_forgotphone"
                                       class="mo2f-link"><?php echo mo2f_lt( 'Forgot Phone ?' ); ?></a>
								<?php } ?>

                                <br><br>
							<?php } ?>
                        </div>
                    </div>
                    </center>
					<?php mo2f_customize_logo() ?>
                </div>
            </div>
        </div>
    </div>
    <form name="f" id="mo2f_backto_mo_loginform" method="post" action="<?php echo wp_login_url(); ?>"
          class="mo2f_display_none_forms">
        <input type="hidden" name="miniorange_mobile_validation_failed_nonce"
               value="<?php echo wp_create_nonce( 'miniorange-2-factor-mobile-validation-failed-nonce' ); ?>"/>
    </form>
	<?php if ( get_option( 'mo2f_enable_forgotphone' ) && isset( $login_status ) && $login_status != 'MO_2_FACTOR_CHALLENGE_OTP_OVER_EMAIL' ) { ?>
        <form name="f" id="mo2f_show_forgotphone_loginform" method="post" action="" class="mo2f_display_none_forms">
            <input type="hidden" name="request_origin_method" value="<?php echo $login_status; ?>"/>
            <input type="hidden" name="miniorange_forgotphone"
                   value="<?php echo wp_create_nonce( 'miniorange-2-factor-forgotphone' ); ?>"/>
            <input type="hidden" name="redirect_to" value="<?php echo $redirect_to; ?>"/>
        </form>
	<?php } ?>

    <script>
        function mologinback() {
            jQuery('#mo2f_backto_mo_loginform').submit();
        }

        function mologinforgotphone() {
            jQuery('#mo2f_show_forgotphone_loginform').submit();
        }
    </script>
    </body>
    </html>
	<?php
}


function mo2f_get_device_form( $redirect_to ) {
	?>
    <html>
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
		<?php
		echo_js_css_files();
		?>
    </head>
    <body>
    <div class="mo2f_modal" tabindex="-1" role="dialog">
        <div class="mo2f-modal-backdrop"></div>
        <div class="mo_customer_validation-modal-dialog mo_customer_validation-modal-md">
            <div class="login mo_customer_validation-modal-content">
                <div class="mo2f_modal-header">
                    <h4 class="mo2f_modal-title">
                        <button type="button" class="mo2f_close" data-dismiss="modal" aria-label="Close"
                                title="<?php echo mo2f_lt( 'Back to login' ); ?>"
                                onclick="mologinback();"><span aria-hidden="true">&times;</span></button>

						<?php echo mo2f_lt( 'Remember Device' ); ?>
                    </h4>
                </div>
                <div class="mo2f_modal-body center">
                    <div id="mo2f_device_content">
                        <p class="mo2f_login_prompt_messages"><?php echo mo2f_lt( 'Do you want to remember this device?' ); ?></p>
                        <input type="button" name="miniorange_trust_device_yes" onclick="mo_check_device_confirm();"
                               id="miniorange_trust_device_yes" class="mo_green" style="margin-right:5%;"
                               value="<?php echo mo2f_lt( 'Yes' ); ?>"/>
                        <input type="button" name="miniorange_trust_device_no" onclick="mo_check_device_cancel();"
                               id="miniorange_trust_device_no" class="mo_red"
                               value="<?php echo mo2f_lt( 'No' ); ?>"/>
                    </div>
                    <div id="showLoadingBar" hidden>
                        <p class="mo2f_login_prompt_messages"><?php echo mo2f_lt( 'Please wait...We are taking you into your account.' ); ?></p>
                        <img src="<?php echo plugins_url( 'includes/images/ajax-loader-login.gif', __FILE__ ); ?>"/>
                    </div>
                    <br><br>
                    <span>
                  <?php echo mo2f_lt( 'Click on ' ); ?>
                        <i><b><?php echo mo2f_lt( 'Yes' ); ?></b></i><?php echo mo2f_lt( 'if this is your personal device.' ); ?>
                        <br>
						<?php echo mo2f_lt( 'Click on ' ); ?>
                        <i><b><?php echo mo2f_lt( 'No ' ); ?></b></i> <?php echo mo2f_lt( 'if this is a public device.' ); ?>
                  </span><br><br>
					<?php mo2f_customize_logo() ?>
                </div>
            </div>
        </div>
    </div>
    <form name="f" id="mo2f_backto_mo_loginform" method="post" action="<?php echo wp_login_url(); ?>"
          class="mo2f_display_none_forms">
        <input type="hidden" name="miniorange_mobile_validation_failed_nonce"
               value="<?php echo wp_create_nonce( 'miniorange-2-factor-mobile-validation-failed-nonce' ); ?>"/>
    </form>
    <form name="f" id="mo2f_trust_device_confirm_form" method="post" action="" class="mo2f_display_none_forms">
        <input type="hidden" name="mo2f_trust_device_confirm_nonce"
               value="<?php echo wp_create_nonce( 'miniorange-2-factor-trust-device-confirm-nonce' ); ?>"/>
        <input type="hidden" name="redirect_to" value="<?php echo $redirect_to; ?>"/>
    </form>
    <form name="f" id="mo2f_trust_device_cancel_form" method="post" action="" class="mo2f_display_none_forms">
        <input type="hidden" name="mo2f_trust_device_cancel_nonce"
               value="<?php echo wp_create_nonce( 'miniorange-2-factor-trust-device-cancel-nonce' ); ?>"/>
        <input type="hidden" name="redirect_to" value="<?php echo $redirect_to; ?>"/>
    </form>
    <script>
        function mologinback() {
            jQuery('#mo2f_backto_mo_loginform').submit();
        }

        function mo_check_device_confirm() {
            jQuery('#mo2f_device_content').hide();
            jQuery('#showLoadingBar').show();
            jQuery('#mo2f_trust_device_confirm_form').submit();
        }

        function mo_check_device_cancel() {
            jQuery('#mo2f_device_content').hide();
            jQuery('#showLoadingBar').show();
            jQuery('#mo2f_trust_device_cancel_form').submit();
        }
    </script>
    </body>
    </html>
<?php }

function mo2f_customize_logo() { ?>
    <div style="float:right;"><a target="_blank" href="http://miniorange.com/2-factor-authentication"><img
                    alt="logo"
                    src="<?php echo plugins_url( '/includes/images/miniOrange2.png', __FILE__ ); ?>"/></a></div>

<?php }

function echo_js_css_files() {
	echo '<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>';
	echo '<script src="' . plugins_url( 'includes/js/bootstrap.min.js', __FILE__ ) . '" ></script>';
	echo '<link rel="stylesheet" type="text/css" href="' . plugins_url( 'includes/css/bootstrap.min.css?version=5.0.6', __FILE__ ) . '" />';
	echo '<link rel="stylesheet" type="text/css" href="' . plugins_url( 'includes/css/front_end_login.css?version=5.0.6', __FILE__ ) . '" />';
	echo '<link rel="stylesheet" type="text/css" href="' . plugins_url( 'includes/css/style_settings.css?version=5.0.6', __FILE__ ) . '" />';
	echo '<link rel="stylesheet" type="text/css" href="' . plugins_url( 'includes/css/hide-login.css?version=5.0.6', __FILE__ ) . '" />';

	if ( get_option( 'mo2f_personalization_ui' ) ) {
		echo '<link rel="stylesheet" type="text/css" href="' . plugins_url( 'includes/css/mo2f_login_popup_ui.css', __FILE__ ) . '" />';
	}
}


?>