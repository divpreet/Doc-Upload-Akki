
docUpload.directive('dragAndDrop',['formDataFactory','$rootScope','$modal','NotificationService',function(formDataFactory,$rootScope,$modal,NotificationService){

return {
  restrict : 'A',
  scope : {
    file : '=',
    fileName : '=',
    fileType : '@',
    customerCisKey : '@'
  },
  link : function(scope, element, attrs){
    var checkSize, isTypeValid, processDragOverOrEnter, validMimeTypes ;
    var noOfdocuments = 0;
        processDragOverOrEnter = function(event) {
          if (event != null) {
            event.preventDefault();
          }
          event.dataTransfer.effectAllowed = 'copy';
          return false;
        };
        validMimeTypes = attrs.dragAndDrop;
        checkSize = function(size, name) {
          var _ref;
          if (((_ref = attrs.maxFileSize) === (void 0) || _ref === '') || (size) < attrs.maxFileSize) {
            return true;
          } else {
        	  formDataFactory.modalPopupMessage = "The file "+ name +" cannot be uploaded as the size is > 20 MB . Please upload a file with maximum size as 20 MB.";
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
            formDataFactory.modalPopupMessage = 'The file with extension' + extension+ ' is invalid. Please enter a file with extension: .gif , .jpeg, .png, .tiff, .bmp, .pdf';
            showWarningAlert();
            return false;
          }
        };
        element.bind('dragstart', processDragOverOrEnter);
      //  element.bind('dragenter', processDragOverOrEnter);
        return element.bind('drop', function(event) {
          NotificationService.clear();
          var file, name, reader, size, type, extension;
          noOfdocuments = noOfdocuments + 1;
          if (event != null) {
            event.preventDefault();
          }
          var doc = {};
          reader = new FileReader();
          var date = new Date();
          var day =  date.getDate();
          var month =  date.getMonth() + 1;
          date = (day<10 ? "0" : "")+ day + "/" + (month < 10 ? "0" : "")+ month + "/" + date.getFullYear();
          reader.onload = function(evt) {
            if (checkSize(size, name) && isTypeValid(type, extension)) {
              var a = JSON.parse(attrs.fileType);
              var key = attrs.customerCiskey;
              return scope.$apply(function() {
                scope.file = evt.target.result;
                if (angular.isString(name)) {
                  doc = {
                    "documentName" : a.documentName,
                    "documentId" : a.docTypeId,
                    "uploadedDocumentName" : name,
                    "documentStatus" : "To be uploaded",
                    "amount" : "-",
                    "processStatus" : "N/A",
                    "uploadDate" : date
                                    }
                  formDataFactory.uploadedDocumentDetails = doc;
                  formDataFactory.uploadedDocumentDetails.cisKey = key;
                  formDataFactory.noOfdocuments = noOfdocuments;
                  formDataFactory.atleastOneDocumentUploaded = true;
                  $rootScope.$broadcast('documentListUpdated',formDataFactory.uploadedDocumentDetails );

                  return scope.fileName = name;
                }
              });
            }
          };
          file = event.dataTransfer.files[0];
          if(file){
          name = file.name;
          extension = name.split(".");
          extension = extension[1];
          type = file.type;
          size = file.size;
          reader.readAsDataURL(file);
        }else{
          showWarningAlert();
        }
          return false;
        });
  }
}
}]).controller('DropAlertController',['$scope','$modalInstance',function($scope,$modalInstance){
  $scope.close = function(){
    $modalInstance.close();
  };
}]).directive('chooseAFile', [function ($) {
    return {
        restrict: 'E',
        scope:{
          fileType: '@'
        },
        template : '<label for="file-upload" class="custom-file-upload btn btn-neutral">'+
                   '<i class="fa fa-cloud-upload"></i> Choose a file'+
                   '</label><input type="file"/>',
        link: function(scope, element, attrs) {
          element.bind('change',function(){
console.log("Archie");
          });
        }
    };
}]).directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',

        link: function(scope, element, attrs) {
            var model, modelSetter;

            attrs.$observe('fileModel', function(fileModel){
                model = $parse(attrs.fileModel);
                modelSetter = model.assign;
            });

            element.bind('change', function(){
                scope.$apply(function(){
                    //modelSetter(scope.$parent, element[0].files[0]);
                });
            });
        }
    };
}]);
