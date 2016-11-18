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