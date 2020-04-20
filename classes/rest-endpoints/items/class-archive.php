<?php
/**
	* Post Item
	*
	* @project Sujinc.com
	* @since   9.0.0
	* @author  Sujin 수진 Choi http://www.sujinc.com/
*/

namespace Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Items;

use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Items;

// phpcs:disable WordPress.NamingConventions.ValidVariableName.MemberNotSnakeCase
// phpcs:disable WordPress.NamingConventions.ValidVariableName.NotSnakeCaseMemberVar
final class Archive extends Items {
	public $title       = "";
	public $description = "";
	public $thumbnail;
	public $total;
	public $totalPages;
	public $items = array();

	public function append_item( Post $post ) {
		$this->items[] = $post;
	}

	public function set_thumbnail( int $thumbnail_id ) {
		$this->thumbnail = new Images( $thumbnail_id );
	}
}
// phpcs:enable
