<?php
/**
 * Dev exception: ID shouldn't be null
 *
 * @project WP Express
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\WP_Express\Exceptions;

use Exception;

if ( ! defined( 'ABSPATH' ) ) {
	header( 'Status: 404 Not Found' );
	header( 'HTTP/1.1 404 Not Found' );
	exit();
}

class Initialized_Exception extends Exception {
	protected $message = 'The class is not initialized properly. Please check the code.';
	protected $code    = 'WPEX-0000';
}
