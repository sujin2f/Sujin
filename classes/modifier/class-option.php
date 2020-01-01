<?php
/**
 * Option Modifier
 *
 * @project Sujin
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin\Modifier;

use Sujin\Wordpress\WP_Express\Helpers\Trait_Singleton;

use Sujin\Wordpress\WP_Express\Settings_Section;
use Sujin\Wordpress\WP_Express\Fields\Settings\{
	Input,
	Attachment,
	Checkbox,
};

class Option {
	use Trait_Singleton;

	function __construct() {
		Settings_Section::get_instance( 'Theme Options' )
			->append( Input::get_instance( 'Flicker ID' ) )
			->append( Attachment::get_instance( 'Open Graph (Default Image)' ) )
			->append( Checkbox::get_instance( 'Hide Header in Front Page' ) )
			->append( Checkbox::get_instance( 'Hide Footer in Front Page' ) );
	}
}
