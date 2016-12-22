/**
 * Angular App
 *
 * @project Sujin
 * @since   7.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

// angular.module( 'Sujin', [ 'djds4rce.angular-socialshare' ] )
ngSujin.config( function( $routeProvider, $locationProvider ) {
	$routeProvider
		.when("/", {
			templateUrl : GLOBALS.viewBase + '/route-base/main.html',
			controller  : 'mainController',
		})
		/*
		 * Category
		 */
			.when( "/category/:category_name/page/:paged", {
				templateUrl : GLOBALS.viewBase + '/route-base/list.html',
				controller  : 'listController',
			})
			.when( "/category/:category_name/", {
				templateUrl : GLOBALS.viewBase + '/route-base/list.html',
				controller  : 'listController',
			})
		/*
		 * Tag
		 */
			.when( "/tags/:tag_name/page/:paged", {
				templateUrl : GLOBALS.viewBase + '/route-base/list.html',
				controller  : 'listController',
			})
			// Tags
			.when( "/tags/:tag_name/", {
				templateUrl : GLOBALS.viewBase + '/route-base/list.html',
				controller  : 'listController',
			})
		/*
		 * Search
		 */
			.when( "/search/:search_string/page/:paged", {
				templateUrl : GLOBALS.viewBase + '/route-base/list.html',
				controller  : 'listController',
			})
			// Search
			.when( "/search/:search_string/", {
				templateUrl : GLOBALS.viewBase + '/route-base/list.html',
				controller  : 'listController',
			})
		/*
		 * Single
		 */
		.when( "/:year/:month/:day/:post_name", {
			templateUrl : GLOBALS.viewBase + '/route-base/single.html',
			controller  : 'singleController',
		})
		/*
		 * Page
		 */
			.when( "/about", {
				templateUrl : GLOBALS.viewBase + '/pages/about.html',
				controller  : 'pageController',
			})
		.when( "/:page_name", {
			templateUrl : GLOBALS.viewBase + '/route-base/page.html',
			controller  : 'pageController',
		})

		/*
		 * Custom Post Type
		 */
		.when( "/:type_name/:post_name", {
			templateUrl : GLOBALS.viewBase + '/route-base/single.html',
			controller  : 'singleController',
		})

		$locationProvider.html5Mode( true ).hashPrefix('!');
});