/**
 * Pagination Controller
 *
 * @project Sujin
 * @since   7.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
*/

ngSujin.controller( 'PaginationController', function( $scope, $routeParams, $location ) {
	var scope = $scope;
	    scope.GLOBALS  = GLOBALS;

	scope.getPages = function() {
		var start, end;
		var last_page = GLOBALS.total_pages;
		var pages     = [];

		if ( !last_page )
			return;

		if ( !$routeParams.paged )
			var selected_page = 1;
		else
			var selected_page = $routeParams.paged;

		start = selected_page - 3;
		end   = selected_page + 3;

		if ( start < 1 )
			start = 1;

		if ( start > 2 ) {
			pages.push( 1 );
			pages.push( false );

		} else if ( start == 2 ) {
			pages.push( 1 );

		}

		for( var i = start; i < start + 7; i++ ) {
			if ( i > last_page )
				break;

			pages.push( i );
		}

		if ( i < last_page ) {
			pages.push( false );
			pages.push( last_page );

		} else if ( i == last_page ) {
			pages.push( last_page );

		}

		return pages;
	};

	scope.getSelectedPage = function() {
		if ( !$routeParams.paged )
			return 1;

		return $routeParams.paged;
	}

	/**
	 * Toggle Pages
	 *
	 * @since  0.0.1
	 * @return array
	*/
	$scope.togglePage = function( page ) {
		$location.path( '/category/' + $routeParams.category_name + '/page/' + page );
	};
});

