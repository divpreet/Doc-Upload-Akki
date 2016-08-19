/**
 * Created by l058374 on 16/05/2016.
 */
docUpload.controller('HeaderController',['$rootScope','displayMessage','USER_ID','$state','CookieUtility',function($rootScope,displayMessage,USER_ID,$state,CookieUtility){

    var vm  = this;
    vm.pageMessages = displayMessage;
    vm.loggedInUserId = USER_ID;
    vm.currentState = $state.$current.name;

    $rootScope.$watch($state.$current.name,function(){
        vm.currentState = $state.$current.name;
    });

    $rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from) {
        $rootScope.previousState = from.name;
        $rootScope.currentState = to.name;
        vm.currentState = $state.$current.name;
    });

    vm.logOut = function(){
        CookieUtility.deleteCookies("XSRF_TOKEN");
        //CookieUtility.setCookies("-1");
    };

    vm.back = function(){
        var state = $rootScope.previousState;
        $state.go(state);

    };



}]);
