  /**
   * Created by l058374 on 27/05/2016.
   */
  docUpload.factory('ServiceUrls',['STUBBED',function(STUBBED){

      var ServiceUrls = {};

      ServiceUrls.getServiceUrls = function getServiceUrls(urlValue){

        if(STUBBED){
          if(urlValue == "arnList"){
                 return  "response/ARNList.json";
          }else if(urlValue == "docList"){
                return  "response/documents.json";
          }else if(urlValue == "verifyCisKeys"){
                return  "response/verifyCISKeys.json";
          }else if(urlValue == "createNewApplication"){
                return  "response/createNewApplication.json";
          }else if(urlValue == "arn"){
                return  "response/arn.json";
          }
        }else{
          if(urlValue == "arnList"){
           return  "retrieveARNListofHFM";
          }else if(urlValue == "docList"){
              return  "retrieveDocumentTypes";
          }else if(urlValue == "verifyCisKeys"){
        	  return  "response/verifyCISKeys.json";
          }else if(urlValue == "createNewApplication"){
                return  "createNewApplication";
          }else if(urlValue == "arn"){
            return  "arn";
          }
    }
    };
      return ServiceUrls;

  }]);
