/**
 * Main Controller
 *
 * @project Sujin
 * @since   7.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
*/

// angular.module( 'Sujin', [ 'djds4rce.angular-socialshare' ] )
ngSujin.controller( 'mainController', function( $scope ) {
	var scope = $scope;
	GLOBALS.headerBackground = '';

	GLOBALS.title       = 'WP Developer';
	GLOBALS.description = 'Wordpress & OSX Developer / Designer / Photographer';
	GLOBALS.tags        = 'Wordpress, OSX, Design, Photographer, Developer';

	scope.getBackground = function() {
		if ( GLOBALS.mainBackground )
			return GLOBALS.mainBackground;

		var mobile = '';
		if ( GLOBALS.mobile ) {
			mobile = '.mobile'
		}

		var rand = Math.floor( (Math.random() * 4 ) + 1 );
		GLOBALS.mainBackground = GLOBALS.themeURL + '/assets/images/main/backgrounds/' + rand + mobile + '.jpg';

		return GLOBALS.mainBackground;
	}
});
