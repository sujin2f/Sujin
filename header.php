<?php
use Sujin\Wordpress\WP_Express\Fields\Post_Meta\Attachment as Meta_Attachment;
use Sujin\Wordpress\WP_Express\Fields\Term_Meta\Attachment as Term_Meta_Attachment;

global $wp;

$title       = get_bloginfo( 'name' );
$description = '';
$url         = home_url( $wp->request );
$image       = get_stylesheet_directory_uri() . '/assets/images/open-graph.png';

if ( is_home() ) {
	$title      .= ' | Wordpress Full Stack Developer';
	$description = get_bloginfo( 'description' );
} else if ( is_single() ) {
	$title      .= ' | ' . get_the_title();
	$description = get_the_excerpt();
	$image       = get_the_post_thumbnail_url() ?: $image;
	$image       = Meta_Attachment::get_instance( 'List' )->get() ?: $image;
} else if ( is_archive() ) {
	$title      .= ' | ' . single_term_title( '', false );
	$description = get_the_archive_description();
	$image       = Term_Meta_Attachment::get_instance( 'Thumbnail' )->get() ?: $image;
} else if ( is_search() ) {
	$title .= ' | Search Results: ' . get_query_var( 's' );
} else if ( is_404() ) {
	$title .= ' | Not Found';
}
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
	<head>
		<meta charset="<?php bloginfo( 'charset' ); ?>" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<link rel="profile" href="http://gmpg.org/xfn/11" />
		<base href="/" />

		<link rel="icon" type="image/png" href="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/favicon-32x32.png" sizes="32x32" />
		<link rel="icon" type="image/png" href="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/favicon-32x32.png" sizes="16x16" />
		<link rel="shortcut icon" type="image/png" href="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/favicon.png" />

		<meta property="og:type" content="website" />
		<meta property="og:site_name" content="Sujin" />
		<meta property="article:author" content="Sujin" />

		<meta name="twitter:creator" content="@sujin2f" />

		<?php wp_head(); ?>

		<title><?php echo esc_html( $title ); ?></title>
		<meta name="description" content="<?php echo esc_html( $description ); ?>" />

		<meta property="og:url" content="<?php echo esc_url( $url ); ?>" />
		<meta property="og:title" content="<?php echo esc_html( $title ); ?>" />
		<meta property="og:description" content="<?php echo esc_html( $description ); ?>" />
		<meta property="og:image" content="<?php echo esc_url( $image ); ?>" />

		<meta name="twitter:url" content="<?php echo esc_url( $url ); ?>" />
		<meta name="twitter:title" content="<?php echo esc_html( $title ); ?>" />
		<meta name="twitter:description" content="<?php echo esc_html( $description ); ?>" />
		<meta name="twitter:image" content="<?php echo esc_url( $image ); ?>" />
	</head>

	<body class="<?php echo implode( ' ', get_body_class() ); ?>">
