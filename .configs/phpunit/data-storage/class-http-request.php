<?php
class Http_Request {
	public static $_instance;

	private const JSON_LOCATION = array(
		'http://api.flickr.com/services/feeds/photos_public.gne?id=test&format=json&nojsoncallback=1' => 'flickr.json',
	);

	public static function get_instance() {
		if ( is_null( self::$_instance ) ) {
			self::$_instance = new self();
		}
		return self::$_instance;
	}

	public function __construct() {
		add_filter( 'pre_http_request', array( $this, 'pre_http_request' ), 10, 3 );
	}

	public function pre_http_request( $pre, $request, $url ) {
		if ( ! is_array( $request ) ) {
			return $pre;
		}

		return $this->get_content_from_url( $url );
	}

	private function get_content_from_url( string $url ): array {
		if ( ! array_key_exists( $url, self::JSON_LOCATION ) ) {
			return $this->get_error( 404 );
		}

		$file = self::JSON_LOCATION[ $url ];
		$path = dirname( __FILE__ ) . '/data/json/' . $file;

		if ( ! file_exists( $path ) ) {
			return $this->get_error( 404 );
		}

		return $this->get_200( $path );

		var_dump( '' );
		var_dump( '' );
		var_dump( 'This case is not yet written. Please add the structure in class-http-request.php. The request URL is ' . $url );
		die;
	}

	private function get_200( string $path ): array {
		$body = '';

		if ( is_dir( $path ) ) {
			$files = scandir( $path );
			$body  = '[';

			foreach ( $files as $file ) {
				if ( '.' !== $file && '..' !== $file ) {
					$body .= file_get_contents( $path . DIRECTORY_SEPARATOR . $file );
					$body .= ',';
				}
			}

			$body  = substr( $body, 0, -1 );
			$body .= ']';
		} else {
			$body = file_get_contents( $path );
		}

		return array(
			'headers'  => new Requests_Utility_CaseInsensitiveDictionary(
				array(
					'server'       => 'nginx/1.10.3',
					'content-type' => 'application/json; charset=utf-8',
				)
			),
			'body'     => $body,
			'response' => array(
				'code'    => 200,
				'message' => 'OK',
			),
		);
	}

	private function get_error( int $code ): array {
		return array(
			'headers'  => new Requests_Utility_CaseInsensitiveDictionary(
				array(
					'server'       => 'nginx/1.10.3',
					'content-type' => 'application/json; charset=utf-8',
				)
			),
			'body'     => json_encode(
				array(
					'statusCode' => $code,
					'error'      => 'Error',
					'message'    => 'Error',
				)
			),
			'response' => array(
				'code'    => $code,
				'message' => 'OK',
			),
		);
	}
}
