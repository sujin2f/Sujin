/**
 * Main Controller
 *
 * @project Sujin
 * @since   7.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
*/

angular.module( 'Sujin' )
	.controller( 'listController', function( $scope, $http, DataService, $routeParams ) {
		// Load Page Data
		$scope.postData = [];

		$scope.loadPage = function() {
			var restUrl = DataService.homeUrl + 'wp-json/wp/v2/' + $routeParams.post_type;

			$http.get( restUrl )
				.then(
					function( response ) {
						$scope.postData = response.data;

console.log( $scope.postData );
					},
					function( response ) {
					}
				);
		}
		$scope.loadPage();
	});
