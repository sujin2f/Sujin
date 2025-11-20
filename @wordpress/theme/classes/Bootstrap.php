<?php
/**
 * Entry Point
 *
 * @package sujinc.com
 * @since   8.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Theme;
use Sujin\Theme\RestAPI;

/**
 * Entry Point
 */
class Bootstrap {
	/**
	 * Constructor
	 *
	 * @visibility public
	 */
	public function __construct() {
		new RestAPI();
		add_action( 'after_setup_theme', array( $this, 'check_plugin_dependency' ) );
	}

	/**
	 * Dependency checking
	 * The theme requires ACF
	 *
	 * @visibility public
	 */
	public function check_plugin_dependency() {
		if ( ! is_plugin_active( 'advanced-custom-fields' ) ) {
			// Display an admin notice if the required plugin is not active.
			add_action( 'admin_notices', array( $this, 'missing_plugin_dependency_acf' ) );
		}
	}

	/**
	 * Dependency checking
	 * The theme requires ACF
	 *
	 * @visibility public
	 */
	public function missing_plugin_dependency_acf() {
		?>
		<div class="notice notice-error is-dismissible">
			<p>Your theme requires the "My Required Plugin" to function correctly. Please install and activate it.</p>
		</div>
		<?php
	}
}
