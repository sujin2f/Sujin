/**
 * Main Controller
 *
 * @project Sujin
 * @since   7.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
*/

angular.module( 'Sujin' )
	.controller( 'pageController', function( $scope, $http, DataService, $routeParams ) {
		// Load Page Data
		$scope.postData = [];

		$scope.loadPage = function() {
			var restUrl = DataService.homeUrl + 'wp-json/wp/v2/pages?filter[name]=' + $routeParams.page_name;

			$http.get( restUrl )
				.then(
					function( response ) {
						$scope.postData = response.data[0];
					},
					function( response ) {
					}
				);
		}
		$scope.loadPage();
	});
