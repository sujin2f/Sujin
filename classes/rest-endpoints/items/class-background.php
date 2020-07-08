<?php
/**
 * Background RESTful API Item
 *
 * @package sujinc.com
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Items;

use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Items;
use WP_Post;

/**
 * Background RESTful API Item
 */
class Background extends Items {
	/**
	 * Title
	 *
	 * @var string
	 */
	public $title;

	/**
	 * Desktop image
	 *
	 * @var string
	 */
	public $desktop;

	/**
	 * Mobile image
	 *
	 * @var string
	 */
	public $mobile;

	/**
	 * Constructor
	 *
	 * @param      string   $name       Name of the instance.
	 * @param      ?WP_Post $attachment Attachment object to create Background.
	 * @visibility protected
	 */
	protected function __construct( string $name, ?WP_Post $attachment = null ) {
		parent::__construct( $name );

		if ( ! $attachment ) {
			return;
		}

		$this->title   = $attachment->post_title;
		$this->desktop = wp_get_attachment_image_src( $attachment->ID, 'large' )[0];
		$this->mobile  = wp_get_attachment_image_src( $attachment->ID, 'medium_large' )[0];
	}
}
