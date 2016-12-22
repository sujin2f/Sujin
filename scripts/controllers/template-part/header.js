/**
 * Header Controller
 *
 * @project Sujin
 * @since   7.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
*/

// angular.module( 'Sujin', [ 'djds4rce.angular-socialshare' ] )
ngSujin.controller( 'MenuController', function( $scope, MenuInfo, $location, $routeParams ) {
	var scope = $scope;

	// Global Variable
	scope.GLOBALS       = GLOBALS;
	scope.mobile_opend  = false;
	scope.search_string = '';

	// Get Menu
	scope.getMenu = function() {
		MenuInfo.forEach( function( menu, i ) {
			MenuInfo[i].current = false;

			if ( eval( menu.current_cond ) )
				MenuInfo[i].current = true;
		});

		return MenuInfo;
	}

	scope.getHeaderStyle = function() {
		if ( !GLOBALS.mobile && GLOBALS.headerBackground )
			return 'background-image: url("' + GLOBALS.headerBackground + '")';
	}

	scope.toggleMobileOpend = function() {
		scope.mobile_opend = !scope.mobile_opend;
	};

	scope.getMobileOpend = function() {
		return scope.mobile_opend;
	};

	scope.$on( '$routeChangeStart', function( next, current ) {
		scope.mobile_opend = false;
	});

	scope.search = function() {
		if( scope.search_string ) {
			$location.path( '/search/' + scope.search_string );
		}
	}
});
