/**
 * Angular App
 *
 * @project Sujin
 * @since   7.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

angular.module( 'Sujin', [ 'ngRoute', 'ngSanitize' ] );


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

/**
 * HTML Filter
 *
 * @project Sujin
 * @since   7.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
*/

angular.module('Sujin')
    .filter('html', ['$sce', function($sce){
        return function(text) {
            return $sce.trustAsHtml(text);
        };
    }]);

/**
 * Data
 *
 * @project Sujin
 * @since   7.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
*/

angular.module( 'Sujin' )
	.service( 'DataService', function() {
		var data = {
			logo    : variables.logo,
			homeUrl : variables.homeUrl,
			menu    : variables.menu,
			viewBase: variables.viewBase,
		};
		return data;
	});




/**
 * Body Controller
 *
 * @project Sujin
 * @since   7.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
*/

angular.module( 'Sujin' )
	.controller( 'BodyController', function( $scope, $routeParams ) {
		$scope.bodyClass = function() {
			// Home
			if ( Object.keys( $routeParams ).length == 0 )
				return 'ng-home full-background';
		}
	});


/**
 * Header Controller
 *
 * @project Sujin
 * @since   7.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
*/

angular.module( 'Sujin' )
	.controller( 'Header', function( $scope, DataService ) {
		$scope.vars = {
			logo    : DataService.logo,
			homeUrl : DataService.homeUrl,
			menu    : DataService.menu,
			viewBase: DataService.viewBase,

			hover   : '',
		};

		$scope.Hover = function( id ) {
			$scope.vars.hover = id;
		}

		$scope.Leave = function( id ) {
			$scope.vars.hover = '';
		}
	});


/**
 * Main Controller
 *
 * @project Sujin
 * @since   7.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
*/

angular.module( 'Sujin' )
	.controller( 'mainController', function( $scope ) {
	});


/**
 * Main Controller
 *
 * @project Sujin
 * @since   7.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
*/

angular.module( 'Sujin' )
	.controller( 'pageController', function( $scope, $http, DataService, $routeParams ) {
		// Load Page Data
		$scope.postData = [];

		$scope.loadPage = function() {
			var restUrl = DataService.homeUrl + 'wp-json/wp/v2/pages?filter[name]=' + $routeParams.page_name;

			$http.get( restUrl )
				.then(
					function( response ) {
						$scope.postData = response.data[0];
					},
					function( response ) {
					}
				);
		}
		$scope.loadPage();
	});


/**
 * Main Controller
 *
 * @project Sujin
 * @since   7.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
*/

angular.module( 'Sujin' )
	.controller( 'postController', function( $scope, $http, DataService, $routeParams ) {
		// Load Page Data
		$scope.postData = [];

		$scope.loadPage = function() {
			var restUrl = DataService.homeUrl + 'wp-json/wp/v2/posts?filter[name]=' + $routeParams.post_name;

			$http.get( restUrl )
				.then(
					function( response ) {
						$scope.postData = response.data[0];
console.log($scope.postData);
					},
					function( response ) {
					}
				);
		}
		$scope.loadPage();
	});


/**
 * Main Controller
 *
 * @project Sujin
 * @since   7.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
*/

angular.module( 'Sujin' )
	.controller( 'listController', function( $scope, $http, DataService, $routeParams ) {
		// Load Page Data
		$scope.postData = [];

		$scope.loadPage = function() {
			var restUrl = DataService.homeUrl + 'wp-json/wp/v2/' + $routeParams.post_type;

			$http.get( restUrl )
				.then(
					function( response ) {
						$scope.postData = response.data;

console.log( $scope.postData );
					},
					function( response ) {
					}
				);
		}
		$scope.loadPage();
	});


