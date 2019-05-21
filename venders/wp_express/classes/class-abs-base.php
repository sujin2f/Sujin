<?php
/**
 * The base class inherited for all types
 * 알파요 오메가이니라
 *
 * @project WP Express
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\WP_Express;

use Sujin\Wordpress\WP_Express\Exceptions\Initialized_Exception;

if ( ! defined( 'ABSPATH' ) ) {
	header( 'Status: 404 Not Found' );
	header( 'HTTP/1.1 404 Not Found' );
	exit();
}

abstract class Abs_Base {
	protected const PREFIX = 'wp-express';

	/*
	 * Multiton container
	 */
	private static $_multiton_container = array();

	/*
	 * Singleton container
	 */
	private static $_singleton_container = array();

	/*
	 * All types have its own unique ID
	 */
	private $_id = null;
	public function get_id(): string {
		if ( is_null( $this->_id ) ) {
			throw new Initialized_Exception();
		}
		return $this->_id;
	}

	/*
	 * All types have its name
	 */
	private $_name = null;
	public function get_name(): string {
		if ( is_null( $this->_name ) ) {
			throw new Initialized_Exception();
		}
		return $this->_name;
	}

	/*
	 * All types can load assets. $_p_scripts is the pointer of the $_scripts
	 */
	private $_scripts   = array();
	private $_p_scripts = null;
	private $_styles    = array();

	public function __construct( ?string $name = null ) {
		$this->_name = $name;
		$this->_id   = sanitize_title( $name );

		## Assets
		add_action( 'init', array( $this, '_register_assets' ) );
		add_action( 'wp_enqueue_scripts', array( $this, '_wp_enqueue_scripts' ) );
		add_action( 'admin_enqueue_scripts', array( $this, '_admin_enqueue_scripts' ) );
	}

	/*
	 * Supports both singleton and multiton patterns
	 * Without argument, this returns a singleton
	 */
	public static function get_instance( ...$args ): Abs_Base {
		$num_args = func_num_args();
		$caller   = get_called_class();

		## Singleton
		if ( 0 === $num_args ) {
			if ( ! array_key_exists( $caller, self::$_singleton_container ) ) {
				self::$_singleton_container[ $caller ] = new $caller( $caller );
			}

			return self::$_singleton_container[ $caller ];
		}

		## Multiton
		$args = func_get_args();
		$id   = $args[0];
		$key  = md5( $caller . $id );

		if ( ! array_key_exists( $key, self::$_multiton_container ) ) {
			self::$_multiton_container[ $key ] = new $caller( ...$args );
		}

		return self::$_multiton_container[ $key ];
	}

	public function add_script( string $url, bool $is_admin = false, bool $is_footer = false ): Abs_Base {
		$handle                    = $this->_get_assets_handle( $url );
		$attr                      = $this->_scripts[ $handle ] ?? array();
		$attr_new                  = array(
			'url'       => $url,
			'is_admin'  => $is_admin,
			'is_footer' => $is_footer,
		);
		$this->_scripts[ $handle ] = array_merge( $attr, $attr_new );
		$this->_p_scripts          = $handle;

		return $this;
	}

	public function script_localize( string $name, array $translation_array ): Abs_Base {
		$translation = array(
			'translation'     => $translation_array,
			'translation-key' => $name,
		);

		$this->_scripts[ $this->_p_scripts ] = array_merge( $this->_scripts[ $this->_p_scripts ], $translation );

		return $this;
	}

	public function add_style( string $url, bool $is_admin = false, bool $is_footer = false ): Abs_Base {
		$handle                   = $this->_get_assets_handle( $url );
		$this->_styles[ $handle ] = array(
			'url'       => $url,
			'is_admin'  => $is_admin,
			'is_footer' => $is_footer,
		);

		return $this;
	}

	public function _register_assets() {
		## Scripts
		foreach ( $this->_scripts as $handle => $data ) {
			wp_register_script( $handle, $data['url'], null, $this->_get_filetime( $data['url'] ), $data['is_footer'] );

			if ( ! empty( $data['translation'] ) ) {
				wp_localize_script( $handle, $data['translation-key'], $data['translation'] );
			}
		}

		## Styles
		foreach ( $this->_styles as $handle => $data ) {
			wp_register_style( $handle, $data['url'], null, $this->_get_filetime( $data['url'] ), $data['is_footer'] );
		}
	}

	/*
	 * Actions: Front pages
	 */
	public function _wp_enqueue_scripts() {
		foreach ( $this->_scripts as $handle => $data ) {
			if ( ! $data['is_admin'] ) {
				wp_enqueue_script( $handle );
			}
		}

		foreach ( $this->_styles as $handle => $data ) {
			if ( ! $data['is_admin'] ) {
				wp_enqueue_style( $handle );
			}
		}
	}

	/*
	 * Actions: Admin pages
	 */
	public function _admin_enqueue_scripts() {
		foreach ( $this->_scripts as $handle => $data ) {
			if ( $data['is_admin'] ) {
				wp_enqueue_script( $handle );
			}
		}

		foreach ( $this->_styles as $handle => $data ) {
			if ( $data['is_admin'] ) {
				wp_enqueue_style( $handle );
			}
		}
	}

	/*
	 * Get Unique handle
	 */
	private function _get_assets_handle( string $url ): string {
		return self::PREFIX . '-' . sanitize_title( basename( $url ) );
	}

	private function _get_filetime( string $url ): string {
		return filemtime( str_replace( get_option( 'home' ) . '/', ABSPATH, $url ) );
	}

	protected function render_admin_message( string $text, string $class = 'updated' ): Abs_Base {
		if ( ! is_admin() ) {
			return $this;
		}

		?>
		<div id="message" class="<?php echo esc_attr( $class ); ?>">
			<p><?php echo esc_html( $text ); ?></p>
		</div>
		<?php

		return $this;
	}
}
