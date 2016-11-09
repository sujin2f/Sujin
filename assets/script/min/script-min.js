/**
 * Angular App
 *
 * @project Sujin
 * @since   7.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

angular.module( 'SujinMk7', [ 'ngRoute' ] );


/**
 * Angular App
 *
 * @project Sujin
 * @since   7.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

angular.module( 'SujinMk7', [ 'ngRoute' ] );

angular.module( 'SujinMk7', [ 'ngRoute' ] )
	.config( function( $routeProvider, $locationProvider ) {
		$routeProvider
			.when("/", {
				templateUrl : variables.viewBase + 'main.html',
			});
/*
		.when("/red", {
		templateUrl : "red.htm"
		})
		.when("/green", {
		templateUrl : "green.htm"
		})
		.when("/blue", {
		templateUrl : "blue.htm"
		});
*/

 		$locationProvider.html5Mode( true );
	});



/**
 * Header Controller
 *
 * @project Sujin
 * @since   7.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
*/

angular.module( 'SujinMk7' )
	.controller( 'Header', function( $scope ) {
		$scope.vars = {
			logo    : variables.logo,
			homeUrl : variables.homeUrl,
			menu    : variables.menu,
			viewBase: variables.viewBase,

			hover   : '',
		};

		$scope.Hover = function( id ) {
			$scope.vars.hover = id;
		}

		$scope.Leave = function( id ) {
			$scope.vars.hover = '';
		}
	});


