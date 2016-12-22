/**
 * Body Controller
 *
 * @project Sujin
 * @since   7.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
*/

// angular.module( 'Sujin', [ 'djds4rce.angular-socialshare' ] )
ngSujin.controller( 'BodyController', function( $scope, $routeParams, $anchorScroll, $window ) {
	var scope = $scope;

	scope.bodyClass = function() {
		// Home
		if ( $window.location.pathname == '/' )
			return 'ng-home full-background without-footer';

		if ( $routeParams.page_name )
			return 'full-background';
	}

	scope.backToTop = function() {
		$anchorScroll();
	}
});
