<?php
/**
 * Background Item
 *
 * @project Sujinc.com
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
*/

namespace Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Items;

use WP_Post;

final class Background extends Abstract_Rest_Item_Base {
	public $title;
	public $desktop;
	public $mobile;

	/**
	 * Create MenuItem from WP_Post
	*/
	public function __construct( WP_Post $post ) {
		$this->title   = $post->post_title;
		$this->desktop = wp_get_attachment_image_src( $post->ID, 'large' )[0];
		$this->mobile  = wp_get_attachment_image_src( $post->ID, 'medium_large' )[0];
	}
}
