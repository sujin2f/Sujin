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
