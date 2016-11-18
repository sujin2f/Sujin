/**
 * Angular App
 *
 * @project Sujin
 * @since   7.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

// angular.module( 'Sujin', [ 'djds4rce.angular-socialshare' ] )
ngSujin
	.config( function( $routeProvider, $locationProvider ) {
		$routeProvider
			.when("/", {
				templateUrl : GLOBALS.viewBase + '/route-base/main.html',
				controller  : 'mainController',
			})
			// Single
			.when( "/:year/:month/:day/:post_name", {
				templateUrl : GLOBALS.viewBase + '/route-base/single.html',
				controller  : 'singleController',
			})

/*
			.when( "/list/:post_type/:page?", {
				templateUrl : variables.viewBase + 'list.html',
				controller  : 'listController',
			})
			.when( "/:page_name", {
				templateUrl : variables.viewBase + 'page.html',
				controller  : 'pageController',
			})
*/

			$locationProvider.html5Mode( true ).hashPrefix('!');
	});