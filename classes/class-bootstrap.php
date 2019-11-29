<?php
/**
 * Class : Rest API
 *
 * @project Sujin
 * @since   8.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin;

class Bootstrap {
	use Helpers\Singleton;

	function __construct() {
		$this->init_classes();
	}

	private function init_classes() {
		Theme_Supports::get_instance();
		Rest_Api::get_instance();
		Theme_Customizer::get_instance();
		Custom_Fields::get_instance();
		Post_Series::get_instance();
		Assets::get_instance();
		Shortcode\About_Item::get_instance();
	}
}
