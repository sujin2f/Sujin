<?php
/**
 * Initialize Assets
 *
 * @package sujinc.com
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin;

class Environment {
	public $data = array(
		'ENV' => 'development',
	);

	public function __construct() {
		$filename = dirname( __DIR__ ) . '/.env';
		$handle   = fopen( $filename, 'r' );

		if ( ! $handle ) {
			return;
		}

		$text = fread( $handle, filesize( $filename ) );
		fclose( $handle );
		$text = explode( "\n", $text );

		foreach ( $text as $line ) {
			if ( ! $line ) {
				continue;
			}

			$line = explode( '=', $line, 2 );

			$this->data[ $line[0] ] = $line[1];
		}
	}
}
