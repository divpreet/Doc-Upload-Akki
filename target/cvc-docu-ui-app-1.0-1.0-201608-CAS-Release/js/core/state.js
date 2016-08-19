/**
 * Created by l058374 on 16/05/2016.
 */

//docUpload.run('Config',['HEADERS','$rootScope',function(HEADERS,$rootScope){
//    $rootScope.headers.brand = HEADERS.brand;
//}]);


docUpload.config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){

    $urlRouterProvider.when('','/dashboard');
    $urlRouterProvider.otherwise('/dashboard');

    $stateProvider
    .state('root',{
      abstract: true,
        views: {
          'header' : {
            templateUrl: 'views/header.html',
            controller: 'HeaderController',
            controllerAs: 'headCtrl',
            resolve :{
                displayMessage : ['RestService', function(RestService){
                    return RestService.fetchMessages();
                }]
            }
        },
        'content':{
          template: '<div ui-view="content"></div>'
        }
        }
    })
        .state('root.dashboard',{
          parent:'root',
            url:'/dashboard',
            views: {
                'content': {
                    templateUrl:  'views/dashboard.html',
                    controller: 'DashboardController',
                    controllerAs: 'dashCtrl',
                    resolve :{
                        displayMessage : ['RestService', function(RestService){
                            return RestService.fetchMessages();
                        }]
                    }
                }
            }
        })

        .state('root.createNew',{
            url:'/createNew',
             parent:'root',
            views: {
                'content': {
                    templateUrl: 'views/createNew.html',
                    controller: 'CreateNewController',
                    controllerAs: 'newCtrl'
                }
            }

        });

}]);