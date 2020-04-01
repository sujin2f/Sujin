<?php
/**
 * Flickr Widget
 *
 * @project Sujin
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin\Widgets;

use WP_Widget;
use Sujin\Wordpress\WP_Express\Helpers\Trait_Singleton;
use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Items\Simple_Post;

class Recent_Post extends WP_Widget {
	use Trait_Singleton;

	protected function __construct() {
		parent::__construct(
			'recent-post',  // Base ID
			'Recent Post'   // Name
		);
	}

	public function widget( $_, $__ ) {}

	public function form( $_ ) {}

	public function update( $_, $__ ) {}
}
