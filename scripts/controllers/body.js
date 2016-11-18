/**
 * Body Controller
 *
 * @project Sujin
 * @since   7.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
*/

// angular.module( 'Sujin', [ 'djds4rce.angular-socialshare' ] )
ngSujin
	.controller( 'BodyController', function( $scope, $routeParams, $anchorScroll ) {
		var scope = $scope;

		scope.bodyClass = function() {
			// Home
			if ( Object.keys( $routeParams ).length == 0 )
				return 'ng-home full-background';
		}

		scope.backToTop = function() {
			$anchorScroll();
		}
	});
