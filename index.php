<?php
/**
 * Index
 *
 * @project Sujin
 * @since   7.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

if ( !defined( "ABSPATH" ) ) {
	header( "Status: 404 Not Found" );
	header( "HTTP/1.1 404 Not Found" );
	exit();
}

?><!DOCTYPE html>
<html <?php language_attributes(); ?> ng-app="Sujin">
	<head
		ng-controller = "HeadController"
	>
		<title>Sujin <?php // $Sujin->Template->HeaderTitle(); ?></title>

		<meta charset="<?php bloginfo( 'charset' ); ?>" />
		<meta name="keywords" content="<?php // echo $Sujin->AdminPages->GeneralPage->value[ 'keywords' ] ?>" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">

		<link rel="profile" href="http://gmpg.org/xfn/11" />

		<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>" />
		<link rel="alternate" type="application/rss+xml" title="<?php bloginfo( 'name' ); ?>" href="<?php bloginfo( 'rss2_url' ); ?>" />
		<link rel="alternate" type="application/atom+xml" title="<?php bloginfo( 'name' ); ?>" href="<?php bloginfo( 'atom_url' ); ?>" />

		<!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
		<!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
		<!--[if lt IE 9]>
		<script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
		<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
		<![endif]-->

		<script src="http://platform.twitter.com/widgets.js"></script>

		<base href="/" />

		<?php wp_head(); ?>
	</head>

	<body
		ng-controller = "BodyController"
		ng-class      = "bodyClass()"
		scroll
	>
		<header
			id            = "main_header"
			ng-controller = "MenuController"
			ng-include    = "'<?php echo Sujin\Constants::ViewURL(); ?>/layout/menu.html'"
		></header>

		<main ng-view ng-class="getContainerClass()"></main>

		<footer
			id            = "main_footer"
			ng-controller = "FooterController"
			ng-include    = "'<?php echo Sujin\Constants::ViewURL(); ?>/layout/footer.html'"
		></footer>

		<div id="back2top">
			<a href="" ng-click="backToTop()">Back to Top</a>
		</div>

		<?php wp_footer(); ?>
	</body>
</html>

