<?php
/**
 * Admin Class
 *
 * @project WP-Express
 * @since   1.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\WP_Express;

use Sujin\Wordpress\WP_Express\Helpers\Meta_Base;

if ( !defined( "ABSPATH" ) ) {
	header( "Status: 404 Not Found" );
	header( "HTTP/1.1 404 Not Found" );
	exit();
}

class Setting extends Base {
	use Meta_Base;

	public $section = 'Additional Settings';
	private $page = 'general';

	public function __construct( $name ) {
		$this->name       = $name;
		$this->id         = 'wp-express-' . sanitize_title( $this->name );
		$this->show_label = false;

		add_action( 'admin_init', array( $this, 'register_setting' ) );
	}

	public function set_section( $section ) {
		$this->section = $section;
		return $this;
	}

	public function set_page( $page ) {
		$this->page = $page;
		return $this;
	}

	public function register_setting() {
		global $wp_settings_sections;

		$section_id = sanitize_title( $this->section );

		if ( ! isset( $wp_settings_sections[$this->page][$section_id] ) ) {
			add_settings_section( $section_id, $this->section, null, $this->page );
		}

		add_settings_field(
			$this->id,
			$this->name,
			array( $this, 'print_field' ),
			$this->page,
			$section_id
		);

        if ( false === get_option( $this->id ) ) {
            add_option( $this->id );
        }

		register_setting( $section_id, $this->id );
	}
}
