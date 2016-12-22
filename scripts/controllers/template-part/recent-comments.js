/**
 * Recent Comments Controller
 *
 * @project Sujin
 * @since   7.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
*/

// angular.module( 'Sujin', [ 'djds4rce.angular-socialshare' ] )
ngSujin.controller( 'recentCommentsController', function( $scope, $http ) {
	var scope = $scope;

	scope.GLOBALS = GLOBALS;
	scope.WP_comments = {};

	var restUrl = GLOBALS.homeUrl + '/wp-json/wp/v2/comments?filter[per_page]=7';

	$http.get( restUrl ).then(
		function( response ) {
			scope.WP_comments = response.data;
		},
		function( response ) {
		}
	);
});
