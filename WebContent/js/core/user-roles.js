  /**
   * Created by l058374 on 17/05/2016.
   */
  /*This js is used to retrieve the user roles of the logged in user and to fetch the brand and product, which will be used to be sent as headers in the service calsl.
   The user roles will be used in order to handle some UI role specific implementations.
   If the user roles for HFM or Manual verification is present,
   then the default search page of the Standalone Document Upload is displayed,
   else an error message will be displayed.*/

  angular.element(document).ready(function () {
      fetchUserRoles();
  });



  function fetchUserRoles(headers) {
      var initInjector = angular.injector(["ng"]);
      var $http = initInjector.get("$http");
      var userDetails = null;
      var headers = null;
      var _stubbed = 1;
      $http({
          method: 'GET',
          url: "json/headers.json"
      }).then(function (response) {
          headers = response.data;
          docUpload.constant("HEADERS", headers);
          $http({
              method: 'GET',
              headers: headers,
              url: "response/user.json"
          }).then(function (response) {
              userDetails = response.data;
              docUpload.constant("USER_ID", userDetails.userId);
              docUpload.constant("USER_ROLES", userDetails.roles);
              docUpload.constant("STUBBED",_stubbed);
              bootstrapApplication();
          }, function (errorResponse) {
          });


      }, function (errorResponse) {
      });


  };


  function bootstrapApplication() {
      angular.element(document).ready(function () {
          angular.bootstrap(document, ['docUpload']);
      });
  };
