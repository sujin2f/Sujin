/**
 * Angular App
 *
 * @project Sujin
 * @since   7.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

var ngSujin = angular.module( 'Sujin', [ 'ngRoute', 'ngSanitize', '720kb.socialshare' ] );

window.mobilecheck = function() {
	var check = false;
	(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
	return check;
};

GLOBALS.mobile = mobilecheck();

console.log( GLOBALS );


/**
 * Angular App
 *
 * @project Sujin
 * @since   7.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

// angular.module( 'Sujin', [ 'djds4rce.angular-socialshare' ] )
ngSujin
	.config( function( $routeProvider, $locationProvider ) {
		$routeProvider
			.when("/", {
				templateUrl : GLOBALS.viewBase + '/route-base/main.html',
				controller  : 'mainController',
			})
			// Single
			.when( "/:year/:month/:day/:post_name", {
				templateUrl : GLOBALS.viewBase + '/route-base/single.html',
				controller  : 'singleController',
			})

/*
			.when( "/list/:post_type/:page?", {
				templateUrl : variables.viewBase + 'list.html',
				controller  : 'listController',
			})
			.when( "/:page_name", {
				templateUrl : variables.viewBase + 'page.html',
				controller  : 'pageController',
			})
*/

			$locationProvider.html5Mode( true ).hashPrefix('!');
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


/**
 * HTML Filter
 *
 * @project Sujin
 * @since   7.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
*/

// angular.module( 'Sujin', [ 'djds4rce.angular-socialshare' ] )
ngSujin
    .filter( 'html', [ '$sce', function( $sce ){
        return function( text ) {
            return $sce.trustAsHtml( text );
        };
    }]);

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


/**
 * Data
 *
 * @project Sujin
 * @since   7.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
*/

// angular.module( 'Sujin', [ 'djds4rce.angular-socialshare' ] )
ngSujin
	.service( 'MenuInfo', function() {
		var menu = [
			{
				title: 'Sample Post',
				url  : '/2016/11/14/안녕히-가세요',
			},
			{
				title: 'Simple Post',
				url  : '/2016/09/23/hello-world',
			},
		];

		return menu;
	});


/**
 * Header Controller
 *
 * @project Sujin
 * @since   7.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
*/

// angular.module( 'Sujin', [ 'djds4rce.angular-socialshare' ] )
ngSujin
	.controller( 'FooterController', function( $scope, MenuInfo ) {
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
ngSujin
	.controller( 'HeadController', function( $scope ) {
	});


/**
 * Body Controller
 *
 * @project Sujin
 * @since   7.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
*/

// angular.module( 'Sujin', [ 'djds4rce.angular-socialshare' ] )
ngSujin
	.controller( 'BodyController', function( $scope, $routeParams, $anchorScroll ) {
		var scope = $scope;

		scope.bodyClass = function() {
			// Home
			if ( Object.keys( $routeParams ).length == 0 )
				return 'ng-home full-background';
		}

		scope.backToTop = function() {
			$anchorScroll();
		}
	});


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


/**
 * Recent Comments Controller
 *
 * @project Sujin
 * @since   7.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
*/

// angular.module( 'Sujin', [ 'djds4rce.angular-socialshare' ] )
ngSujin
	.controller( 'recentCommentsController', function( $scope ) {
		var scope = $scope;
		scope.GLOBALS = GLOBALS;
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
	scope.WP_posts = {};

	var restUrl = GLOBALS.homeUrl + '/wp-json/wp/v2/posts?filter[per_page]=4&filter[thumbnail_size]=recent-post';

	$http.get( restUrl ).then(
		function( response ) {
			scope.WP_posts = response.data;
console.log(response.data);
		},
		function( response ) {
		}
	);

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
		var restUrl = GLOBALS.homeUrl + '/wp-json/wp/v2/comments?post_name=' + $routeParams.post_name + '&page=' + scope.commentData().comment_page;

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
	}

	scope.getHeader = function() {
		if ( !scope.commentData().number_comments )
			return 'No Comment';

		if ( scope.commentData().number_comments == 1 )
			return '1 Comment';

		return scope.commentData().number_comments + ' Comments';
	}

	// Comment Input
	scope.form = {};
	scope.form.name = '';
	scope.form.mail = '';
	scope.form.site = '';
	scope.form.text = '';

	scope.isFormAvailable = function() {
		return ( scope.form.name && scope.form.mail && scope.form.text );
	}

	scope.clearForm = function() {
		scope.form.name = '';
		scope.form.mail = '';
		scope.form.site = '';
		scope.form.text = '';
	}
});


