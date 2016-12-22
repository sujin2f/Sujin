<?php
/**
 * Class : Agent Mode
 *
 * @project Sujin
 * @since   7.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin;

if ( !defined( "ABSPATH" ) ) {
	header( "Status: 404 Not Found" );
	header( "HTTP/1.1 404 Not Found" );
	exit();
}

class AgentMode {
	public function trigger_agent_mode() {
		add_action( 'wp', array( $this, 'print_agent_mode' ) );
		return;
	}

	public function print_agent_mode() {
		global $post;

		$title       = get_bloginfo( 'name' );
		$keyword     = 'Wordpress, OSX, Design, Photographer, Developer';
		$description = 'Wordpress & OSX Developer / Designer / Photographer';
		$img_src     = get_stylesheet_directory_uri() . '/assets/images/opengraph_image.jpg';

		if ( is_category() ) {
			$title = sprintf( 'Category Archive for %s | %s ', single_cat_title(), get_bloginfo( 'name' ) );
		} elseif ( is_tag() ) {
			$title = sprintf( 'Tag Archive for %s | %s ', single_tag_title(), get_bloginfo( 'name' ) );
		} elseif ( is_archive() ) {
			$title = sprintf( 'Archive | %s ', get_bloginfo( 'name' ) );
		} elseif ( is_search() ) {
			$title = sprintf( 'Tag Archive for %s | %s ', esc_html( $s ), get_bloginfo( 'name' ) );
		} elseif ( is_home() || is_front_page() && get_bloginfo( 'name' ) == false ) {
			$title = sprintf( '%s | %s ', get_bloginfo( 'name' ), get_bloginfo( 'description' ) );
		} elseif ( is_404() ) {
			$title = sprintf( 'Error 404 Not Found | %s ', get_bloginfo( 'name' ) );
		} elseif ( is_single() ) {
			$title = sprintf( '%s | %s ', get_the_title(), get_bloginfo( 'name' ) );

			$tags = get_tags();
			$tags_array = array();

			foreach( $tags as $tag )
				$tags_array[] = $tag->name;

			$keyword = implode( ',', $tags_array );

			$description = $post->post_excerpt;

			if ( has_post_thumbnail( $post->ID ) ) {
				$img_src = wp_get_attachment_image_src( get_post_thumbnail_id( $post->ID ), 'medium' );
				$img_src = $img_src[0];
			}
		}
		?>

<html <?php language_attributes(); ?>>
	<head>
		<title><?php echo $title ?></title>
		<meta charset="<?php bloginfo( 'charset' ); ?>" />

		<meta name="keywords" content="<?php echo $keyword ?>" />
		<meta name="description" content="<?php echo $description ?>" />

		<meta property="og:title" content="<?php echo $title ?>"/>
		<meta property="og:description" content="<?php echo $description ?>"/>
		<meta property="og:type" content="article"/>
		<meta property="og:url" content="<?php echo the_permalink(); ?>"/>
		<meta property="og:site_name" content="<?php echo get_bloginfo( 'name' ) ?>"/>
		<meta property="og:image" content="<?php echo $img_src ?>"/>
	</head>

	<body></body>
</html>

		<?php
		die;
	}
}
