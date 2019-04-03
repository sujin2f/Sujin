<?php
/**
 * Class : Rest API
 *
 * @project Sujin
 * @since   8.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin;

use Sujin\Wordpress\WP_Express\Admin;
use Sujin\Wordpress\WP_Express\Meta_Box;
use Sujin\Wordpress\WP_Express\Meta\Post_Meta;
use Sujin\Wordpress\WP_Express\Meta\Term_Meta;

class Custom_Fields {
	use Helpers\Singleton;

  	public $post_metas = array();
  	public $term_meta = array();

	function __construct() {
		$metabox = Meta_Box::get_instance( 'Images' )
			->set_post_type( 'post' )
			->set_post_type( 'page' );

		$this->post_metas[] = Post_Meta::get_instance( 'List' )
			->set_type( 'file' )
			->set_show_in_rest( true, 'full' )
			->set_metabox( $metabox );

		$this->post_metas[] = Post_Meta::get_instance( 'Icon' )
			->set_type( 'file' )
			->set_show_in_rest( true, 'full' )
			->set_metabox( $metabox );

		$this->post_metas[] = Post_Meta::get_instance( 'Title' )
			->set_type( 'file' )
			->set_show_in_rest( true, 'full' )
			->set_metabox( $metabox );

		$this->post_metas[] = Post_Meta::get_instance( 'Background' )
			->set_type( 'file' )
			->set_show_in_rest( true, 'full' )
			->set_metabox( $metabox );

		$this->post_metas[] = Post_Meta::get_instance( 'Use Background Color' )
			->set_type( 'checkbox' )
			->set_show_in_rest( true )
			->set_metabox( $metabox );

		$this->post_metas[] = Post_Meta::get_instance( 'Background Color' )
			->set_type( 'color' )
			->set_show_in_rest( true )
			->set_metabox( $metabox );

		$this->term_meta = Term_Meta::get_instance( 'Thumbnail' )
			->set_taxonomy( 'category' )
			->set_taxonomy( 'post_tag' )
			->set_type( 'file' );
	}
}
