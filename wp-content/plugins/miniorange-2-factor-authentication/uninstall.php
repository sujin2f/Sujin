<?php


if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit();
}

include_once dirname( __FILE__ ) . '/database/database_functions.php';
global $wpdb;
$Mo2fdbQueries = new Mo2fDB();

$table_name = $wpdb->prefix . 'mo2f_user_details';
$Mo2fdbQueries->drop_table( $table_name );

if ( ! is_multisite() ) {

	delete_option( 'mo2f_email' );
	delete_option( 'mo2f_host_name' );
	delete_option( 'user_phone' );
	delete_option( 'mo2f_customerKey' );
	delete_option( 'mo2f_api_key' );
	delete_option( 'mo2f_customer_token' );
	delete_option( 'mo2f_message' );
	delete_option( 'mo_2factor_admin_registration_status' );
	delete_option( 'mo2f-login-message' );
	delete_option( 'mo_2f_login_type_enabled' );
	delete_option( 'mo2f_admin_disabled_status' );
	delete_option( 'mo2f_disabled_status' );
	delete_option( 'mo2f_miniorange_admin' );
	delete_option( 'mo2f_enable_forgotphone' );
	delete_option( 'mo2f_enable_login_with_2nd_factor' );
	delete_option( 'mo2f_activate_plugin' );
	delete_option( 'mo2f_enable_2fa_for_woocommerce' );
	delete_option( 'mo2f_remember_device' );
	delete_option( 'mo2f_app_secret' );
	delete_option( 'mo2f_inline_registration' );
	delete_option( 'mo2f_enable_custom' );
	delete_option( 'mo2f_custom_plugin_name' );
	delete_option( 'mo2f_enable_custom_icon' );
	delete_option( 'mo2f_show_sms_transaction_message' );
	update_option( 'mo2f_is_NC', 1 );
	update_option( 'mo2f_is_NNC', 1 );
	delete_option( 'mo2f_admin_first_name' );
	delete_option( 'mo2_admin_last_name' );
	delete_option( 'mo2f_admin_company' );

	delete_option( 'mo2f_auth_methods_for_users' );
	delete_option( 'mo2f_enable_mobile_support' );
	delete_option( 'mo2f_login_policy' );
	delete_option( 'mo2f_msg_counter' );
	delete_option( 'mo2f_modal_display' );
	delete_option( 'mo2f_disable_poweredby' );
	delete_option( 'mo2f_new_customer' );
	delete_option( 'mo2f_enable_2fa_for_users' );
	delete_option( 'mo2f_phone' );
	delete_option( 'mo2f_existing_user_values_updated' );
	delete_option( 'mo2f_dbversion' );
	delete_option( 'mo2f_bug_fix_done' );

	delete_option( 'mo2f_admin_first_name' );
	delete_option( 'mo2_admin_last_name' );
	delete_option( 'mo2f_admin_company' );

	//delete all stored key-value pairs for the roles
	global $wp_roles;
	if ( ! isset( $wp_roles ) ) {
		$wp_roles = new WP_Roles();
	}
	foreach ( $wp_roles->role_names as $id => $name ) {
		delete_option( 'mo2fa_' . $id );
		delete_option( 'mo2fa_' . $id . '_login_url' );
	}
} else {
	global $wpdb;

	$blog_ids         = $wpdb->get_col( "SELECT blog_id FROM $wpdb->blogs" );
	$original_blog_id = get_current_blog_id();

	foreach ( $blog_ids as $blog_id ) {
		switch_to_blog( $blog_id );
		delete_option( 'mo2f_email' );
		delete_option( 'mo2f_host_name' );
		delete_option( 'user_phone' );
		delete_option( 'mo2f_customerKey' );
		delete_option( 'mo2f_api_key' );
		delete_option( 'mo2f_customer_token' );
		delete_option( 'mo2f_message' );
		delete_option( 'mo_2factor_admin_registration_status' );
		delete_option( 'mo2f-login-message' );
		delete_option( 'mo_2f_login_type_enabled' );
		delete_option( 'mo2f_admin_disabled_status' );
		delete_option( 'mo2f_disabled_status' );
		delete_option( 'mo2f_miniorange_admin' );
		delete_option( 'mo2f_enable_forgotphone' );
		delete_option( 'mo2f_enable_login_with_2nd_factor' );
		delete_option( 'mo2f_activate_plugin' );
		delete_option( 'mo2f_enable_2fa_for_woocommerce' );
		delete_option( 'mo2f_remember_device' );
		delete_option( 'mo2f_app_secret' );
		delete_option( 'mo2f_inline_registration' );
		delete_option( 'mo2f_enable_custom' );
		delete_option( 'mo2f_custom_plugin_name' );
		delete_option( 'mo2f_enable_custom_icon' );
		delete_option( 'mo2f_number_of_transactions' );
		delete_option( 'mo2f_set_transactions' );
		delete_option( 'mo2f_show_sms_transaction_message' );
		update_option( 'mo2f_is_NC', 1 );
		update_option( 'mo2f_is_NNC', 1 );

		delete_option( 'mo2f_auth_methods_for_users' );
		delete_option( 'mo2f_enable_mobile_support' );
		delete_option( 'mo2f_login_policy' );
		delete_option( 'mo2f_msg_counter' );
		delete_option( 'mo2f_modal_display' );
		delete_option( 'mo2f_disable_poweredby' );
		delete_option( 'mo2f_new_customer' );
		delete_option( 'mo2f_enable_2fa_for_users' );
		delete_option( 'mo2f_phone' );
		delete_option( 'mo2f_existing_user_values_updated' );
		delete_option( 'mo2f_dbversion' );

		delete_option( 'mo2f_admin_first_name' );
		delete_option( 'mo2_admin_last_name' );
		delete_option( 'mo2f_admin_company' );

		delete_option( 'mo2f_bug_fix_done' );
		//delete all stored key-value pairs for the roles
		global $wp_roles;
		if ( ! isset( $wp_roles ) ) {
			$wp_roles = new WP_Roles();
		}
		foreach ( $wp_roles->role_names as $id => $name ) {
			delete_option( 'mo2fa_' . $id );
			delete_option( 'mo2fa_' . $id . '_login_url' );
		}

	}
	switch_to_blog( $original_blog_id );
}
$users = get_users( array() );
foreach ( $users as $user ) {
	delete_user_meta( $user->ID, 'phone_verification_status' );
	delete_user_meta( $user->ID, 'test_2FA' );
	delete_user_meta( $user->ID, 'mo2f_2FA_method_to_configure' );
	delete_user_meta( $user->ID, 'configure_2FA' );
	delete_user_meta( $user->ID, 'skipped_flow_driven_setup' );
	delete_user_meta( $user->ID, 'current_modal' );
	delete_user_meta( $user->ID, 'mo2f_2FA_method_to_test' );
	delete_user_meta( $user->ID, 'mo2f_phone' );
	delete_user_meta( $user->ID, 'mo_2factor_user_registration_status' );
	delete_user_meta( $user->ID, 'mo2f_external_app_type' );
}
//delete previous version key-value pairs
delete_option( 'mo_2factor_admin_mobile_registration_status' );
delete_option( 'mo_2factor_registration_status' );
delete_option( 'mo_2factor_temp_status' );
delete_option( 'mo2f_login_username' );
delete_option( 'mo2f-login-qrCode' );
delete_option( 'mo2f_transactionId' );
delete_option( 'mo_2factor_login_status' );

?>