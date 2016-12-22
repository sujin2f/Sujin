/**
 * Recent Posts Controller
 *
 * @project Sujin
 * @since   7.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
*/

// angular.module( 'Sujin', [ 'djds4rce.angular-socialshare' ] )
ngSujin.controller( 'recentPostsController', function( $scope, $http ) {
	var scope = $scope;
	scope.GLOBALS = GLOBALS;

	if ( ! GLOBALS.mobile ) {
		scope.WP_posts = {};
		var restUrl = GLOBALS.homeUrl + '/wp-json/wp/v2/posts?per_page=4&filter[thumbnail_size]=recent-post';

		$http.get( restUrl ).then(
			function( response ) {
				scope.WP_posts = response.data;
			},
			function( response ) {
			}
		);
	}
});
