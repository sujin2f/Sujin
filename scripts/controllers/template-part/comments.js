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
