<?php  // phpcs:ignore WordPress.Files.FileName.InvalidClassFileName

class Env_PHP {
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
