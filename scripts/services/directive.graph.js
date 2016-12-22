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
