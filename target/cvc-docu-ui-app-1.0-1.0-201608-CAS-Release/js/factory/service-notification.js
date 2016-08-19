/**
 * Created by l058374 on 24/05/2016.
 */

docUpload.factory('NotificationService',['$rootScope',function($rootScope){

    var warning = 'warning';
    var error = 'error';
    var clear = 'clear';



    var NotificationService = {};


    NotificationService.warning = function (message) {
        $rootScope.$broadcast(warning, {type: 'alert-warning', msg: message});
    };

    NotificationService.error = function ( message) {
        $rootScope.$broadcast(error, {type: 'alert-danger', msg: message});
    };

    NotificationService.custom = function (event, message, eventType) {
      var type = "";
      if(eventType === "ERROR"){
        type = 'alert-danger';
      }else if(eventType === "WARNING"){
        type = 'alert-warning';
      }
        $rootScope.$broadcast(event, {type: type, msg: message}, eventType);
    };
    NotificationService.clear = function () {
        $rootScope.$broadcast('CLEAR');
    };
    return NotificationService;
}]);
