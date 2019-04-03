<?php
/**
 * Instantiable Trait
 *
 * @project WP-Express
 * @since   1.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\WP_Express\Helpers;

if ( !defined( "ABSPATH" ) ) {
	header( "Status: 404 Not Found" );
	header( "HTTP/1.1 404 Not Found" );
	exit();
}

trait Assets {
	static $scripts = array();
	static $styles  = array();

	static $embeded_scripts = array();
	static $embeded_styles  = array();

	private $current_script;

	public function set_script( $script ) {
		$this->current_script = $script;

		if ( in_array( $script, self::$scripts ) )
			return $this;

		self::$scripts[ $script ] = array();

		return $this;
	}

	public function set_localize( $name, $translation_array ) {
		self::$scripts[ $this->current_script ] = array(
			'translation' => $translation_array,
			'name'        => $name,
		);

		return $this;
	}

	public function set_style( $style ) {
		if ( in_array( $style, self::$styles ) )
			return $this;

		self::$styles[ $style ] = true;
		return $this;
	}

	public function enqueue_scripts() {
		if ( self::$scripts ) {
			$i = 0;

			foreach( self::$scripts as $src => $translation ) {
				if ( in_array( $src, self::$embeded_scripts ) )
					continue;

				$handle = "{$this->id}-{$i}";

				wp_register_script( $handle, $src, array( 'jquery' ) );

				if ( ! empty( $translation ) ) {
					wp_localize_script( $handle, $translation['name'] , $translation['translation'] );
				}

				wp_enqueue_script( $handle );

				$i++;
				self::$embeded_scripts[ $src ] = true;
			}
		}

		if ( self::$styles ) {
			$i = 0;

			foreach( self::$styles as $src => $null ) {
				if ( in_array( $src, self::$embeded_styles ) )
					continue;

				$handle = "{$this->id}-{$i}";

				wp_register_style( $handle, $src , false );
				wp_enqueue_style( $handle );

				$i++;
				self::$embeded_styles[ $src ] = true;
			}
		}

		return $this;
	}

}
