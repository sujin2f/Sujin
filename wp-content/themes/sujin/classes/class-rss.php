<?php
/**
 * Class : Rest API
 *
 * @project Sujin
 * @since   8.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin;

class RSS {
  use Helpers\Singleton;

	function __construct() {
		add_filter( 'get_bloginfo_rss',   array( $this, 'get_bloginfo_rss' ), 15, 2 );
		add_filter( 'the_permalink_rss',  array( $this, 'the_guid' ), 15 );
		add_filter( 'comments_link_feed', array( $this, 'the_guid' ), 15 );
		add_filter( 'the_guid',           array( $this, 'the_guid' ), 15 );
 	}

	function get_bloginfo_rss( $info, $show ) {
		if ( 'url' === $show )
			$info = convert_chars( 'http://www.sujinc.com/' );

		return $info;
	}

	function the_guid( $permalink ) {
		$permalink = str_replace( 'http://www.sujinc.com:7777/', 'http://www.sujinc.com/', $permalink );
		$permalink = str_replace( 'http://sujinc.test/', 'http://www.sujinc.com/', $permalink );
		return $permalink;
	}
}
