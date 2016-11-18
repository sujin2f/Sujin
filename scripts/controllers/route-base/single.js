/**
 * Single Controller
 *
 * @project Sujin
 * @since   7.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
*/

ngSujin.controller( 'singleController', function( $scope, $http, $routeParams, $anchorScroll ) {
	var scope = $scope;
	scope.GLOBALS = GLOBALS;

	// Load Page Data
	scope.postData = {
		post   : {},
		comment: {
			comment_page: 1,
			number_comments: 0,
			comments: [],
		},
	};

	scope.loadPage = function() {
		var restUrl = GLOBALS.homeUrl + '/wp-json/wp/v2/posts?filter[name]=' + $routeParams.post_name;

		$http.get( restUrl ).then(
			function( response ) {
				scope.postData.post = response.data[0];
				GLOBALS.headerBackground = scope.postData.post.thumbnail.url;
			},
			function( response ) {
			}
		);

		$anchorScroll();
	}; scope.loadPage();

	scope.getContainerClass = function() {
		return 'single';
	}
});
