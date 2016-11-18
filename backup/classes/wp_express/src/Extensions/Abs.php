<?php
/**
 *
 * Abstraction Class
 *
 * @author	Sujin 수진 Choi
 * @package	wp-express
 * @version	4.0.0
 * @website	http://sujinc.com
 *
 * Licensed under The MIT License
 * Redistributions of files must retain the above copyright notice
 *
 */

namespace WE\Extensions;

if ( !defined( 'ABSPATH' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

abstract class Abs {
	public $key, $name, $values;
	protected $defaultName = 'New';

	public function __construct() {
		$this->name = ( !func_num_args() ) ? $this->defaultName : func_get_arg(0);
		$this->key = sanitize_title( $this->name );
	}
}
