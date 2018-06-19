<?php
function mo_2_factor_register( $user ) {
	global $Mo2fdbQueries;
	if ( mo_2factor_is_curl_installed() == 0 ) { ?>
        <p style="color:red;">(<?php echo mo2f_lt( 'Warning:' ); ?> <a
                    href="http://php.net/manual/en/curl.installation.php"
                    target="_blank"><?php echo mo2f_lt( 'PHP CURL extension' ); ?></a> <?php echo mo2f_lt( 'is not installed or disabled' ); ?>
            )</p>
		<?php
	}

	if ( version_compare( PHP_VERSION, '5.3.0' ) < 0 ) {
		?>
        <p style="color:red;"><b><span
                        style="font-size:18px;">(<?php echo mo2f_lt( 'Warning:' ); ?></span></b> <?php echo mo2f_lt( 'Your current PHP version is ' ); ?><?php echo PHP_VERSION; ?>
            . <?php echo mo2f_lt( 'Some of the functionality of the plugin may not work in this version of PHP. Please upgrade your PHP version to 5.3.0 or above.' ); ?>
            <br> <?php echo mo2f_lt( 'You can also write us by submitting a query on the right hand side in our ' ); ?>
            <b><?php echo mo2f_lt( 'Support Section' ); ?></b>. )</p>
		<?php
	}


	$mo2f_active_tab                     = isset( $_GET['mo2f_tab'] ) ? $_GET['mo2f_tab'] : '2factor_setup';
	$mo_2factor_user_registration_status = $Mo2fdbQueries->get_user_detail( 'mo_2factor_user_registration_status', $user->ID );
	$is_customer_admin                   = current_user_can( 'manage_options' ) && get_option( 'mo2f_miniorange_admin' ) == $user->ID ? true : false;
	$is_customer_registered              = get_option( 'mo_2factor_admin_registration_status' );
	$can_display_admin_features          = ! $is_customer_registered || ( current_user_can( 'manage_options' ) && get_option( 'mo2f_miniorange_admin' ) == $user->ID ) ? true : false;

	?>
    <br>
    <div class="wrap">
        <div><img style="float:left;" src="<?php echo plugins_url( 'includes/images/logo.png"', __FILE__ ); ?>"></div>
        <div style="display:block;font-size:23px;padding:9px 0 10px;line-height:29px; margin-left:3%">
            <a class="add-new-h2" href="https://faq.miniorange.com/kb/two-factor-authentication"
               target="_blank"><?php echo mo2f_lt( 'FAQ' ); ?></a>
			<?php if ( $can_display_admin_features ) { ?>
                <a class="twofa-license add-new-h2" id="mo2f_tab6"
                   href="admin.php?page=miniOrange_2_factor_settings&amp;mo2f_tab=mo2f_pricing"
                ><?php echo mo2f_lt( 'Upgrade to Standard/Premium' ); ?></a>
			<?php } ?>
        </div>
    </div>

    <div id="tab">
        <h2 class="nav-tab-wrapper">
            <a href="admin.php?page=miniOrange_2_factor_settings&amp;mo2f_tab=2factor_setup"
               class="nav-tab <?php echo $mo2f_active_tab == '2factor_setup' ? 'nav-tab-active' : ''; ?>"
               id="mo2f_tab1">
				<?php if ( in_array( $mo_2factor_user_registration_status, array(
					'MO_2_FACTOR_INITIALIZE_MOBILE_REGISTRATION',
					'MO_2_FACTOR_PLUGIN_SETTINGS'
				) ) ) {
					echo mo2f_lt( 'User Profile' );
				} else {
					echo mo2f_lt( 'Account Setup' );
				} ?></a>
            <a href="admin.php?page=miniOrange_2_factor_settings&amp;mo2f_tab=mobile_configure"
               class="nav-tab <?php echo $mo2f_active_tab == 'mobile_configure' ? 'nav-tab-active' : ''; ?>"
               id="mo2f_tab3"><?php echo mo2f_lt( 'Setup Two-Factor' ); ?></a>
			<?php if ( $can_display_admin_features ) { ?>
				<?php if ( get_option( 'mo2f_is_NC' ) ) { ?><a
                    href="admin.php?page=miniOrange_2_factor_settings&amp;mo2f_tab=mo2f_addon&amp;mo2f_sub_tab=mo2f_sub_tab_rba"
                    class="nav-tab <?php echo $mo2f_active_tab == 'mo2f_addon' ? 'nav-tab-active' : ''; ?>"
                    id="mo2f_tab4"><?php echo mo2f_lt( 'Add-ons' ); ?></a><?php } ?>
                <a href="admin.php?page=miniOrange_2_factor_settings&amp;mo2f_tab=mo2f_login"
                   class="nav-tab <?php echo $mo2f_active_tab == 'mo2f_login' ? 'nav-tab-active' : ''; ?>"
                   id="mo2f_tab2"><?php echo get_option( 'mo2f_is_NC' ) ? mo2f_lt( 'Standard/Premium Features' ) : mo2f_lt( 'Login Options' ); ?></a>

			<?php } ?>
        </h2>
    </div>


    <div class="mo2f_container">
        <div id="messages"></div>
        <table style="width:100%;
			padding:20px;">
            <tr>
                <td style="width:60%;vertical-align:top;">

					<?php
					/* to update the status of existing customers for adding their user registration status */
					if ( get_option( 'mo_2factor_admin_registration_status' ) == 'MO_2_FACTOR_CUSTOMER_REGISTERED_SUCCESS' && get_option( 'mo2f_miniorange_admin' ) == $user->ID ) {
						$Mo2fdbQueries->update_user_details( $user->ID, array( 'user_registration_with_miniorange' => 'SUCCESS' ) );
					}
					/* ----------------------------------------- */
					$session_variables = array( 'mo2f_google_auth', 'mo2f_authy_keys', 'mo2f_mobile_support' );

					if ( $mo2f_active_tab == 'mobile_configure' ) {
						$mo2f_second_factor = mo2f_get_activated_second_factor( $user );
						mo2f_select_2_factor_method( $user, $mo2f_second_factor );
						?>


						<?php
					} else if ( $can_display_admin_features && $mo2f_active_tab == 'mo2f_login' ) {
						MO2f_Utility::unset_session_variables( $session_variables );
						show_2_factor_login_settings( $user );
					} else if ( $can_display_admin_features && $mo2f_active_tab == 'mo2f_addon' ) {
						MO2f_Utility::unset_session_variables( $session_variables );
						show_2_factor_addons( $user );
						do_action( 'mo2f_new_addon' );
					} else if ( $can_display_admin_features && $mo2f_active_tab == 'mo2f_pricing' ) {
						MO2f_Utility::unset_session_variables( $session_variables );
						show_2_factor_pricing_page( $user );
					} else {

						MO2f_Utility::unset_session_variables( $session_variables );
						if ( get_option( 'mo_2factor_admin_registration_status' ) == 'MO_2_FACTOR_CUSTOMER_REGISTERED_SUCCESS' && get_option( 'mo2f_miniorange_admin' ) != $user->ID ) {
							if ( in_array( $mo_2factor_user_registration_status, array(
								'MO_2_FACTOR_OTP_DELIVERED_SUCCESS',
								'MO_2_FACTOR_OTP_DELIVERED_FAILURE'
							) ) ) {
								mo2f_show_user_otp_validation_page();  // OTP over email validation page
							} else if ( $mo_2factor_user_registration_status == 'MO_2_FACTOR_INITIALIZE_MOBILE_REGISTRATION' ) {  //displaying user profile
								$mo2f_second_factor = mo2f_get_activated_second_factor( $user );
								mo2f_show_instruction_to_allusers( $user, $mo2f_second_factor );
							} else if ( $mo_2factor_user_registration_status == 'MO_2_FACTOR_PLUGIN_SETTINGS' ) {
								$mo2f_second_factor = mo2f_get_activated_second_factor( $user );
								mo2f_show_instruction_to_allusers( $user, $mo2f_second_factor );  //displaying user profile
							} else {
								show_user_welcome_page( $user );  //Landing page for additional admin for registration
							}
						} else {

							if ( in_array( $mo_2factor_user_registration_status, array(
								'MO_2_FACTOR_OTP_DELIVERED_SUCCESS',
								'MO_2_FACTOR_OTP_DELIVERED_FAILURE'
							) ) ) {
								mo2f_show_otp_validation_page( $user );  // OTP over email validation page for admin
							} else if ( $mo_2factor_user_registration_status == 'MO_2_FACTOR_INITIALIZE_MOBILE_REGISTRATION' ) {  //displaying user profile
								$mo2f_second_factor = mo2f_get_activated_second_factor( $user );
								mo2f_show_instruction_to_allusers( $user, $mo2f_second_factor );
							} else if ( $mo_2factor_user_registration_status == 'MO_2_FACTOR_PLUGIN_SETTINGS' ) {
								$mo2f_second_factor = mo2f_get_activated_second_factor( $user );
								mo2f_show_instruction_to_allusers( $user, $mo2f_second_factor );  //displaying user profile

							} else if ( $mo_2factor_user_registration_status == 'MO_2_FACTOR_VERIFY_CUSTOMER' ) {
								mo2f_show_verify_password_page();  //verify password page
							} else if ( ! mo2f_is_customer_registered() ) {
								delete_option( 'password_mismatch' );
								mo2f_show_registration_page( $user ); //new registration page
							}
						}

					}
					?>
                </td>
                <td style="vertical-align:top;padding-left:1%;" id="mo2f_support_table">
					<?php if ( $can_display_admin_features && ! ( $mo2f_active_tab == 'mobile_configure' || $mo2f_active_tab == 'mo2f_pricing' || $mo2f_active_tab == 'mo2f_login' ) ) {
						echo mo2f_support();
					} ?>
                </td>
            </tr>
        </table>
    </div>
	<?php
}

function mo2f_show_registration_page( $user ) {
	global $Mo2fdbQueries;
	$phone = $Mo2fdbQueries->get_user_detail( 'mo2f_user_phone', $user->ID );
	?>

    <!--Register with miniOrange-->
    <form name="f" method="post" action="">
        <input type="hidden" name="option" value="mo_auth_register_customer"/>
        <div class="mo2f_table_layout">
            <h3><span><?php echo mo2f_lt( 'Register with miniOrange' ); ?></span></h3>
            <hr>
            <div id="panel1">
                <br>
                <div><?php echo mo2f_lt( 'Already have an account?' ) . '&nbsp;&nbsp;<a style="font-weight:bold; color:limegreen" href="#mo2f_account_exist">' . mo2f_lt( 'SIGN IN' ) ?></a></div>
                <br>
                <table class="mo2f_settings_table">
                    <tr>

                        <td style="width:30%"><b><span class="impt">*</span><?php echo mo2f_lt( 'Email :' ); ?></b></td>
                        <td style="width:70%"><input class="mo2f_table_textbox" type="email" name="email" required
                                                     value="<?php if ( get_option( 'mo2f_email' ) ) {
							                             echo get_option( 'mo2f_email' );
						                             } else {
							                             echo $user->user_email;
						                             } ?>"/></td>
                    </tr>
                    <tr>
                        <td><b><span class="impt">*</span><?php echo mo2f_lt( 'Company/Organisation:' ); ?></b></td>
                        <td><input class="mo2f_table_textbox" type="text" name="company" required
                                   value="<?php echo ( get_option( 'mo2f_admin_company' ) == '' ) ? $_SERVER['SERVER_NAME'] : get_option( 'mo2f_admin_company' ); ?>"/>
                        </td>
                    </tr>
                    <tr>
                        <td><b><?php echo mo2f_lt( 'First Name:' ); ?></b></td>
                        <td><input class="mo2f_table_textbox" type="text" name="first_name"
                                   value="<?php echo ( get_option( 'mo2f_admin_first_name' ) == '' ) ? $user->first_name : get_option( 'mo2f_admin_first_name' ); ?>"/>
                        </td>
                    </tr>
                    <tr>
                        <td><b><?php echo mo2f_lt( 'Last Name:' ); ?></b></td>
                        <td><input class="mo2f_table_textbox" type="text" name="<?php echo mo2f_lt( 'last_name' ); ?>"
                                   value="<?php echo ( get_option( 'mo2_admin_last_name' ) == '' ) ? $user->last_name : get_option( 'mo2_admin_last_name' ); ?>"/>
                        </td>
                    </tr>

                    <tr>
                        <td><b><?php echo mo2f_lt( 'Phone number :' ); ?></b></td>

                        <td><input class="mo2f_table_textbox" style="width:100% !important;" type="text" name="phone"
                                   pattern="[\+]?([0-9]{1,4})?\s?([0-9]{7,12})?" id="phone" autofocus="true"
                                   value="<?php echo $phone; ?>"/>
                        </td>
                    </tr>

                    <tr>
                        <td><b><span class="impt">*</span><?php echo mo2f_lt( 'Password :' ); ?></b></td>
                        <td><input class="mo2f_table_textbox" type="password" required name="password"/></td>
                    </tr>
                    <tr>
                        <td><b><span class="impt">*</span><?php echo mo2f_lt( 'Confirm Password :' ); ?></b></td>
                        <td><input class="mo2f_table_textbox" type="password" required name="confirmPassword"/></td>
                    </tr>

                    <tr>

                        <td>&nbsp;</td>
                        <td><input type="submit" name="submit" style="float:right"
                                   value="<?php echo mo2f_lt( 'Create Account' ); ?>"
                                   class="button button-primary button-large"/></td>
                    </tr>

                </table>
                <br>

            </div>
        </div>
    </form>
    <form name="f" method="post" action="" id="mo2f_verify_customerform">
        <input type="hidden" name="option" value="mo2f_goto_verifycustomer">
    </form>

    <script>
        jQuery("#phone").intlTelInput();
        jQuery('a[href=\"#mo2f_account_exist\"]').click(function (e) {
            jQuery('#mo2f_verify_customerform').submit();
        });
    </script>
	<?php
}

function mo2f_show_otp_validation_page( $user ) {
	global $Mo2fdbQueries;
	$phone = $Mo2fdbQueries->get_user_detail( 'mo2f_user_phone', $user->ID );
	?>
    <!-- Enter otp -->

    <div class="mo2f_table_layout">
        <h3><?php echo mo2f_lt( 'Validate OTP' ); ?></h3>
        <hr>
        <div id="panel1">
            <table class="mo2f_settings_table">
                <form name="f" method="post" id="mo_2f_otp_form" action="">
                    <input type="hidden" name="option" value="mo_2factor_validate_otp"/>
                    <tr>
                        <td><b><font color="#FF0000">*</font><?php echo mo2f_lt( 'Enter OTP:' ); ?></b></td>
                        <td colspan="2"><input class="mo2f_table_textbox" autofocus="true" type="text" name="otp_token"
                                               required placeholder="<?php echo mo2f_lt( 'Enter OTP' ); ?>"
                                               style="width:95%;"/></td>
                        <td><a href="#resendotplink"><?php echo mo2f_lt( 'Resend OTP ?' ); ?></a></td>
                    </tr>

                    <tr>
                        <td>&nbsp;</td>
                        <td style="width:17%">
                            <input type="submit" name="submit" value="<?php echo mo2f_lt( 'Validate OTP' ); ?>"
                                   class="button button-primary button-large"/></td>

                </form>
                <form name="f" method="post" action="">
                    <td>
                        <input type="hidden" name="option" value="mo_2factor_gobackto_registration_page"/>
                        <input type="submit" name="mo2f_goback" id="mo2f_goback"
                               value="<?php echo mo2f_lt( 'Back' ); ?>" class="button button-primary button-large"/>
                    </td>
                </form>
                </td>
                </tr>
                <form name="f" method="post" action="" id="resend_otp_form">
                    <input type="hidden" name="option" value="mo_2factor_resend_otp"/>
                </form>

            </table>
            <br>
            <hr>

            <h3><?php echo mo2f_lt( 'I did not receive any email with OTP . What should I do ?' ); ?></h3>
            <form id="phone_verification" method="post" action="">
                <input type="hidden" name="option" value="mo_2factor_phone_verification"/>
				<?php echo mo2f_lt( 'If you can\'t see the email from miniOrange in your mails, please check your ' ); ?>
                <b><?php echo mo2f_lt( 'SPAM Folder' ); ?></b>. <?php echo mo2f_lt( 'If you don\'t see an email even in SPAM folder, verify your identity with our alternate method.' ); ?>
                <br><br>
                <b><?php echo mo2f_lt( 'Enter your valid phone number here and verify your identity using one time passcode sent to your phone.' ); ?></b>
                <br><br>
                <table>
                    <tr>
                        <td>
                            <input class="mo2f_table_textbox" required autofocus="true" type="text" name="phone_number"
                                   id="phone" placeholder="<?php echo mo2f_lt( 'Enter Phone Number' ); ?>"
                                   value="<?php echo $phone; ?>"
                                   pattern="[\+]?[0-9]{1,4}\s?[0-9]{7,12}"
                                   title="<?php echo mo2f_lt( 'Enter phone number without any space or dashes.' ); ?>"/>
                        </td>
                        <td>
                            <a href="#resendsmsotplink"><?php echo mo2f_lt( 'Resend OTP ?' ); ?></a>
                        </td>
                    </tr>
                </table>
                <br><input type="submit" value="<?php echo mo2f_lt( 'Send OTP' ); ?>"
                           class="button button-primary button-large"/>

            </form>
            <br>
            <h3><?php echo mo2f_lt( 'What is an OTP ?' ); ?></h3>
            <p><?php echo mo2f_lt( 'OTP is a one time passcode ( a series of numbers) that is sent to your email or phone number to verify that you have access to your email account or phone. ' ); ?></p>
        </div>
        <div>
            <script>
                jQuery("#phone").intlTelInput();
                jQuery('a[href=\"#resendotplink\"]').click(function (e) {
                    jQuery('#resend_otp_form').submit();
                });
                jQuery('a[href=\"#resendsmsotplink\"]').click(function (e) {
                    jQuery('#phone_verification').submit();
                });
            </script>

            <br><br>
        </div>


    </div>

	<?php
}

function mo2f_rba_description() {
	?>
    <div id="mo2f_rba_addon" style="min-height:850px; class=" mo2f_addon_spacing">
	<?php if ( get_option( 'mo2f_rba_installed' ) ) { ?>
        <a href="<?php echo admin_url(); ?>plugins.php" id="mo2f_activate_rba_addon"
           class="button button-primary button-large"
           style="float:right; margin-top:2%;"><?php echo __( 'Activate Plugin', 'miniorange-2-factor-authentication' ); ?></a>
	<?php } ?>
	<?php if ( ! get_option( 'mo2f_rba_purchased' ) ) { ?>  <a
        <a onclick="mo2f_addonform('wp_2fa_addon_rba')" id="mo2f_purchase_rba_addon"
           class="button button-primary button-large"
           style="margin-right:2%;margin-top:2%;float:right;"><?php echo __( 'Purchase', 'miniorange-2-factor-authentication' ); ?></a><?php } ?>
    <br><br>
    <div id="mo2f_rba_addon_hide"><h3 id="toggle_rba_description"
                                      class="mo2f_pointer"><?php echo __( 'Description', 'miniorange-2-factor-authentication' ); ?> </h3>
        <p id="rba_description" style="margin:2% 2% 2% 4%">
			<?php echo __( 'This Add-On helps you in remembering the device, in which case you will not be prompted for the 2-factor authentication
			if you login from the remembered device again. You can also decide the number of devices that can be remembered. Users can also be restricted access to the site based on the IP address they are logging in from.', 'miniorange-2-factor-authentication' ); ?>
        </p>
        <br>
        <div id="mo2f_hide_rba_content">

            <div class="mo2f_box">
                <h3><?php echo __( 'Remember Device', 'miniorange-2-factor-authentication' ); ?></h3>
                <hr>
                <p id="mo2f_hide_rba_content"><?php echo __( 'With this feature, User would get an option to remember the personal device where Two Factor is not required. Every time the user logs in with the same device it detects                     the saved device so he will directly login without being prompted for the 2nd factor. If user logs in from new device he will be prompted with 2nd                          Factor.', 'miniorange-2-factor-authentication' ); ?>

                </p>
            </div>
            <br><br>
            <div class="mo2f_box">
                <h3><?php echo __( 'Limit Number Of Device', 'miniorange-2-factor-authentication' ); ?></h3>
                <hr>
                <p><?php echo __( 'With this feature, the admin can restrict the number of devices from which the user can access the website. If the device limit is exceeded the admin can set three actions where it can allow the users to login, deny the access or challenge the user for authentication.', 'miniorange-2-factor-authentication' ); ?>
                </p>

            </div>
            <br><br>
            <div class="mo2f_box">
                <h3><?php echo __( 'IP Restriction: Limit users to login from specific IPs', 'miniorange-2-factor-authentication' ); ?></h3>
                <hr>
                <p><?php echo __( 'The Admin can enable IP restrictions for the users. It will provide additional security to the accounts and perform different action to the accounts only from the listed IP Ranges. If user tries to access with a restricted IP, Admin can set three action: Allow, challenge or deny. Depending upon the action it will allow the user to login, challenge(prompt) for authentication or deny the access.', 'miniorange-2-factor-authentication' ); ?>

            </div>
        </div>

    </div>
    <div id="mo2f_rba_addon_show"><?php show_rba_content(); ?></div>
    </div>
	<?php
}

function show_2_factor_addons( $current_user ) {
	global $Mo2fdbQueries;
	$mo2f_user_email     = $Mo2fdbQueries->get_user_detail( 'mo2f_user_email', $current_user->ID );
	$mo2f_active_sub_tab = isset( $_GET['mo2f_sub_tab'] ) ? $_GET['mo2f_sub_tab'] : 'rba';
	?>


    <div class="mo2f_table_layout">
        <div class="mo2f_vertical-submenu" style='text-align:justify'>
            <a href="admin.php?page=miniOrange_2_factor_settings&mo2f_tab=mo2f_addon&mo2f_sub_tab=mo2f_sub_tab_rba"
               class="nav-tab show_rba <?php echo $mo2f_active_sub_tab == 'mo2f_sub_tab_rba' ? 'active' : ''; ?>"
               style='margin-left:5px' "
            ><?php echo __( 'Risk Based Access', 'miniorange-2-factor-authentication' ); ?></a>
            <a href="admin.php?page=miniOrange_2_factor_settings&mo2f_tab=mo2f_addon&mo2f_sub_tab=mo2f_sub_tab_personalization"
               class="nav-tab show_personalization <?php echo $mo2f_active_sub_tab == 'mo2f_sub_tab_personalization' ? 'active' : ''; ?>"><?php echo __( 'Personalization', 'miniorange-2-factor-authentication' ); ?></a>
            <a href="admin.php?page=miniOrange_2_factor_settings&mo2f_tab=mo2f_addon&mo2f_sub_tab=mo2f_sub_tab_shortcode"
               class="nav-tab show_shortcode <?php echo $mo2f_active_sub_tab == 'mo2f_sub_tab_shortcode' ? 'active' : ''; ?>"
               style='margin-right:0px' "><?php echo __( 'Shortcode', 'miniorange-2-factor-authentication' ); ?></a>
        </div>
        <br><br><br><br>
		<?php if ( $mo2f_active_sub_tab == "mo2f_sub_tab_rba" ) {
			mo2f_rba_description(); ?>

		<?php } else if ( $mo2f_active_sub_tab == "mo2f_sub_tab_personalization" ) { ?>
            <div id="mo2f_custom_addon" style="min-height:850px;">
				<?php if ( get_option( 'mo2f_personalization_installed' ) ) { ?>

                    <a href="<?php echo admin_url(); ?>plugins.php" id="mo2f_activate_custom_addon"
                       class="button button-primary button-large"
                       style="float:right; margin-top:2%;"><?php echo __( 'Activate Plugin', 'miniorange-2-factor-authentication' ); ?></a>
				<?php } ?>
				<?php if ( ! get_option( 'mo2f_personalization_purchased' ) ) { ?>  <a
                        onclick="mo2f_addonform('wp_2fa_addon_personalization')" id="mo2f_purchase_custom_addon"
                        class="button button-primary button-large"
                        style="margin-right:2%;margin-top:2%;float:right;"><?php echo __( 'Purchase', 'miniorange-2-factor-authentication' ); ?></a>
				<?php } ?>
                <br>
                <div id="mo2f_custom_addon_hide"><br>
                    <h3 id="toggle_personalization_description" class="mo2f_pointer">
						<?php echo __( 'Description ', 'miniorange-2-factor-authentication' ); ?></h3>
					<?php mo2f_personalization_description(); ?>
                </div>
                <div id="mo2f_custom_addon_show"><?php show_custom_content(); ?></div>
            </div>

		<?php } else if ( $mo2f_active_sub_tab == "mo2f_sub_tab_shortcode" ) { ?>
            <div id="mo2f_shortcode_addon" style="min-height:420px;">

                <div id="mo2f_Shortcode_addon_hide">
					<?php if ( get_option( 'mo2f_shortcode_installed' ) ) { ?>
                        <a href="<?php echo admin_url(); ?>plugins.php" id="mo2f_activate_shortcode_addon"
                           class="button button-primary button-large" style="float:right; margin-top:2%;"><?php echo __( 'Activate
                        Plugin', 'miniorange-2-factor-authentication' ); ?></a>
					<?php } ?>
					<?php if ( ! get_option( 'mo2f_shortcode_purchased' ) ) { ?>

                        <a onclick="mo2f_addonform('wp_2fa_addon_shortcode')" id="mo2f_purchase_shortcode_addon"
                           class="button button-primary button-large"
                           style="margin-right:2%;margin-top:2%;float:right;"><?php echo __( 'Purchase', 'miniorange-2-factor-authentication' ); ?></a>
					<?php } ?>
                    <br><br>
                    <h3 id="toggle_shortcode_description"
                        class="mo2f_pointer"><?php echo __( 'Description', 'miniorange-2-factor-authentication' ); ?> </h3>
					<?php mo2f_shortcode_description(); ?>
                </div>
                <div id="mo2f_Shortcode_addon_show"><?php show_shortcode_content(); ?></div>
            </div>
		<?php } ?>

        <form style="display:none;" id="mo2fa_loginform"
              action="<?php echo get_option( 'mo2f_host_name' ) . '/moas/login'; ?>"
              target="_blank" method="post">
            <input type="email" name="username" value="<?php echo $mo2f_user_email; ?>"/>
            <input type="text" name="redirectUrl"
                   value="<?php echo get_option( 'mo2f_host_name' ) . '/moas/initializepayment'; ?>"/>
            <input type="text" name="requestOrigin" id="requestOrigin"/>
        </form>
        <script>
            function mo2f_addonform(planType) {
                jQuery('#requestOrigin').val(planType);
                jQuery('#mo2fa_loginform').submit();
            }
        </script>
        <style>

        </style>
    </div>
    </form>
	<?php

}

function mo2f_personalization_description() {
	?>
    <p id="custom_description" style="margin:2% 2% 2% 4%">
		<?php echo __( 'This Add-On helps you modify and redesign the login screen\'s UI, and various customizations in the plugin dashboard.
		Along with customizing the plugin Icon and name, you can also customize the email and sms templates you and your users receive during authentication.', 'miniorange-2-factor-authentication' ); ?>
    </p>
    <br>
    <div id="mo2f_hide_custom_content">
        <div class="mo2f_box">
            <h3><?php echo __( 'Customize Plugin Icon', 'miniorange-2-factor-authentication' ); ?></h3>
            <hr>
            <p>
				<?php echo __( 'With this feature, you can customize the plugin icon in the dashboard which is useful when you want your                     custom logo to be displayed to the users.', 'miniorange-2-factor-authentication' ); ?>
            </p>
            <br>
            <h3><?php echo __( 'Customize Plugin Name', 'miniorange-2-factor-authentication' ); ?></h3>
            <hr>
            <p>
				<?php echo __( 'With this feature, you can customize the name of the plugin in the dashboard.', 'miniorange-2-factor-authentication' ); ?>
            </p>

        </div>
        <br>
        <div class="mo2f_box">
            <h3><?php echo __( 'Customize UI of Login Pop up\'s', 'miniorange-2-factor-authentication' ); ?></h3>
            <hr>
            <p>
				<?php echo __( 'With this feature, you can customize the login pop-ups during two factor authentication according to the theme of                 your website.', 'miniorange-2-factor-authentication' ); ?>
            </p>
        </div>

        <br>
        <div class="mo2f_box">
            <h3><?php echo __( 'Custom Email and SMS Templates', 'miniorange-2-factor-authentication' ); ?></h3>
            <hr>

            <p><?php echo __( 'You can change the templates for Email and SMS which user receives during authentication.', 'miniorange-2-factor-authentication' ); ?></p>

        </div>
    </div>
	<?php
}

function mo2f_shortcode_description() {
	?>
    <p id="shortcode_description" style="margin:2% 2% 2% 4%">
		<?php echo __( 'A shortcode is a WordPress-specific code that lets you do things with very little effort. Shortcodes can embed
        ugly code in just one line. You can use these shortcodes on any custom page. Just include the shortcode on your page and boom!', 'miniorange-2-factor-authentication' ); ?>
    </p>
    <br>

    <div id="mo2f_hide_shortcode_content" class="mo2f_box">

        <h3><?php echo __( 'List of Shortcodes', 'miniorange-2-factor-authentication' ); ?>:</h3>
        <hr>

        <ol style="margin-left:2%">
            <li><b><?php echo __( 'Enable Two Factor: ', 'miniorange-2-factor-authentication' ); ?></b> <?php echo __( 'This shortcode provides
                            an option to turn on/off 2-factor by user.', 'miniorange-2-factor-authentication' ); ?></li>
            <li>
                <b><?php echo __( 'Enable Reconfiguration: ', 'miniorange-2-factor-authentication' ); ?></b> <?php echo __( 'This shortcode provides an option to configure the Google Authenticator and Security Questions by user.', 'miniorange-2-factor-authentication' ); ?>
            </li>
            <li>
                <b><?php echo __( 'Enable Remember Device: ', 'miniorange-2-factor-authentication' ); ?></b> <?php echo __( ' This shortcode provides
                            \'Enable Remember Device\' from your custom login form.', 'miniorange-2-factor-authentication' ); ?>
            </li>
        </ol>

    </div>
	<?php
}

function show_rba_content() {

	$paid_rba = 1;
	$str      = "rba";
	if ( $paid_rba ) {
		$x = apply_filters( 'mo2f_rba', $str );
	}
	?>


	<?php
}

function show_shortcode_content() {

	$paid_shortcode = 1;
	$str            = "shortcode";
	if ( $paid_shortcode ) {
		$x = apply_filters( 'mo2f_shortcode', $str );
	}
	?>
	<?php
}

function show_custom_content() {

	$paid_custom = 1;
	$str         = "custom";
	if ( $paid_custom ) {
		$x = apply_filters( 'mo2f_custom', $str );
	}
	?>


	<?php
}

function show_2_factor_login_settings( $user ) {
	global $Mo2fdbQueries;
	$roles = get_editable_roles();

	$mo_2factor_user_registration_status = $Mo2fdbQueries->get_user_detail( 'mo_2factor_user_registration_status', $user->ID );
	?>


	<?php if ( get_option( 'mo2f_is_NC' ) ) { ?>
        <div class="mo2f_advanced_options_EC">
			<?php echo get_standard_premium_options( $user ); ?>
        </div>
	<?php } else {

		$mo2f_active_tab = '2factor_setup';
		?>

        <div class="mo2f_advanced_options_EC">


			<?php echo mo2f_check_if_registered_with_miniorange( $user ); ?>
            <div id="mo2f_login_options">
                <a href="#standard_premium_options" style="float:right">Show Standard/Premium
                    Features</a></h3>

                <form name="f" id="login_settings_form" method="post" action="">
                    <input type="hidden" name="option" value="mo_auth_login_settings_save"/>

                    <div class="row">
                        <h3 style="padding:10px;"><?php echo mo2f_lt( 'Select Login Screen Options' ); ?>

                    </div>
                    <hr>
                    <br>


                    <div style="margin-left: 2%;">
                        <input type="radio" name="mo2f_login_option" value="1"
							<?php checked( get_option( 'mo2f_login_option' ) );
							if ( $mo_2factor_user_registration_status == 'MO_2_FACTOR_PLUGIN_SETTINGS' ) {
							} else {
								echo 'disabled';
							} ?> />
						<?php echo mo2f_lt( 'Login with password + 2nd Factor ' ); ?>
                        <i>(<?php echo mo2f_lt( 'Default & Recommended' ); ?>)&nbsp;&nbsp;</i>

                        <br><br>

                        <div style="margin-left:6%;">
                            <input type="checkbox" id="mo2f_remember_device" name="mo2f_remember_device"
                                   value="1" <?php checked( get_option( 'mo2f_remember_device' ) == 1 );
							if ( $mo_2factor_user_registration_status == 'MO_2_FACTOR_PLUGIN_SETTINGS' ) {
							} else {
								echo 'disabled';
							} ?> />Enable
                            '<b><?php echo mo2f_lt( 'Remember device' ); ?></b>' <?php echo mo2f_lt( 'option ' ); ?><br>

                            <div class="mo2f_advanced_options_note"><p style="padding:5px;">
                                    <i><?php echo mo2f_lt( ' Checking this option will display an option ' ); ?>
                                        '<b><?php echo mo2f_lt( 'Remember this device' ); ?></b>'<?php echo mo2f_lt( 'on 2nd factor screen. In the next login from the same device, user will bypass 2nd factor, i.e. user will be logged in through username + password only.' ); ?>
                                    </i></p></div>
                        </div>

                        <br>

                        <input type="radio" name="mo2f_login_option" value="0"
							<?php checked( ! get_option( 'mo2f_login_option' ) );
							if ( $mo_2factor_user_registration_status == 'MO_2_FACTOR_PLUGIN_SETTINGS' ) {
							} else {
								echo 'disabled';
							} ?> />
						<?php echo mo2f_lt( 'Login with 2nd Factor only ' ); ?>
                        <i>(<?php echo mo2f_lt( 'No password required.' ); ?>)</i> &nbsp;<a class="btn btn-link"
                                                                                            data-toggle="collapse"
                                                                                            id="showpreview1"
                                                                                            href="#preview9"
                                                                                            aria-expanded="false"><?php echo mo2f_lt( 'See preview' ); ?></a>
                        <br>
                        <div class="mo2f_collapse" id="preview9" style="height:300px;">
                            <center><br>
                                <img style="height:300px;"
                                     src="https://auth.miniorange.com/moas/images/help/login-help-1.png">
                            </center>
                        </div>
                        <div class="mo2f_advanced_options_note"><p style="padding:5px;">
                                <i><?php echo mo2f_lt( 'Checking this option will add login with your phone button below default login form. Click above link to see the preview.' ); ?></i>
                            </p></div>
                        <div id="loginphonediv" hidden><br>
                            <input type="checkbox" id="mo2f_login_with_username_and_2factor"
                                   name="mo2f_login_with_username_and_2factor"
                                   value="1" <?php checked( get_option( 'mo2f_enable_login_with_2nd_factor' ) == 1 );
							if ( $mo_2factor_user_registration_status == 'MO_2_FACTOR_PLUGIN_SETTINGS' ) {
							} else {
								echo 'disabled';
							} ?> />
							<?php echo mo2f_lt( '	I want to hide default login form.' ); ?> &nbsp;<a
                                    class="btn btn-link"
                                    data-toggle="collapse"
                                    href="#preview8"
                                    aria-expanded="false"><?php echo mo2f_lt( 'See preview' ); ?></a>
                            <br>
                            <div class="mo2f_collapse" id="preview8" style="height:300px;">
                                <center><br>
                                    <img style="height:300px;"
                                         src="https://auth.miniorange.com/moas/images/help/login-help-3.png">
                                </center>
                            </div>
                            <br>
                            <div class="mo2f_advanced_options_note"><p style="padding:5px;">
                                    <i><?php echo mo2f_lt( 'Checking this option will hide default login form and just show login with your phone. Click above link to see the preview.' ); ?></i>
                                </p></div>
                        </div>
                        <br>
                    </div>
                    <div>
                        <h3 style="padding:10px;"><?php echo mo2f_lt( 'Backup Methods' ); ?></h3></div>
                    <hr>
                    <br>
                    <div style="margin-left: 2%">
                        <input type="checkbox" id="mo2f_forgotphone" name="mo2f_forgotphone"
                               value="1" <?php checked( get_option( 'mo2f_enable_forgotphone' ) == 1 );
						if ( $mo_2factor_user_registration_status == 'MO_2_FACTOR_PLUGIN_SETTINGS' ) {
						} else {
							echo 'disabled';
						} ?> />
						<?php echo mo2f_lt( 'Enable Forgot Phone.' ); ?>

                        <div class="mo2f_advanced_options_note"><p style="padding:5px;">
                                <i><?php echo mo2f_lt( 'This option will provide you an alternate way of logging in to your site in case you are unable to login with your primary authentication method.' ); ?></i>
                            </p></div>
                        <br>

                    </div>
                    <div>
                        <h3 style="padding:10px;">XML-RPC <?php echo mo2f_lt( 'Settings' ); ?></h3></div>
                    <hr>
                    <br>
                    <div style="margin-left: 2%">
                        <input type="checkbox" id="mo2f_enable_xmlrpc" name="mo2f_enable_xmlrpc"
                               value="1" <?php checked( get_option( 'mo2f_enable_xmlrpc' ) == 1 );
						if ( $mo_2factor_user_registration_status == 'MO_2_FACTOR_PLUGIN_SETTINGS' ) {
						} else {
							echo 'disabled';
						} ?> />
						<?php echo mo2f_lt( 'Enable XML-RPC Login.' ); ?>
                        <div class="mo2f_advanced_options_note"><p style="padding:5px;">
                                <i><?php echo mo2f_lt( 'Enabling this option will decrease your overall login security. Users will be able to login through external applications which support XML-RPC without authenticating from miniOrange. ' ); ?>
                                    <b><?php echo mo2f_lt( 'Please keep it unchecked.' ); ?></b></i></p></div>

                    </div>

                    <br><br>
                    <div style="float:right;padding:10px;">
                        <input type="submit" name="submit" value="<?php echo mo2f_lt( 'Save Settings' ); ?>"
                               class="button button-primary button-large" <?php
						if ( $mo_2factor_user_registration_status == 'MO_2_FACTOR_PLUGIN_SETTINGS' ) {
						} else {
							echo 'disabled';
						} ?> />
                    </div>
                    <br></form>
                <br>
                <br>
                <hr>
            </div>

			<?php echo get_standard_premium_options( $user ); ?>
        </div>

		<?php
	} ?>

    <script>

        if (jQuery("input[name=mo2f_login_option]:radio:checked").val() == 0) {
            jQuery('#loginphonediv').show();
        }
        jQuery("input[name=mo2f_login_option]:radio").change(function () {
            if (this.value == 1) {
                jQuery('#loginphonediv').hide();
            } else {
                jQuery('#loginphonediv').show();
            }
        });


        function show_backup_options() {
            jQuery("#backup_options").slideToggle(700);
            jQuery("#login_options").hide();
            jQuery("#customizations").hide();
            jQuery("#customizations_prem").hide();
            jQuery("#backup_options_prem").hide();
            jQuery("#inline_registration_options").hide();
        }

        function show_customizations() {
            jQuery("#login_options").hide();
            jQuery("#inline_registration_options").hide();
            jQuery("#backup_options").hide();
            jQuery("#customizations_prem").hide();
            jQuery("#backup_options_prem").hide();
            jQuery("#customizations").slideToggle(700);

        }

        jQuery("#backup_options_prem").hide();

        function show_backup_options_prem() {
            jQuery("#backup_options_prem").slideToggle(700);
            jQuery("#login_options").hide();
            jQuery("#customizations").hide();
            jQuery("#customizations_prem").hide();
            jQuery("#inline_registration_options").hide();
            jQuery("#backup_options").hide();
        }

        jQuery("#login_options").hide();

        function show_login_options() {
            jQuery("#inline_registration_options").hide();
            jQuery("#customizations").hide();
            jQuery("#backup_options").hide();
            jQuery("#backup_options_prem").hide();
            jQuery("#customizations_prem").hide();
            jQuery("#login_options").slideToggle(700);
        }

        jQuery("#inline_registration_options").hide();

        function show_inline_registration_options() {
            jQuery("#login_options").hide();
            jQuery("#customizations").hide();
            jQuery("#backup_options").hide();
            jQuery("#backup_options_prem").hide();
            jQuery("#customizations_prem").hide();
            jQuery("#inline_registration_options").slideToggle(700);

        }

        jQuery("#customizations_prem").hide();

        function show_customizations_prem() {
            jQuery("#inline_registration_options").hide();
            jQuery("#login_options").hide();
            jQuery("#customizations").hide();
            jQuery("#backup_options").hide();
            jQuery("#backup_options_prem").hide();
            jQuery("#customizations_prem").slideToggle(700);

        }

        function showLoginOptions() {
            jQuery("#mo2f_login_options").show();
        }

        function showLoginOptions() {
            jQuery("#mo2f_login_options").show();
        }


    </script>


	<?php
}

function mo2f_show_verify_password_page() {
	?>
    <!--Verify password with miniOrange-->
    <form name="f" method="post" action="">
        <input type="hidden" name="option" value="mo_auth_verify_customer"/>
        <div class="mo2f_table_layout">
            <h2><?php echo mo2f_lt( 'Sign In to your miniOrange Account' ); ?></h2>
            <hr>

            <div id="panel1">
                <p><?php echo mo2f_lt( 'Enter your miniOrange username and password to login.' ); ?><a
                            style="float:right;font-weight:bold; color:orange" target="_blank"
                            href="https://auth.miniorange.com/moas/idp/resetpassword"><?php echo mo2f_lt( 'FORGOT PASSWORD?' ); ?></a>
                </p>
                <br>
                <table class="mo2f_settings_table">
                    <tr>
                        <td><b><font color="#FF0000">*</font><?php echo mo2f_lt( 'Email:' ); ?></b></td>
                        <td><input class="mo2f_table_textbox" type="email" name="email" id="email" required
                                   value="<?php echo get_option( 'mo2f_email' ); ?>"/></td>
                    </tr>
                    <tr>
                        <td><b><font color="#FF0000">*</font><?php echo mo2f_lt( 'Password:' ); ?></b></td>
                        <td><input class="mo2f_table_textbox" type="password" name="password" required/></td>
                    </tr>
                    <tr>
                        <td colspan="2">&nbsp;</td>
                    </tr>
                    <tr>
                        <td>&nbsp;</td>
                        <td>
                            <input type="button" name="mo2f_goback" id="mo2f_go_back"
                                   value="<?php echo mo2f_lt( 'Back' ); ?>" class="button button-primary button-large"/>

                            <input type="submit" name="submit" value="<?php echo mo2f_lt( 'Submit' ); ?>"
                                   class="button button-primary button-large"/></td>

                    </tr>

                </table>

            </div>
            <br><br>
        </div>
    </form>
    <form name="f" method="post" action="" id="gobackform">
        <input type="hidden" name="option" value="mo_2factor_gobackto_registration_page"/>
    </form>
    <script>
        jQuery('#mo2f_go_back').click(function () {
            jQuery('#gobackform').submit();
        });

    </script>
<?php }

function get_standard_premium_options( $user ) {
	$is_NC = get_option( 'mo2f_is_NC' );

	?>


	<?php echo mo2f_check_if_registered_with_miniorange( $user ); ?>

    <div id="standard_premium_options" style="text-align: center;">
        <p style="font-size:22px;color:darkorange;padding:10px;"><?php echo mo2f_lt( 'Features in the Standard Plan' ); ?></p>

    </div>

    <hr>
	<?php if ( $is_NC ) { ?>
        <div>
            <a class="mo2f_view_backup_options" onclick="show_backup_options()">
                <img src="<?php echo plugins_url( 'includes/images/right-arrow.png"', __FILE__ ); ?>"
                     class="mo2f_advanced_options_images"/>

                <p class="mo2f_heading_style"><?php echo mo2f_lt( 'Backup Options' ); ?></p>
            </a>

        </div>
        <div id="backup_options" style="margin-left: 5%;">

            <div class="mo2f_advanced_options_note"><p style="padding:5px;">
                    <i><?php echo mo2f_lt( 'Use these backup options to login to your site in case your 
                            phone is lost / not accessible or if you are not able to login using your primary 
                            authentication method.' ); ?></i></p></div>

            <ol class="mo2f_ol">
                <li><?php echo mo2f_lt( 'KBA (Security Questions)' ); ?></li>
            </ol>

        </div>
	<?php } ?>

    <div>
        <a class="mo2f_view_customizations" onclick="show_customizations()">
            <img src="<?php echo plugins_url( 'includes/images/right-arrow.png"', __FILE__ ); ?>"
                 class="mo2f_advanced_options_images"/>

            <p class="mo2f_heading_style"><?php echo mo2f_lt( 'Customizations' ); ?></p>
        </a>
    </div>


    <div id="customizations" style="margin-left: 5%;">

        <p style="font-size:15px;font-weight:bold">1. <?php echo mo2f_lt( 'Login Screen Options' ); ?></p>
        <div>
            <ul style="margin-left:4%" class="mo2f_ol">
                <li><?php echo mo2f_lt( 'Login with Wordpress username/password and 2nd Factor' ); ?> <a
                            class="btn btn-link" data-toggle="collapse" id="showpreview1" href="#preview7"
                            aria-expanded="false">[ <?php echo mo2f_lt( 'See Preview' ); ?>
                        ]</a>
                    <div class="mo2f_collapse" id="preview7" style="height:300px;">
                        <center><br>
                            <img style="height:300px;"
                                 src="https://auth.miniorange.com/moas/images/help/login-help-1.png">
                        </center>

                    </div>
                </li>
                <li><?php echo mo2f_lt( 'Login with Wordpress username and 2nd Factor only' ); ?> <a
                            class="btn btn-link" data-toggle="collapse" id="showpreview2" href="#preview6"
                            aria-expanded="false">[ <?php echo mo2f_lt( 'See Preview' ); ?>
                        ]</a>
                    <br>
                    <div class="mo2f_collapse" id="preview6" style="height:300px;">
                        <center><br>
                            <img style="height:300px;"
                                 src="https://auth.miniorange.com/moas/images/help/login-help-3.png">
                        </center>
                    </div>
                    <br>
                </li>
            </ul>


        </div>
        <br>
        <p style="font-size:15px;font-weight:bold">2. <?php echo mo2f_lt( 'Custom Redirect URLs' ); ?></p>
        <p style="margin-left:4%"><?php echo mo2f_lt( 'Enable Custom Relay state URL\'s (based on user roles in Wordpress) to which the users
            will get redirected to, after the 2-factor authentication' ); ?>'.</p>


        <br>
        <p style="font-size:15px;font-weight:bold">3. <?php echo mo2f_lt( 'Custom Security Questions (KBA)' ); ?></p>
        <div id="mo2f_customKBAQuestions1">
            <p style="margin-left:4%"><?php echo mo2f_lt( 'Add up to 16 Custom Security Questions for Knowledge based authentication (KBA).
                You also have the option to select how many standard and custom questions should be shown to the
                users' ); ?>.</p>

        </div>
        <br>
        <p style="font-size:15px;font-weight:bold">
            4. <?php echo mo2f_lt( 'Custom account name in Google Authenticator App' ); ?></p>
        <div id="mo2f_editGoogleAuthenticatorAccountName1">

            <p style="margin-left:4%"><?php echo mo2f_lt( 'Customize the Account name in the Google Authenticator App' ); ?>
                .</p>

        </div>
        <br>
    </div>
    <div id="standard_premium_options" style="text-align: center;">
        <p style="font-size:22px;color:darkorange;padding:10px;"><?php echo mo2f_lt( 'Features in the Premium Plan' ); ?></p>

    </div>
    <hr>
    <div>
        <a class="mo2f_view_customizations_prem" onclick="show_customizations_prem()">
            <img src="<?php echo plugins_url( 'includes/images/right-arrow.png"', __FILE__ ); ?>"
                 class="mo2f_advanced_options_images"/>

            <p class="mo2f_heading_style"><?php echo mo2f_lt( 'Customizations' ); ?></p>
        </a>
    </div>


    <div id="customizations_prem" style="margin-left: 5%;">

        <p style="font-size:15px;font-weight:bold">1. <?php echo mo2f_lt( 'Login Screen Options' ); ?></p>
        <div>
            <ul style="margin-left:4%" class="mo2f_ol">
                <li><?php echo mo2f_lt( 'Login with Wordpress username/password and 2nd Factor' ); ?> <a
                            class="btn btn-link" data-toggle="collapse" id="showpreview1" href="#preview3"
                            aria-expanded="false">[ <?php echo mo2f_lt( 'See Preview' ); ?>
                        ]</a>
                    <div class="mo2f_collapse" id="preview3" style="height:300px;">
                        <center><br>
                            <img style="height:300px;"
                                 src="https://auth.miniorange.com/moas/images/help/login-help-1.png">
                        </center>

                    </div>
                    <br></li>
                <li><?php echo mo2f_lt( 'Login with Wordpress username and 2nd Factor only' ); ?> <a
                            class="btn btn-link" data-toggle="collapse" id="showpreview2" href="#preview4"
                            aria-expanded="false">[ <?php echo mo2f_lt( 'See Preview' ); ?>
                        ]</a>
                    <br>
                    <div class="mo2f_collapse" id="preview4" style="height:300px;">
                        <center><br>
                            <img style="height:300px;"
                                 src="https://auth.miniorange.com/moas/images/help/login-help-3.png">
                        </center>
                    </div>
                    <br>
                </li>
            </ul>


        </div>
        <br>
        <p style="font-size:15px;font-weight:bold">2. <?php echo mo2f_lt( 'Custom Redirect URLs' ); ?></p>
        <p style="margin-left:4%"><?php echo mo2f_lt( 'Enable Custom Relay state URL\'s (based on user roles in Wordpress) to which the users
            will get redirected to, after the 2-factor authentication' ); ?>'.</p>


        <br>
        <p style="font-size:15px;font-weight:bold">3. <?php echo mo2f_lt( 'Custom Security Questions (KBA)' ); ?></p>
        <div id="mo2f_customKBAQuestions1">
            <p style="margin-left:4%"><?php echo mo2f_lt( 'Add up to 16 Custom Security Questions for Knowledge based authentication (KBA).
                You also have the option to select how many standard and custom questions should be shown to the
                users' ); ?>.</p>

        </div>
        <br>
        <p style="font-size:15px;font-weight:bold">
            4. <?php echo mo2f_lt( 'Custom account name in Google Authenticator App' ); ?></p>
        <div id="mo2f_editGoogleAuthenticatorAccountName1">

            <p style="margin-left:4%"><?php echo mo2f_lt( 'Customize the Account name in the Google Authenticator App' ); ?>
                .</p>

        </div>
        <br>
    </div>
    <div>
        <a class="mo2f_view_backup_options_prem" onclick="show_backup_options_prem()">
            <img src="<?php echo plugins_url( 'includes/images/right-arrow.png"', __FILE__ ); ?>"
                 class="mo2f_advanced_options_images"/>

            <p class="mo2f_heading_style"><?php echo mo2f_lt( 'Backup Options' ); ?></p>
        </a>

    </div>
    <div id="backup_options_prem" style="margin-left: 5%;">

        <div class="mo2f_advanced_options_note"><p style="padding:5px;">
                <i><?php echo mo2f_lt( 'Use these backup options to login to your site in case your 
                            phone is lost / not accessible or if you are not able to login using your primary 
                            authentication method.' ); ?></i></p></div>

        <ol class="mo2f_ol">
            <li><?php echo mo2f_lt( 'KBA (Security Questions)' ); ?></li>
            <li><?php echo mo2f_lt( 'OTP Over Email' ); ?></li>
            <li><?php echo mo2f_lt( 'Backup Codes' ); ?></li>
        </ol>

    </div>


    <div>
        <a class="mo2f_view_inline_registration_options" onclick="show_inline_registration_options()">
            <img src="<?php echo plugins_url( 'includes/images/right-arrow.png"', __FILE__ ); ?>"
                 class="mo2f_advanced_options_images"/>
            <p class="mo2f_heading_style"><?php echo mo2f_lt( 'Inline Registration Options' ); ?></p>
        </a>
    </div>


    <div id="inline_registration_options" style="margin-left: 5%;">

        <div class="mo2f_advanced_options_note"><p style="padding:5px;">
                <i><?php echo mo2f_lt( 'Inline Registration is the registration process the users go through the first time they
                            setup 2FA.' ); ?><br>
					<?php echo mo2f_lt( 'If Inline Registration is enabled by the admin for the users, the next time
                            the users login to the website, they will be prompted to set up the 2FA of their choice by
                            creating an account with miniOrange.' ); ?>


                </i></p></div>


        <p style="font-size:15px;font-weight:bold"><?php echo mo2f_lt( 'Features' ) ?>:</p>
        <ol style="margin-left: 5%" class="mo2f_ol">
            <li><?php echo mo2f_lt( 'Invoke 2FA Registration & Setup for Users during first-time login (Inline Registration)' ); ?>
            </li>

            <li><?php echo mo2f_lt( 'Verify Email address of User during Inline Registration' ); ?></li>
            <li><?php echo mo2f_lt( 'Remove Knowledge Based Authentication(KBA) setup during inline registration' ); ?></li>
            <li><?php echo mo2f_lt( 'Enable 2FA for specific Roles' ); ?></li>
            <li><?php echo mo2f_lt( 'Enable specific 2FA methods to Users during Inline Registration' ); ?>:
                <ul style="padding-top:10px;">
                    <li style="margin-left: 5%;">
                        1. <?php echo mo2f_lt( 'Show specific 2FA methods to All Users' ); ?></li>
                    <li style="margin-left: 5%;">
                        2. <?php echo mo2f_lt( 'Show specific 2FA methods to Users based on their roles' ); ?></li>
                </ul>
            </li>
        </ol>
    </div>


    <div>
        <a class="mo2f_view_login_options" onclick="show_login_options()">
            <img src="<?php echo plugins_url( 'includes/images/right-arrow.png"', __FILE__ ); ?>"
                 class="mo2f_advanced_options_images"/>
            <p class="mo2f_heading_style"><?php echo mo2f_lt( 'User Login Options' ); ?></p>
        </a>
    </div>

    <div id="login_options" style="margin-left: 5%;">

        <div class="mo2f_advanced_options_note"><p style="padding:5px;">
                <i><?php echo mo2f_lt( 'These are the options customizable for your users.' ); ?>


                </i></p></div>

        <ol style="margin-left: 5%" class="mo2f_ol">
            <li><?php echo mo2f_lt( 'Enable 2FA during login for specific users on your site' ); ?>.</li>

            <li><?php echo mo2f_lt( 'Enable login from external apps that support XML-RPC. (eg. Wordpress App)' ); ?>
                <br>
                <div class="mo2f_advanced_options_note"><p style="padding:5px;">
                        <i><?php echo mo2f_lt( 'Use the Password generated in the 2FA plugin to login to your Wordpress Site from
                                    any application that supports XML-RPC.' ); ?>


                        </i></p></div>


            <li><?php echo mo2f_lt( 'Enable KBA (Security Questions) as 2FA for Users logging in to the site from mobile
            phones.' ); ?>
            </li>


        </ol>
    </div>
	<?php
}

?>