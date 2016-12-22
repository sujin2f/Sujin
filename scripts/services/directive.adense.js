ngSujin.directive('adense', function() {
    return {
        restrict: 'A',
        controller: function(){
            (adsbygoogle = window.adsbygoogle || []).push({});
        }
    };
});
