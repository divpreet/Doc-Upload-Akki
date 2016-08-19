/**
 * Created by l058374 on 24/05/2016.
 */
docUpload.directive('notification',[function(){
return {
    restrict: 'E',
    scope: {},
    transclude: true,
    controller: 'NotifyController',
    controllerAs: 'notifyCtrl',
    templateUrl: 'views/serviceAlerts.html'
};
}]);

docUpload.directive('notificationEvent',[function(){
return {

    require: '^notification',
    restrict: 'E',
    replace: true,
    scope: {
        name: '@'
    },
    link: link
};
    function link(scope, element, attrs, notificationCtrl) {
        notificationCtrl.addEvent(scope);
    }
}]);

docUpload.controller('NotifyController',['$scope',function($scope){

    var vm = this;
    vm.alerts = [];
    vm.showAlert = false;
    vm.typeOfAlert = '';
    vm.eventName = '';

    $scope.$on('CLEAR', function (event) {
        vm.clearAll();
    });


        vm.addEvent = function (eventName) {
      /*  $scope.$on(eventName.name, function (event, message) {
            message = message || {type: 'success', msg: 'No message specified'};
            vm.typeOfAlert = event.name.toUpperCase();
            vm.showAlert = true;
            vm.addNotification(message);
        });*/
        $scope.$on(eventName.name, function (event, message, eventType){
            message = message || {type: 'success', msg: 'No message specified'};
            if(event.name === "error" || event.name === "warning" ){
              vm.typeOfAlert = event.name.toUpperCase();
            }else{
              vm.typeOfAlert = eventType;
            }
            vm.eventName = event.name;
            vm.showAlert = true;
            vm.addNotification(message);
        });
    };

    vm.clearAll = function () {
        vm.showAlert = false;
        vm.alerts = [];
    };

    vm.closeAlert = function (index) {
        vm.showAlert = false;
        vm.alerts.splice(index, 1);
    };

    vm.addNotification = function (message) {
        vm.alerts.push(message);
    };
}]);