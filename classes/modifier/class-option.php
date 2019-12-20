<?php
/**
 * Option Modifier
 *
 * @project Sujin
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin\Modifier;

use Sujin\Wordpress\Theme\Sujin\Helpers\Singleton;

use Sujin\Wordpress\WP_Express\Setting;
use Sujin\Wordpress\WP_Express\Fields\Settings\{
	Input,
	Attachment,
	Checkbox,
};

class Option {
	use Singleton;

	function __construct() {
		Setting::get_instance( 'Theme Options' )
			->add( Input::get_instance( 'Flicker ID' ) )
			->add( Attachment::get_instance( 'Open Graph (Default Image)' ) )
			->add( Checkbox::get_instance( 'Hide Header in Front Page' ) )
			->add( Checkbox::get_instance( 'Hide Footer in Front Page' ) );
	}
}
