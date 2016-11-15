/**
 * Data
 *
 * @project Sujin
 * @since   7.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
*/

angular.module( 'Sujin' )
	.service( 'DataService', function() {
		var data = {
			logo    : variables.logo,
			homeUrl : variables.homeUrl,
			menu    : variables.menu,
			viewBase: variables.viewBase,
		};
		return data;
	});
