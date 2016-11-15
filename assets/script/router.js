/**
 * Angular App
 *
 * @project Sujin
 * @since   7.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

angular.module( 'Sujin', [ 'ngRoute' ] )
	.config( function( $routeProvider, $locationProvider ) {
		$routeProvider
			.when("/", {
				templateUrl : variables.viewBase + 'main.html',
				controller  : 'mainController',
			})
			.when( "/list/:post_type/:page?", {
				templateUrl : variables.viewBase + 'list.html',
				controller  : 'listController',
			})
			.when( "/:year/:month/:day/:post_name", {
				templateUrl : variables.viewBase + 'post.html',
				controller  : 'postController',
			})
			.when( "/:page_name", {
				templateUrl : variables.viewBase + 'page.html',
				controller  : 'pageController',
			})

			$locationProvider.html5Mode( true );
	});