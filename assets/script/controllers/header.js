/**
 * Header Controller
 *
 * @project Sujin
 * @since   7.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
*/

angular.module( 'Sujin' )
	.controller( 'Header', function( $scope, DataService ) {
		$scope.vars = {
			logo    : DataService.logo,
			homeUrl : DataService.homeUrl,
			menu    : DataService.menu,
			viewBase: DataService.viewBase,

			hover   : '',
		};

		$scope.Hover = function( id ) {
			$scope.vars.hover = id;
		}

		$scope.Leave = function( id ) {
			$scope.vars.hover = '';
		}
	});
