<?php
/**
 * Post Item
 *
 * @project Sujinc.com
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
*/

namespace Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Items;

use WP_Post;

final class Post extends Abstract_Rest_Item_Base {
	public $id;
	public $slug;
	public $date;
	public $link;
	public $title;
	public $content;
	public $excerpt;
	public $comment_status;
	public $meta       = array();
	public $tags       = array();
	public $series     = array();
	public $thumbnail  = array();
	public $prevnext   = array();
	public $related    = array();
	public $type;

	/**
	 * Create MenuItem from WP_Post
	*/
	public function __construct( WP_Post $post ) {
		$this_keys = array_keys( get_object_vars( $this ) );

		foreach ( $this_keys as $key ) {
			if ( property_exists( $post, $key ) ) {
				$this->$key = $post->$key;
			}
		}
	}
}
