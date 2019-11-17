<?php
/**
 * Post Item
 *
 * @project Sujinc.com
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
*/

namespace Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Items;

use WP_Term;

final class Tag extends Abstract_Rest_Item_Base {
	public $name;
	public $slug;
	public $termId;

	/**
	 * Create MenuItem from WP_Post
	*/
	public function __construct( WP_Term $term ) {
		$this->name   = $term->name;
		$this->slug   = $term->slug;
		$this->termId = $term->termId;
	}
}
