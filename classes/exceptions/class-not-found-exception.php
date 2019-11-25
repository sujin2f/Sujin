<?php
/**
 * Not Exist Exception
 *
 * @project WP Express
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin\Exceptions;

use Exception;

class Not_Found_Exception extends Exception {
	protected $message = ' does not exist.';

	public function __construct( string $object = null, int $code = 0 ) {
		if ( ! $object ) {
			throw new $this( $object . $this->message );
		}

		$this->message = $object . $this->message;
		parent::__construct( $this->message, $code );
	}

	public function __toString() {
		return __CLASS__ . ": {$this->message}\n";
    }
}
