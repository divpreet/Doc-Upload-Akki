/**
 * Created by l058374 on 16/05/2016.
 */
docUpload.service('RestService',['$http','HEADERS','ServiceUrls','$cookies','USER_ID','CookieUtility','$rootScope','STUBBED',function($http,HEADERS,ServiceUrls,$cookies,USER_ID,CookieUtility,$rootScope,STUBBED){

    var RestService = this;
    var headers = HEADERS;
    var userId = USER_ID;
    var origin = '';
    var SERVICE_URL = '';


    RestService.getOrigin = function (val){
        //TODO check the context-path
        if(STUBBED){
          SERVICE_URL = "";
      }else{
        //TODO to be removed when actual service comes to place
           if(val == "verifyCisKeys"){
             SERVICE_URL = "";
           }else{
        origin = (window.location.origin) ? window.location.origin : RestService.fetchOrigin(window.location);
        SERVICE_URL = origin + "/cvc/services/wol/";
           }
       }
        return SERVICE_URL;
    };

/*  RestService.getOrigin = function getOrigin(){
     //TODO check the context-path
     if(STUBBED){
       SERVICE_URL = "";
   }else{
     origin = (window.location.origin) ? window.location.origin : RestService.fetchOrigin(window.location);
     SERVICE_URL = origin + "/cvc/services/docupload/wol/";
   }
     return SERVICE_URL;
 };*/


    RestService.fetchOrigin = function (url) {
        var arr = (url + "").split("//");
        return arr[0] + "//" + arr[1].substring(0, arr[1].indexOf("/"));
    };

    RestService.getHeaders = function getHeaders() {
        var xsrfToken = '';

        angular.forEach($cookies, function (v, k) {
            if(k.indexOf('XSRF_TOKEN')>-1) {
                xsrfToken = v;
            }
        });
        return {
            "brand": "BOM",
            "product": "HL",
            "siteType": "D",
            "crossDomain": true,
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-XSRF-Token": xsrfToken,
            "salaryId" :userId
        };
    };

    RestService.fetchMessages = function (){
        var displayMessages = null;
        if(null == displayMessages) {
            displayMessages = $http({
                url:  "json/displayMessages.json",
                method: 'GET'
            }).then(function (response) {
                return response.data;
            });
            return displayMessages;
        }

        return displayMessages;
    };


    RestService.getListOfARn = function (HFM_Id, recordCounter){
        var urlValue = "arnList";
        return $http({
            url: RestService.getOrigin(urlValue) + ServiceUrls.getServiceUrls(urlValue),
            method: 'POST',
            headers: RestService.getHeaders(),
            data: {
                "requestData": {
                    "hfmId": HFM_Id,
                    "rowCount": recordCounter
                }
            },
            beforeSend : function(xhr) {
                xhr.setRequestHeader("X-XSRF-Token", CookieUtility.getCookie("XSRF_TOKEN"));
            }
        });
    };

    RestService.verifyCisKeys = function (customerCisKeys){
        var urlValue = "verifyCisKeys";
        var dataObj = angular.toJson(customerCisKeys);
        console.log(dataObj);
        return $http({
            url: RestService.getOrigin(urlValue) + ServiceUrls.getServiceUrls(urlValue),
            method: 'POST',
            headers: RestService.getHeaders(),
            data: {
                "requestData": {
                    "cisKeyValues": dataObj
                }
            },
            beforeSend : function(xhr) {
                xhr.setRequestHeader("X-XSRF-Token", CookieUtility.getCookie("XSRF_TOKEN"));
            }
        });
    };


    RestService.getDocuments = function (){
        var urlValue = "docList";
        return $http({
            url:  RestService.getOrigin(urlValue) + ServiceUrls.getServiceUrls(urlValue),
            method : 'POST',
            headers:RestService.getHeaders(),
            data: {
                "requestData": {
                }
            },
            beforeSend : function(xhr) {
                xhr.setRequestHeader("X-XSRF-Token", CookieUtility.getCookie("XSRF_TOKEN"));
            }

        });
    };

    RestService.saveAndCreateNewCase = function(requestData){
      var urlValue = "createNewApplication";
      return $http({
        url: RestService.getOrigin(urlValue) + ServiceUrls.getServiceUrls(urlValue),
        method: 'POST',
        headers: RestService.getHeaders(),
        data: {
          "requestData" :requestData
        },
        beforeSend : function(xhr) {
            xhr.setRequestHeader("X-XSRF-Token", CookieUtility.getCookie("XSRF_TOKEN"));
        }
      });

    };

    RestService.validateARN = function (arn){
        var urlValue = "arn";
        return $http({
            url:  RestService.getOrigin(urlValue) + ServiceUrls.getServiceUrls(urlValue),
            method : 'GET',
            headers:RestService.getHeaders(),
            data: {
                "requestData": {
                }

            },
            beforeSend : function(xhr) {
                xhr.setRequestHeader("X-XSRF-Token", CookieUtility.getCookie("XSRF_TOKEN"));
            }

        });
    };

}]);
