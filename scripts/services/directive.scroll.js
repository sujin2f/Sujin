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
