<?php
/**
 * Archive RESTful API Item
 * Class for archive -- category, tag, and search
 *
 * @package sujinc.com
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Items;

use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Items;

// phpcs:disable WordPress.NamingConventions.ValidVariableName
/**
 * Archive RESTful API Item
 * Class for archive -- category, tag, and search
 */
class Archive extends Items {
	/**
	 * Archive name
	 *
	 * @var string
	 */
	public $title = '';

	/**
	 * Archive description
	 *
	 * @var string
	 */
	public $description = '';

	/**
	 * Archive represent thumbnail
	 *
	 * @var string
	 */
	public $thumbnail;

	/**
	 * Total number of posts
	 *
	 * @var int
	 */
	public $total;

	/**
	 * Total number of pages
	 *
	 * @var int
	 */
	public $totalPages;

	/**
	 * Posts
	 *
	 * @var Post[]
	 */
	public $items = array();

	/**
	 * Attach post to items
	 *
	 * @param Post $post Post to attach.
	 */
	public function append_item( Post $post ): void {
		$this->items[] = $post;
	}

	/**
	 * Set thumbnail
	 *
	 * @param int $thumbnail_id Create and set thumbnail from this thumbnail id.
	 * @uses  Images
	 */
	public function set_thumbnail( int $thumbnail_id ): void {
		$this->thumbnail = new Images( $thumbnail_id );
	}
}
// phpcs:enable WordPress.NamingConventions.ValidVariableName
