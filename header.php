<!DOCTYPE html>
<html <?php language_attributes(); ?>>
	<head>
		<meta charset="<?php bloginfo( 'charset' ); ?>" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<link rel="profile" href="http://gmpg.org/xfn/11" />
		<base href="/" />

		<link rel="icon" type="image/png" href="<? echo get_stylesheet_directory_uri() ?>/assets/images/favicon-32x32.png" sizes="32x32" />
		<link rel="icon" type="image/png" href="<? echo get_stylesheet_directory_uri() ?>/assets/images/favicon-32x32.png" sizes="16x16" />
		<link rel="shortcut icon" type="image/png" href="<? echo get_stylesheet_directory_uri() ?>/assets/images/favicon.png" />

		<?php wp_head(); ?>
	</head>

	<body class="<?php echo implode( ' ', get_body_class() ) ?>">
