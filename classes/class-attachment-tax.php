<?php
/**
 * Class : Theme_Supports API
 *
 * @project Sujin
 * @since   8.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin;

class Attachment_Tax {
	use Helpers\Singleton;


	function __construct() {
		add_action( 'init',  array( $this, 'attachment_taxonomies' ) );
	}

	public function attachment_taxonomies() {
		register_taxonomy_for_object_type( 'category', 'attachment' ); // add to post type attachment
	}
}
