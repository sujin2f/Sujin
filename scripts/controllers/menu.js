/**
 * Header Controller
 *
 * @project Sujin
 * @since   7.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
*/

// angular.module( 'Sujin', [ 'djds4rce.angular-socialshare' ] )
ngSujin
	.controller( 'MenuController', function( $scope, MenuInfo ) {
		var scope = $scope;

		// Global Variable
		scope.GLOBALS = GLOBALS;

		// Get Menu
		scope.getMenu = function() {
			return MenuInfo;
		}

		scope.getHeaderStyle = function() {

			if ( !GLOBALS.mobile && GLOBALS.headerBackground )
				return 'background-image: url("' + GLOBALS.headerBackground + '")';
		}
	});
