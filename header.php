<!DOCTYPE html>
<html <?php language_attributes(); ?>>
	<head>
		<meta charset="<?php bloginfo( 'charset' ); ?>" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<link rel="profile" href="http://gmpg.org/xfn/11" />
		<base href="/" />

		<?php wp_head(); ?>
	</head>

	<body class="<?php echo implode( ' ', get_body_class() ) ?>">
