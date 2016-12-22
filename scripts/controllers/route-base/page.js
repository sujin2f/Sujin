/**
 * Single Controller
 *
 * @project Sujin
 * @since   7.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
*/

ngSujin.controller( 'pageController', function( $scope, $http, $routeParams, $anchorScroll, $route ) {
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
		var restUrl;

		if ( $routeParams.page_name ) {
			restUrl = GLOBALS.homeUrl + '/wp-json/wp/v2/pages?filter[name]=' + $routeParams.page_name;
		} else {
			restUrl = GLOBALS.homeUrl + '/wp-json/wp/v2/pages?filter[name]=' + $route.current.$$route.originalPath.replace( '/', '' );
		}

		$http.get( restUrl ).then(
			function( response ) {
				scope.postData.post = response.data[0];

				GLOBALS.headerBackground = '';
				GLOBALS.pageBackground   = scope.postData.post.thumbnail.url;

				GLOBALS.title            = scope.postData.post.title.rendered;
				GLOBALS.description      = scope.postData.post.excerpt.rendered.replace(/<\/?[^>]+(>|$)/g, "");
				GLOBALS.postID           = scope.postData.post.id;
			},
			function( response ) {
			}
		);

		$anchorScroll();
	}; scope.loadPage();

	scope.getContainerClass = function() {
		if ( $routeParams.page_name ) {
			return 'single page ' + $routeParams.page_name;
		} else {
			return 'single page ' + $route.current.$$route.originalPath.replace( '/', '' );
		}

	}

	scope.getBackground = function() {
		if ( GLOBALS.pageBackground )
			return GLOBALS.pageBackground;
	}
});
