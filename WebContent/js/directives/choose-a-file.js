docUpload.directive('chooseAFile',['$rootScope','formDataFactory','$modal',function($rootScope,formDataFactory, $modal) {

    return {
      restrict: 'A',
      //require: '?ngModel',
      fileType : '@',
      customerCisKey : '@',
      link: function(scope, element, attrs, ngModel) {
        return element.bind('change', function(event) {
          var reader ;
          var files = [];
          var  validMimeTypes = attrs.dragAndDrop;
          checkSize = function(size, name) {
            var _ref;
            if (((_ref = attrs.maxFileSize) === (void 0) || _ref === '') || (size) < attrs.maxFileSize) {
              return true;
            } else {
          	  formDataFactory.modalPopupMessage = "The file "+ name +"cannot be uploaded as the size is > 20 MB . Please upload a file with maximum size as 20 MB.";
          	  showWarningAlert();
              return false;
            }
          };
          showWarningAlert = function(){
                var modalInstance = $modal.open({
                  backdrop: true,
                  backdropClick: true,
                  dialogFade: false,
                  keyboard: true,
                     templateUrl: 'views/modalPopup.html',
                    controller:'ModalPopupController'
                });
          };
          isTypeValid = function(type, extension) {

            if (((validMimeTypes === (void 0) || validMimeTypes === '') || validMimeTypes.indexOf(type) > -1) && type) {
              return true;
            } else {
              formDataFactory.modalPopupMessage = 'The file with extension ' + extension+ 'is invalid. Please enter a file with extension: .gif , .jpeg, .png, .tiff, .bmp, .pdf';
              showWarningAlert();
              return false;
            }
          };
          if (event != null) {
            event.preventDefault();
          }
          reader = new FileReader();
          var date = new Date();
          var day =  date.getDate();
          var month =  date.getMonth() + 1;
          date = (day<10 ? "0" : "")+ day + "/" + (month < 10 ? "0" : "")+ month + "/" + date.getFullYear();
          var doc = {};
          reader.onload = function(evt){
            angular.forEach(files, function(v){
              var size = v.size;
              var name = v.name;
              var type = v.type;
              var extension = name.split(".");
              extension = extension[1];
              if (checkSize(size, name) && isTypeValid(type, extension)) {
              var doc = {};
              var key = attrs.customerCiskey;
              var a = JSON.parse(attrs.fileType);
              doc = {
                  "documentName" : a.documentName,
                  "documentId" : a.docTypeId,
                  "uploadedDocumentName" : v.name,
                  "documentStatus" : "To be uploaded",
                  "amount" : "-",
                  "processStatus" : "N/A",
                  "uploadDate" : date
                  }
                 formDataFactory.uploadedDocumentDetails = doc;
                 formDataFactory.uploadedDocumentDetails.cisKey = key;
                 formDataFactory.atleastOneDocumentUploaded = true;
                 $rootScope.$broadcast('documentListUpdated',formDataFactory.uploadedDocumentDetails );
                 
                 element[0].value = '';
               }
            });
          };

          angular.forEach(event.target.files, function(v){
            files.push(v);
            if(v){
              reader.readAsDataURL(v);
            }
          });
          return false;

        });
      }
    };
  }])
;
