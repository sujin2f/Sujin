<?php

require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );

class Mo2fDB {
	private $userDetailsTable;

	function __construct() {
		global $wpdb;
		$this->userDetailsTable = $wpdb->prefix . 'mo2f_user_details';
	}

	function mo_plugin_activate() {
		global $wpdb;
		if ( ! get_option( 'mo2f_dbversion' ) ) {
			update_option( 'mo2f_dbversion', 140 );
			$this->generate_tables();
		} else {
			$current_db_version = get_option( 'mo2f_dbversion' );
			if ( $current_db_version < 140 ) {
				update_option( 'mo2f_dbversion', 140 );
			}
			//update the tables based on DB_VERSION.
		}
	}

	function generate_tables() {
		global $wpdb;

		$tableName = $this->userDetailsTable;
		$sql       = "CREATE TABLE IF NOT EXISTS " . $tableName . " (
				`user_id` bigint NOT NULL, 
				`mo2f_OTPOverSMS_config_status` tinyint, 
				`mo2f_miniOrangePushNotification_config_status` tinyint, 
				`mo2f_miniOrangeQRCodeAuthentication_config_status` tinyint, 
				`mo2f_miniOrangeSoftToken_config_status` tinyint, 
				`mo2f_AuthyAuthenticator_config_status` tinyint, 
				`mo2f_EmailVerification_config_status` tinyint, 
				`mo2f_SecurityQuestions_config_status` tinyint, 
				`mo2f_GoogleAuthenticator_config_status` tinyint, 
				`mobile_registration_status` tinyint, 
				`mo2f_2factor_enable_2fa_byusers` tinyint DEFAULT 1,
				`mo2f_configured_2FA_method` mediumtext NOT NULL , 
				`mo2f_user_phone` mediumtext NOT NULL , 
				`mo2f_user_email` mediumtext NOT NULL,  
				`user_registration_with_miniorange` mediumtext NOT NULL, 
				`mo_2factor_user_registration_status` mediumtext NOT NULL,
				UNIQUE KEY user_id (user_id) );";
		dbDelta( $sql );


	}


	function insert_user( $user_id ) {
		global $wpdb;
		$sql = "INSERT INTO $this->userDetailsTable (user_id) VALUES($user_id) ON DUPLICATE KEY UPDATE user_id=$user_id";
		$wpdb->query( $sql );
	}

	function drop_table( $table_name ) {
		global $wpdb;
		$sql = "DROP TABLE $table_name";
		$wpdb->query( $sql );
	}


	function get_user_detail( $column_name, $user_id ) {
		global $wpdb;
		$user_column_detail = $wpdb->get_results( "SELECT " . $column_name . " FROM " . $this->userDetailsTable . " WHERE user_id = " . $user_id . ";" );
		$value              = empty( $user_column_detail ) ? '' : get_object_vars( $user_column_detail[0] );

		return $value == '' ? '' : $value[ $column_name ];
	}

	function delete_user_details( $user_id ) {
		global $wpdb;
		$wpdb->query(
			"DELETE FROM " . $this->userDetailsTable . "
				 WHERE user_id = " . $user_id
		);

		return;
	}

	function check_if_table_exists( ) {
		global $wpdb;
		$does_table_exist= $wpdb->query(
			"SHOW TABLES LIKE  '" . $this->userDetailsTable . "';"
		);

		return $does_table_exist;
	}

	function check_if_user_column_exists($user_id){
		global $wpdb;
		$value = $wpdb->query(
			"SELECT * FROM " . $this->userDetailsTable . "
				 WHERE user_id = " . $user_id
		);

		return $value;

	}

	function update_user_details( $user_id, $update ) {
		global $wpdb;
		$count = count( $update );
		$sql   = "UPDATE " . $this->userDetailsTable . " SET ";
		$i     = 1;
		foreach ( $update as $key => $value ) {

			$sql .= $key . "='" . $value . "'";
			if ( $i < $count ) {
				$sql .= ' , ';
			}
			$i ++;
		}
		$sql .= " WHERE user_id=" . $user_id . ";";
		$wpdb->query( $sql );

		return;

	}

}