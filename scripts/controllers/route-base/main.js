/**
 * Main Controller
 *
 * @project Sujin
 * @since   7.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
*/

// angular.module( 'Sujin', [ 'djds4rce.angular-socialshare' ] )
ngSujin
	.controller( 'mainController', function( $scope ) {
		var scope = $scope;
		GLOBALS.headerBackground = '';

		scope.getBackground = function() {
			var mobile = '';
			if ( GLOBALS.mobile ) {
				mobile = '.mobile'
			}
			var rand = Math.floor( (Math.random() * 4 ) + 1 );

			return GLOBALS.themeURL + '/assets/images/main/backgrounds/' + rand + mobile + '.jpg';
		}
	});
