<?php
/**
 * Gallery Post Type
 *
 * @package sujinc.com
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin\Modifier\Post_Type;

use Sujin\Wordpress\WP_Express\Helpers\Trait_Singleton;
use Sujin\Wordpress\WP_Express\Meta_Box;
use Sujin\Wordpress\WP_Express\Post_Type;
use Sujin\Wordpress\WP_Express\Fields\Post_Meta\Attachment;

/**
 * Gallery Post Type
 *
 * @codeCoverageIgnore
 */
class Gallery {
	use Trait_Singleton;

	/**
	 * Constructor
	 * - Post type registration with title and excerpt
	 * - Multiple attachments metabox
	 *
	 * @visibility protected
	 */
	protected function __construct() {
		$gallery = Post_Type::get_instance( 'Gallery' )
			->supports( array( 'title', 'excerpt' ) );

		$attachment = Attachment::get_instance( 'Photos' )
			->single( false );

		Meta_Box::get_instance( 'Gallery' )
			->append_to( $gallery )
			->append( $attachment );
	}
}
