<?php
/**
 * Theme Options
 *
 * @package sujinc.com
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

/**
 * Theme Options
 *
 * @codeCoverageIgnore
 */
class Options {
	use Trait_Singleton;

	/**
	 * Constructor
	 * - Facebook OG
	 * - Frontpage header and footer visibility
	 *
	 * @visibility protected
	 */
	protected function __construct() {
		Settings_Section::get_instance( 'Facebook Open Graph' )
			->append( Attachment::get_instance( 'Default Image' ) )
			->append( Input::get_instance( 'App ID' ) );

		Settings_Section::get_instance( 'Theme Options' )
			->append( Checkbox::get_instance( 'Hide Header in Front Page' ) )
			->append( Checkbox::get_instance( 'Hide Footer in Front Page' ) );
	}
}
