<?php
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
class MO2f_Utility {

	public static function get_hidden_phone( $phone ) {
		$hidden_phone = 'xxxxxxx' . substr( $phone, strlen( $phone ) - 3 );

		return $hidden_phone;
	}

	public static function mo2f_check_empty_or_null( $value ) {
		if ( ! isset( $value ) || $value == '' ) {
			return true;
		}

		return false;
	}

	public static function is_curl_installed() {
		if ( in_array( 'curl', get_loaded_extensions() ) ) {
			return 1;
		} else {
			return 0;
		}
	}

	public static function mo2f_check_number_length( $token ) {
		if ( is_numeric( $token ) ) {
			if ( strlen( $token ) >= 4 && strlen( $token ) <= 8 ) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}

	public static function mo2f_get_hidden_email( $email ) {
		if ( ! isset( $email ) || trim( $email ) === '' ) {
			return "";
		}
		$emailsize    = strlen( $email );
		$partialemail = substr( $email, 0, 1 );
		$temp         = strrpos( $email, "@" );
		$endemail     = substr( $email, $temp - 1, $emailsize );
		for ( $i = 1; $i < $temp; $i ++ ) {
			$partialemail = $partialemail . 'x';
		}
		$hiddenemail = $partialemail . $endemail;

		return $hiddenemail;
	}

	public static function check_if_email_is_already_registered( $email ) {
		global $Mo2fdbQueries;
		$users = get_users( array() );
		foreach ( $users as $user ) {
			$user_email = $Mo2fdbQueries->get_user_detail( 'mo2f_user_email', $user->ID );
			if ( $user_email == $email ) {
				return true;
			}
		}

		return false;
	}

	public static function check_if_request_is_from_mobile_device( $useragent ) {
		if ( preg_match( '/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i', $useragent ) || preg_match( '/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i', substr( $useragent, 0, 4 ) ) ) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * The function returns the session variables, and if not, retrieves the cookie values set in case the right permissions are not aassigned for the sessions folder in the server.
	 *
	 * @param string $variable - the session or cookie variable name
	 *
	 * @return string
	 */
	public static function mo2f_retrieve_session_or_cookie_values( $variable ) {

		if ( isset( $_SESSION[ $variable ] ) && ! empty( $_SESSION[ $variable ] ) ) {
			return $_SESSION[ $variable ];
		} else {
			$key          = get_option( 'mo2f_customer_token' );
			$cookie_value = false;

			if ( $variable == 'mo2f_rba_status' ) {
				if ( isset( $_COOKIE['mo2f_rba_status_status'] ) && ! empty( $_COOKIE['mo2f_rba_status_status'] ) ) {
					$mo2f_rba_status_status        = MO2f_Utility::mo2f_get_cookie_values( 'mo2f_rba_status_status' );
					$mo2f_rba_status_sessionUuid   = MO2f_Utility::mo2f_get_cookie_values( 'mo2f_rba_status_sessionUuid' );
					$mo2f_rba_status_decision_flag = MO2f_Utility::mo2f_get_cookie_values( 'mo2f_rba_status_decision_flag' );

					$cookie_value = array(
						"status"        => $mo2f_rba_status_status,
						"sessionUuid"   => $mo2f_rba_status_sessionUuid,
						"decision_flag" => $mo2f_rba_status_decision_flag
					);
				}

			} else if ( $variable == 'mo_2_factor_kba_questions' ) {

				if ( isset( $_COOKIE['kba_question1'] ) && ! empty( $_COOKIE['kba_question1'] ) ) {
					$kba_question1 = MO2f_Utility::mo2f_get_cookie_values( 'kba_question1' );
					$kba_question2 = MO2f_Utility::mo2f_get_cookie_values( 'kba_question2' );


					$cookie_value = array( $kba_question1, $kba_question2 );
				}

			} else {
				$cookie_value = MO2f_Utility::mo2f_get_cookie_values( $variable );
			}

			return ! $cookie_value ? false : $cookie_value;

		}

	}

	/**
	 * The function gets the cookie value after decoding and decryption.
	 *
	 * @param string $cookiename - the cookie name
	 *
	 * @return string
	 */
	public static function mo2f_get_cookie_values( $cookiename ) {
		$key = get_option( 'mo2f_customer_token' );
		if ( isset( $_COOKIE[ $cookiename ] ) ) {
			$decrypted_data = MO2f_Utility::decrypt_data( base64_decode( $_COOKIE[ $cookiename ] ), $key );
			if ( $decrypted_data ) {
				$decrypted_data_array = explode( '&', $decrypted_data );

				$cookie_value         = $decrypted_data_array[0];
				$cookie_creation_time = new DateTime( $decrypted_data_array[1] );
				$current_time         = new DateTime( 'now' );

				$interval = $cookie_creation_time->diff( $current_time );
				$minutes  = $interval->format( '%i' );

				$is_cookie_valid = $minutes <= 5 ? true : false;

				return $is_cookie_valid ? $cookie_value : false;

			} else {
				return false;
			}
		} else {
			return false;
		}
	}

	/**
	 * @param string $data - crypt response from Sagepay
	 *
	 * @return string
	 */
	public static function decrypt_data( $data, $key ) {
		$strIn  = base64_decode( $data );
		$key    = openssl_digest( $key, 'sha256' );
		$method = 'AES-128-ECB';
		$ivSize = openssl_cipher_iv_length( $method );
		$iv     = substr( $strIn, 0, $ivSize );
		$data   = substr( $strIn, $ivSize );
		$clear  = openssl_decrypt( $data, $method, $key, OPENSSL_RAW_DATA || OPENSSL_ZERO_PADDING, $iv );

		return $clear;
	}

	/**
	 * The function sets the cookie value after encryption and encoding.
	 *
	 * @param string $cookiename - the cookie name
	 * @param string $cookievalue - the cookie value to be set
	 *
	 * @return string
	 */
	public static function mo2f_set_cookie_values( $cookiename, $cookievalue ) {
		$key = get_option( 'mo2f_customer_token' );

		$current_time = new DateTime( 'now' );
		$current_time = $current_time->format( 'Y-m-d H:i:sP' );
		$cookievalue  = $cookievalue . '&' . $current_time;

		$cookievalue_encrypted = MO2f_Utility::encrypt_data( $cookievalue, $key );
		setcookie( $cookiename, base64_encode( $cookievalue_encrypted ) );

	}

	/**
	 * @param string $data - the key=value pairs separated with &
	 *
	 * @return string
	 */
	public static function encrypt_data( $data, $key ) {
		$key      = openssl_digest( $key, 'sha256' );
		$method   = 'AES-128-ECB';
		$ivSize   = openssl_cipher_iv_length( $method );
		$iv       = openssl_random_pseudo_bytes( $ivSize );
		$strCrypt = openssl_encrypt( $data, $method, $key, OPENSSL_RAW_DATA || OPENSSL_ZERO_PADDING, $iv );

		return base64_encode( $iv . $strCrypt );
	}

	/**
	 * The function unsets the session variables passed.
	 *
	 * @param array $variables - the array of session variables to be unset
	 *
	 * @return NA
	 */
	public static function unset_session_variables( $variables ) {

		if ( gettype( $variables ) == "array" ) {
			foreach ( $variables as $variable ) {
				if ( isset( $_SESSION[ $variable ] ) ) {
					unset( $_SESSION[ $variable ] );
				}
			}
		} else {
			if ( isset( $_SESSION[ $variables ] ) ) {
				unset( $_SESSION[ $variables ] );
			}
		}
	}

	/**
	 * The function unsets the cookie variables passed.
	 *
	 * @param array $variables - the array of cookie variables to be unset
	 *
	 * @return NA
	 */
	public static function unset_cookie_variables( $variables ) {

		if ( gettype( $variables ) == "array" ) {
			foreach ( $variables as $variable ) {
				if ( isset( $_COOKIE[ $variable ] ) ) {
					setcookie( $variable, '', time() - 3600 );
				}
			}
		} else {
			if ( isset( $_COOKIE[ $variables ] ) ) {
				setcookie( $variables, '', time() - 3600 );
			}
		}
	}

	/**
	 * The function decodes the twofactor methods
	 *
	 * @param array $variables - the selected 2-factor method and the decode type.
	 *
	 * @return NA
	 */
	public static function mo2f_decode_2_factor( $selected_2_factor_method, $decode_type ) {

		if ( $selected_2_factor_method == 'NONE' ) {
			return $selected_2_factor_method;
		}

		$wpdb_2fa_methods = array(
			"miniOrangeQRCodeAuthentication" => "miniOrange QR Code Authentication",
			"miniOrangeSoftToken"            => "miniOrange Soft Token",
			"miniOrangePushNotification"     => "miniOrange Push Notification",
			"GoogleAuthenticator"            => "Google Authenticator",
			"AuthyAuthenticator"             => "Authy Authenticator",
			"SecurityQuestions"              => "Security Questions",
			"EmailVerification"              => "Email Verification",
			"OTPOverSMS"                     => "OTP Over SMS"
		);

		$server_2fa_methods = array(
			"miniOrange QR Code Authentication" => "MOBILE AUTHENTICATION",
			"miniOrange Soft Token"             => "SOFT TOKEN",
			"miniOrange Push Notification"      => "PUSH NOTIFICATIONS",
			"Google Authenticator"              => "GOOGLE AUTHENTICATOR",
			"Authy Authenticator"               => "GOOGLE AUTHENTICATOR",
			"Security Questions"                => "KBA",
			"Email Verification"                => "OUT OF BAND EMAIL",
			"OTP Over SMS"                      => "SMS",
			"EMAIL"                             => "OTP Over Email"
		);

		$server_to_wpdb_2fa_methods = array(
			"MOBILE AUTHENTICATION" => "miniOrange QR Code Authentication",
			"SOFT TOKEN"            => "miniOrange Soft Token",
			"PUSH NOTIFICATIONS"    => "miniOrange Push Notification",
			"GOOGLE AUTHENTICATOR"  => "Google Authenticator",
			"KBA"                   => "Security Questions",
			"OUT OF BAND EMAIL"     => "Email Verification",
			"SMS"                   => "OTP Over SMS",
			"EMAIL"                 => "OTP Over Email"
		);

		if ( $decode_type == "wpdb" ) {
			return $wpdb_2fa_methods[ $selected_2_factor_method ];
		} else if ( $decode_type == "server" ) {
			return $server_2fa_methods[ $selected_2_factor_method ];
		} else {
			return $server_to_wpdb_2fa_methods[ $selected_2_factor_method ];
		}

	}


}

?>