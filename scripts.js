/**
 * Angular App
 *
 * @project Sujin
 * @since   7.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

var ngSujin = angular.module( 'Sujin', [ 'ngRoute', 'ngSanitize', '720kb.socialshare' ] );
console.log( GLOBALS );


/**
 * Angular App
 *
 * @project Sujin
 * @since   7.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

// angular.module( 'Sujin', [ 'djds4rce.angular-socialshare' ] )
ngSujin.config( function( $routeProvider, $locationProvider ) {
	$routeProvider
		.when("/", {
			templateUrl : GLOBALS.viewBase + '/route-base/main.html',
			controller  : 'mainController',
		})
		/*
		 * Category
		 */
			.when( "/category/:category_name/page/:paged", {
				templateUrl : GLOBALS.viewBase + '/route-base/list.html',
				controller  : 'listController',
			})
			.when( "/category/:category_name/", {
				templateUrl : GLOBALS.viewBase + '/route-base/list.html',
				controller  : 'listController',
			})
		/*
		 * Tag
		 */
			.when( "/tags/:tag_name/page/:paged", {
				templateUrl : GLOBALS.viewBase + '/route-base/list.html',
				controller  : 'listController',
			})
			// Tags
			.when( "/tags/:tag_name/", {
				templateUrl : GLOBALS.viewBase + '/route-base/list.html',
				controller  : 'listController',
			})
		/*
		 * Search
		 */
			.when( "/search/:search_string/page/:paged", {
				templateUrl : GLOBALS.viewBase + '/route-base/list.html',
				controller  : 'listController',
			})
			// Search
			.when( "/search/:search_string/", {
				templateUrl : GLOBALS.viewBase + '/route-base/list.html',
				controller  : 'listController',
			})
		/*
		 * Single
		 */
		.when( "/:year/:month/:day/:post_name", {
			templateUrl : GLOBALS.viewBase + '/route-base/single.html',
			controller  : 'singleController',
		})
		/*
		 * Page
		 */
			.when( "/about", {
				templateUrl : GLOBALS.viewBase + '/pages/about.html',
				controller  : 'pageController',
			})
		.when( "/:page_name", {
			templateUrl : GLOBALS.viewBase + '/route-base/page.html',
			controller  : 'pageController',
		})

		/*
		 * Custom Post Type
		 */
		.when( "/:type_name/:post_name", {
			templateUrl : GLOBALS.viewBase + '/route-base/single.html',
			controller  : 'singleController',
		})

		$locationProvider.html5Mode( true ).hashPrefix('!');
});

ngSujin.directive('adense', function() {
    return {
        restrict: 'A',
        controller: function(){
            (adsbygoogle = window.adsbygoogle || []).push({});
        }
    };
});


/**
 * Scroll
 *
 * @project Sujin
 * @since   7.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
*/

// angular.module( 'Sujin', [ 'djds4rce.angular-socialshare' ] )
ngSujin
	.directive( 'scroll', function( $window ) {
		return function( scope, element, attrs ) {
			angular.element( $window ).bind( "scroll", function() {
				if ( this.pageYOffset >= 80 ) {
					element.addClass( 'scrolled' );
				} else {
					element.removeClass( 'scrolled' );
				}
			});
		};
	});


ngSujin.directive( 'graph', function() {
	return {
		restrict: 'E',
		templateUrl: GLOBALS.viewBase + '/template-part/graph.html',
		scope : {
			graphType  : '@',
			graphValue : '@',
			graphName  : '@',
		},
		replace: true,
		controller: function( $scope ) {
			$scope.overHalf = 0;

			$scope.degree = 360 * $scope.graphValue / 100;

			if ( $scope.degree > 180 )
				$scope.overHalf = 1;

			$scope.x = ( 100 + 100 * Math.sin( - ( $scope.degree - 180 ) * Math.PI / 180 ) ) - 100;
			$scope.y = ( 100 + 100 * Math.cos( - ( $scope.degree - 180 ) * Math.PI / 180 ) );
		},
	};
});


/**
 * HTML Filter
 *
 * @project Sujin
 * @since   7.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
*/

// angular.module( 'Sujin', [ 'djds4rce.angular-socialshare' ] )
ngSujin.filter( 'html', [ '$sce', function( $sce ){
    return function( text ) {
        return $sce.trustAsHtml( text );
    };
}]);

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
				GLOBALS.title            = scope.postData.post.title.rendered;
				GLOBALS.description      = scope.postData.post.excerpt.rendered.replace(/<\/?[^>]+(>|$)/g, "");
				GLOBALS.postID           = scope.postData.post.id;

				var tags = [];
				scope.postData.post.tags.forEach( function( tag ) {
					tags.push( tag.name );
				});
				GLOBALS.tags = tags.join();
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


/**
 * Comments Controller
 *
 * @project Sujin
 * @since   7.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
*/

// angular.module( 'Sujin', [ 'djds4rce.angular-socialshare' ] )
ngSujin.controller( 'commentsController', function( $scope, $http, $routeParams ) {
	var scope = $scope;
	scope.GLOBALS = GLOBALS;

	// Comment List
	scope.commentData = function() {
		return scope.$parent.postData.comment;
	}

	scope.loadComments = function() {
		var restUrl = GLOBALS.homeUrl + '/wp-json/wp/v2/comments?post_name=' + $routeParams.post_name + '&page=' + scope.commentData().comment_page + '&per_page=30';

		$http.get( restUrl ).then(
			function( response ) {
				if ( !response.data.length )
					return false;

				scope.commentData().number_comments = response.data[0].number;
				scope.childrenReculsive( response.data );
			},
			function( response ) {
			}
		);
	}; scope.loadComments();

	scope.childrenReculsive = function( comments ) {
		comments.forEach( function( comment, key ) {
			scope.commentData().comments.push( comment );

			if ( comment.children && comment.children.length ) {
				scope.childrenReculsive( comment.children );
			}
		});
	};

	scope.getHeader = function() {
		if ( !scope.commentData().number_comments )
			return 'No Comment';

		if ( scope.commentData().number_comments == 1 )
			return '1 Comment';

		return scope.commentData().number_comments + ' Comments';
	};

	// Comment Input
	scope.form = {};
	scope.form.name = '';
	scope.form.mail = '';
	scope.form.site = '';
	scope.form.text = '';

	scope.isFormAvailable = function() {
		var mail_valid = validateEmail( scope.form.mail );
		return ( scope.form.name && mail_valid && scope.form.text );
	};

	scope.clearForm = function() {
		scope.form.name = '';
		scope.form.mail = '';
		scope.form.site = '';
		scope.form.text = '';
	};

	scope.submitComment = function() {
		var req = {
			method: 'POST',
			url:    GLOBALS.homeUrl + '/wp-json/wp/v2/comments',
			data: {
				author_email: scope.form.mail,
				author_name : scope.form.name,
				author_url:   scope.form.site,
				content:      scope.form.text,
				post:         GLOBALS.postID,
			},
		};

		$http( req ).then(
			function( response ) {
				scope.form.name = '';
				scope.form.mail = '';
				scope.form.site = '';
				scope.form.text = '';

				scope.published = true;
			},
			function( response ) {
			}
		);
	};

	function validateEmail(email) {
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email);
	}
});


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



/**
 * Body Controller
 *
 * @project Sujin
 * @since   7.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
*/

// angular.module( 'Sujin', [ 'djds4rce.angular-socialshare' ] )
ngSujin.controller( 'BodyController', function( $scope, $routeParams, $anchorScroll, $window ) {
	var scope = $scope;

	scope.bodyClass = function() {
		// Home
		if ( $window.location.pathname == '/' )
			return 'ng-home full-background without-footer';

		if ( $routeParams.page_name )
			return 'full-background';
	}

	scope.backToTop = function() {
		$anchorScroll();
	}
});


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


/**
 * Header Controller
 *
 * @project Sujin
 * @since   7.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
*/

// angular.module( 'Sujin', [ 'djds4rce.angular-socialshare' ] )
ngSujin.controller( 'FooterController', function( $scope, MenuInfo ) {
	var scope = $scope;
	scope.GLOBALS = GLOBALS;
});


/**
 * Head Controller
 *
 * @project Sujin
 * @since   7.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
*/

// angular.module( 'Sujin', [ 'djds4rce.angular-socialshare' ] )
ngSujin.controller( 'HeadController', function( $scope ) {
	var scope = $scope;
	scope.GLOBALS = GLOBALS;
});


/**
 * Data
 *
 * @project Sujin
 * @since   7.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
*/

ngSujin.service( 'MenuInfo', function() {
	var menu = [
		{
			title       : 'About',
			url         : '/about',
			current_cond: '$routeParams.page_name == "about"',
		},
		{
			title       : 'Blog',
			url         : '/category/blog',
			current_cond: '$routeParams.category_name == "blog" || $routeParams.post_name',
		},
	];

	return menu;
});


