<?php
/**
 * Admin Class
 *
 * @project WP-Express
 * @since   1.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\WP_Express;

use Sujin\Wordpress\WP_Express\Helpers\Multiton;

use WP_Customize_Control;

if ( !defined( "ABSPATH" ) ) {
	header( "Status: 404 Not Found" );
	header( "HTTP/1.1 404 Not Found" );
	exit();
}

class Theme_Customizer extends Base {
	use Multiton;

	private $section = 'Additional Settings';
	private $priority = 80;
	private $default = null;

	public function __construct( $name ) {
		$this->name = $name;
		$this->id   = sanitize_title( $this->name );

		add_action( 'customize_register', array( $this, 'customize_register' ) );
	}

	public function set_section( $section ) {
		$this->section = $section;
		return $this;
	}

	public function set_priority( $priority ) {
		$this->priority = $priority;
		return $this;
	}

	public function set_default( $default ) {
		$this->default = $default;
		return $this;
	}

	public function get_value() {
		return get_theme_mod( $this->id );
	}

	public function customize_register( $wp_customize ) {
		$section_id = sanitize_title( $this->section );

		if ( ! $wp_customize->get_section( $section_id ) ) {
			$wp_customize->add_section( $section_id , array(
				'title'    => $this->section,
				'priority' => $this->priority,
			));
		}

		$wp_customize->add_setting( $this->id , array(
			'default'   => $this->default,
			'transport' => 'refresh',
		));

		$wp_customize->add_control( new WP_Customize_Control( $wp_customize, $this->id, array(
			'label'    => $this->name,
			'section'  => $section_id,
			'settings' => $this->id,
		)));
	}
}
