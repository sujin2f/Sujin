<?php
/**
 * Post Item
 *
 * @project Sujinc.com
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
*/

namespace Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Items;

// phpcs:disable WordPress.NamingConventions.ValidVariableName.MemberNotSnakeCase
// phpcs:disable WordPress.NamingConventions.ValidVariableName.NotSnakeCaseMemberVar
final class Archive extends Abstract_Rest_Item_Base {
	public $name;
	public $description;
	public $thumbnail;
	public $total;
	public $totalPages;
	public $items = array();

	public function append_item( Post $post ) {
		$this->items[] = $post;
	}

	public function set_thumbnail( ?int $thumbnail_id ) {
		$this->thumbnail = $thumbnail_id ? new Images( $thumbnail_id ) : null;
	}
}
// phpcs:enable
