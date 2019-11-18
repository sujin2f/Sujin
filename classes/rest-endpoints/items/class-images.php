<?php
/**
 * Post Item
 *
 * @project Sujinc.com
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
*/

namespace Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Items;

final class Images extends Abstract_Rest_Item_Base {
	public $large;
	public $medium;
	public $small;
	public $tiny;

	/**
	 * Create MenuItem from WP_Post
	*/
	public function __construct( int $image_id ) {
		$this->large  = wp_get_attachment_image_src( $image_id, 'large' )[0] ?? '';
		$this->medium = wp_get_attachment_image_src( $image_id, 'medium' )[0] ?? '';
		$this->small  = wp_get_attachment_image_src( $image_id, 'thumbnail' )[0] ?? '';
		$this->tiny   = wp_get_attachment_image_src( $image_id, 'recent-post' )[0] ?? '';
	}
}
