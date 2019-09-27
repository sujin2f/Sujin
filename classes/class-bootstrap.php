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
		Theme_Supports::get_instance();
		REST_API::get_instance();
		Theme_Customizer::get_instance();
		Custom_Fields::get_instance();
		Post_Series::get_instance();
		Assets::get_instance();

		Shortcode\About_Item::get_instance();
	}
}
