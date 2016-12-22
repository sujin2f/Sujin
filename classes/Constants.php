<?php
/**
 * project	Sujin MK 7
 * version	7.0.0
 * Author: Sujin 수진 Choi
 * Author URI: http://www.sujinc.com/
 */

namespace Sujin;

class Constants {
	const PostThumbnailWidth  = 370;
	const PostThumbnailHeight = 200;

	const RelatedpostWidth  = 200;
	const RelatedpostHeight = 110;

	const RecentPostWidth  = 80;
	const RecentPostHeight = 80;



	const PortfolioWidth  = 870;
	const PortfolioHeight = 240;

	const SlideWidth  = 1170;
	const SlideHeight = 430;

	const LatestWorkWidth  = 1170;
	const LatestWorkHeight = 430;

    public static function HomeURL() {
	    return esc_url( home_url() );
    }

    public static function ThemeURL() {
	    return get_stylesheet_directory_uri();
    }

    public static function ViewURL() {
	    return self::ThemeURL() . '/views';
    }

    public static function DefaultImageID( $size = 'full' ) {
		if ( $default_image = get_theme_mod( 'sujin_default_image' ) ) {
			$id    = attachment_url_to_postid( $default_image );

			return $id;
		}

		return false;
	}

    public static function DefaultImageURL( $size = 'full' ) {
		if ( $id = self::DefaultImageID( $size ) ) {
			$thumb = wp_get_attachment_image_src( $id, $size );
			return $thumb[0];

		}

		return false;
	}
}
