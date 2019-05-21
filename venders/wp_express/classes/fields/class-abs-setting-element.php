<?php
/**
 * Interface for Fields
 *
 * @project WP-Express
 * @since   1.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\WP_Express\Fields;

use Sujin\Wordpress\WP_Express\Setting;
use Sujin\Wordpress\WP_Express\Admin;

if ( ! defined( 'ABSPATH' ) ) {
	header( 'Status: 404 Not Found' );
	header( 'HTTP/1.1 404 Not Found' );
	exit();
}

abstract class Abs_Setting_Element extends Abs_Base_Element {
	private $_setting;

	public function __construct( string $name, array $attrs = array() ) {
		parent::__construct( $name, $attrs );
		add_action( 'admin_init', array( $this, '_add_settings_field' ) );
	}

	public function _add_settings_field() {
		if ( empty( $this->_setting ) || empty( $this->_setting->admin_page() ) ) {
			return;
		}

		$parent_id =
			( $this->_setting->admin_page() instanceof Admin )
			? $this->_setting->admin_page()->get_id()
			: $this->_setting->admin_page();

		add_settings_field(
			$this->get_id(),
			$this->get_name(),
			array( $this, '_render' ),
			$parent_id,
			$this->_setting->get_id()
		);

		register_setting( $parent_id, $this->get_id() );
	}

	public function attach_to( Setting $setting ) {
		$this->_setting           = $setting;
		$this->_options['legend'] = $setting->get_name();
	}

	protected function _refresh_attributes( ?int $_ = null ) {
		if ( empty( $this->_attributes['value'] ) ) {
			$this->_attributes['value'] = get_option( $this->get_id() );
		}
	}

	protected function _render_wrapper_open() {}

	protected function _render_wrapper_close() {}
}
