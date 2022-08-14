<?php
/**
 * Read data from .env
 *
 * @package sujinc.com
 * @since   10.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin;

use Sujin\Wordpress\WP_Express\Helpers\Trait_Singleton;

class Environment {
	use Trait_Singleton;

	public $data = array();

	/**
	 * Read data from .env
	 */
	public function __construct() {
		// $filename = dirname( __DIR__ ) . '/.env';
		// $handle   = fopen( $filename, 'r' );

		// if ( ! $handle ) {
		// 	return;
		// }

		// echo $filename;

		// $text = fread( $handle, filesize( $filename ) );
		// fclose( $handle );
		// $text = explode( "\n", $text );

		// foreach ( $text as $line ) {
		// 	if ( ! $line ) {
		// 		continue;
		// 	}

		// 	$line = explode( '=', $line, 2 );

		// 	$this->data[ strtolower( $line[0] ) ] = $line[1];
		// }
	}

	public function __get( string $key ): string {
		if ( array_key_exists( $key, $this->data ) ) {
			return $this->data[ $key ];
		}

		return '';
	}

}
