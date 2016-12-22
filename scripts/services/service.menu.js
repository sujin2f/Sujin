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
