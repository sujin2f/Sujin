<?php
/**
 * Image RESTful API Item
 *
 * @package sujinc.com
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Items;

/**
 * Image RESTful API Item
 */
class Images {
	/**
	 * Large size
	 *
	 * @var string
	 */
	public $large = '';

	/**
	 * Medium size
	 *
	 * @var string
	 */
	public $medium = '';

	/**
	 * Small size
	 *
	 * @var string
	 */
	public $small = '';

	/**
	 * Tiny size
	 *
	 * @var string
	 */
	public $tiny = '';

	const ITEM_NAME = 'image';

	/**
	 * Create Image from attachment id
	 *
	 * @param      int $attachment_id Attachment ID.
	 * @visibility protected
	 */
	public function __construct( int $attachment_id ) {
		if ( -1 === $attachment_id ) {
			return;
		}

		$this->large  = wp_get_attachment_image_src( $attachment_id, 'large' )[0] ?? '';
		$this->medium = wp_get_attachment_image_src( $attachment_id, 'medium' )[0] ?? '';
		$this->small  = wp_get_attachment_image_src( $attachment_id, 'thumbnail' )[0] ?? '';
		$this->tiny   = wp_get_attachment_image_src( $attachment_id, 'recent-post' )[0] ?? '';
	}
}
