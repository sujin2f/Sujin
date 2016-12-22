/**
 * Main Controller
 *
 * @project Sujin
 * @since   7.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
*/

ngSujin.controller( 'listController', function( $scope, $http, $routeParams ) {
	var scope = $scope;
	    scope.WP_Posts = [];
	    scope.GLOBALS  = GLOBALS;

	GLOBALS.headerBackground = GLOBALS.themeURL + '/assets/images/list/background.jpg';

	if ( $routeParams.category_name ) {
		var restUrl = GLOBALS.homeUrl + '/wp-json/wp/v2/posts?per_page=12&filter[category_name]=' + $routeParams.category_name;

	} else if ( $routeParams.tag_name ) {
		var restUrl = GLOBALS.homeUrl + '/wp-json/wp/v2/posts?per_page=12&filter[tag]=' + $routeParams.tag_name;

	} else if ( $routeParams.search_string ) {
		var restUrl = GLOBALS.homeUrl + '/wp-json/wp/v2/posts?per_page=12&filter[ignore_sticky_posts]=false&search=' + $routeParams.search_string;

	}

	if ( $routeParams.paged )
		restUrl += '&page=' + $routeParams.paged;

	// Load Page Data

	$http.get( restUrl ).success( function ( data, status, headers ) {
		scope.WP_Posts = data;

		GLOBALS.title       = 'Category';
		GLOBALS.description = 'Wordpress & OSX Developer / Designer / Photographer';
		GLOBALS.tags        = 'Wordpress, OSX, Design, Photographer, Developer';

		if ( scope.WP_Posts[0] && $routeParams.category_name ) {
			GLOBALS.title       = 'Category : ' + scope.WP_Posts[0].category.cat_name;
			GLOBALS.description = scope.WP_Posts[0].category.category_description;
			GLOBALS.tags        = scope.WP_Posts[0].category.cat_name;

		} else if ( $routeParams.tag_name ) {
			GLOBALS.title       = 'Tag : ' + scope.WP_Posts[0].tags.name;
			GLOBALS.description = '';
			GLOBALS.tags        = scope.WP_Posts[0].tags.name;

		} else if ( $routeParams.search_string ) {
			GLOBALS.title       = 'Search : ' + $routeParams.search_string;
			GLOBALS.description = '';
			GLOBALS.tags        = '';

		}

		var header = headers();
		GLOBALS.total_pages = header[ 'x-wp-totalpages' ];

	}).error(function (data, status) {
	});

	scope.getFormattedDate = function( date, format ) {
		date   = new Date( date );

		format = format.replace( 'd', date.getDate() );
		format = format.replace( 'Y', date.getFullYear() );
		format = format.replace( 'm', date.toLocaleString( 'en-us', { month: "short" } ) );

		return format;
	};

	scope.getContainerClass = function() {
		return 'post-list';
	};
});
