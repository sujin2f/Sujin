<?php // phpcs:ignore WordPress.Files.FileName.InvalidClassFileName
/**
 * RESTful API Item Base
 *
 * @package sujinc.com
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin\Rest_Endpoints;

use Sujin\Wordpress\WP_Express\Helpers\Schema;

/**
 * RESTful API Item Base
 *
 * This class finds JSON schema and validate data when it serialized into JSON
 */
abstract class Items extends Schema {
	protected const ITEM_NAME = '';

	/**
	 * Returns the item's file name
	 *
	 * @return     string
	 * @static
	 * @visibility protected
	 */
	protected static function get_base_dir(): string {
		return get_stylesheet_directory() . DIRECTORY_SEPARATOR . '.configs' . DIRECTORY_SEPARATOR . 'schema' . DIRECTORY_SEPARATOR . 'response';
	}

	/**
	 * Returns the item's file name
	 *
	 * @return string
	 * @static
	 */
	public static function get_item_json_path(): string {
		$format = self::get_base_dir() . DIRECTORY_SEPARATOR . '%s.json';

		if ( static::ITEM_NAME ) {
			return sprintf( $format, static::ITEM_NAME );
		}

		$called_class = explode( '\\', get_called_class() );
		return sprintf( $format, strtolower( array_pop( $called_class ) ) );
	}

	/**
	 * Returns an array to be JSON
	 *
	 * @see    https://developer.wordpress.org/reference/functions/wp_filesystem/
	 * @return array
	 */
	public function jsonSerialize(): array {
		global $wp_filesystem;
		require_once ABSPATH . '/wp-admin/includes/file.php';
		WP_Filesystem();

		$json = array();
		if ( $wp_filesystem->exists( self::get_item_json_path() ) ) {
			$json = $wp_filesystem->get_contents( self::get_item_json_path() );
			$json = json_decode( $json, true );

			$this->set_json( $json );
			return $this->filter( get_object_vars( $this ) );
		}

		return array();
	}
}
