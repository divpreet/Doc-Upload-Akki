/**
 * Created by l058374 on 16/05/2016.
 */
docUpload.controller('CreateNewController',['$rootScope','$state','RestService','formDataFactory','$scope','$timeout','NotificationService','$location', '$anchorScroll','$q', '$modal',function($rootScope,$state,RestService,formDataFactory,$scope,$timeout,NotificationService,$location, $anchorScroll,$q, $modal){

    var vm =this;
    vm.documents = [];
    vm.customers = [];
    vm.applicationNumber = '';
    vm.fetchedDocuments = [];
    vm.uploadedDocuments = [];
    vm.noOfDocuments = 0;
    vm.showDocumentsSection = false;
    vm.isUploadingFilesFlag = false;
    vm.showLoadingMessage = true;
    vm.errorResponseFromCreateService = false;
    vm.activeDroppedDocumentType = '';





    vm.activetab = $rootScope.activeTab;
    $rootScope.$watch('activeTab',function(){
        vm.activetab = $rootScope.activeTab;
    });




    $rootScope.$on('documentListUpdated',function(){
    var formData = {};
    window.addEventListener("dragstart",function(e){
      e = e || event;
      e.preventDefault();
    },false);
    window.addEventListener("dragover",function(e){
      e = e || event;
      e.preventDefault();
    },false);

    window.addEventListener("drop",function(e){
      e = e || event;
      e.preventDefault();
    },false);
    formData = formDataFactory.uploadedDocumentDetails;
    var key = formDataFactory.uploadedDocumentDetails.cisKey;
    angular.forEach(vm.customers,function(v){
      if(v.cisKey === key){
        angular.forEach(v.documents,function(v1, k1){
          if(formData.documentName == v1.documentTypeDetails.documentName){
            vm.activeDroppedDocumentType = v1.documentTypeDetails.documentName+v.cisKey;
            var doc = {
              "documentName" : formData.documentName,
              "documentId" : formData.documentId,
              "uploadedDocumentName" : formData.uploadedDocumentName,
              "documentStatus" : formDataFactory.uploadedDocumentDetails.documentStatus,
              "amount" : formDataFactory.uploadedDocumentDetails.amount,
              "processStatus" : "N/A",
              "uploadDate" : formDataFactory.uploadedDocumentDetails.uploadDate,
              "showDeleteButton" : true
            };
            var isDuplicate = isDuplicateDoc(v.documents, doc.uploadedDocumentName);
            if(!isDuplicate){
               $timeout(function() {
              v.documents[k1].showDocuments = true;
              v.documents[k1].documentUploaded.push(doc);
            },0);
            }else{
                 $timeout(function() {
                 formDataFactory.modalPopupMessage = "File "+doc.uploadedDocumentName+" is already uploaded. Please upload another file.";
                 vm.showWarningAlert();
            },0);
            }
          }

        });
      }
    });


      vm.noOfDocuments = vm.noOfDocuments + 1;


    } );

    vm.documentUploadSectionAccordion = function(docType){
      vm.activeDroppedDocumentType = docType;
     var key = docType;
     key = key.replace(/[^0-9]+/ig,"");
     var doc = docType.split(str);

    };








    function isDuplicateDoc(allDocs, uploadedDocName){
      for (index = 0, len = allDocs.length; index < len; ++index) {
        var docs = allDocs[index];
        for (j = 0, l = docs.documentUploaded.length; j < l; ++j) {
          var doc = docs.documentUploaded[j];
          if(doc.uploadedDocumentName === uploadedDocName){
            return true;
          }
        }
      }
      return false;
    }

        vm.showWarningAlert = function(){
              var modalInstance = $modal.open({
                backdrop: true,
                backdropClick: true,
                dialogFade: false,
                keyboard: true,
                templateUrl: 'views/modalPopup.html',
                  controller:'ModalPopupController'
              });
        };

    vm.populateScopeDocumentsList = function(index, value){
      vm.documents[index] = {};
      vm.documents[index].showDocuments = false;
      vm.documents[index].documentUploaded = [];
      vm.documents[index].documentTypeDetails = [];
      vm.documents[index].documentTypeDetails = value;
    };



    vm.showMoreThanSixDocuments = function(cisKeyValue){
    angular.forEach(vm.customers,function(v1){
      if(v1.cisKey === cisKeyValue){
        if(v1.showMoreLink){
            v1.showDocumentListLength = v1.documents.length;
       }else{
          v1.showDocumentListLength = 6;
       }
       v1.showMoreLink = !v1.showMoreLink;
      }
    });
  };


  vm.deleteDraggedDocument = function(draggedDocument, index, cisKey){
  var count= 0;
  angular.forEach(vm.customers, function(v1){
    if(v1.cisKey === cisKey){
    angular.forEach(v1.documents, function(v){
      if(v.documentTypeDetails.documentName == draggedDocument.documentName){
           v.documentUploaded.splice(index,1);
           if(v.documentUploaded.length >0){
             v.showDocuments = true;
           }else{
             v.showDocuments = false;
           }
      }
      if(!v.showDocuments){
          count = count + 1;;
      }
    });
  }
  });


  if(count > 0){
    vm.noOfDocuments = 0;
  }
};
$scope.setFiles = function(element) {
    vm.customers;
    var date = new Date();
    var day =  date.getDate();
    var month =  date.getMonth() + 1;
    date = (day<10 ? "0" : "")+ day + "/" + (month < 10 ? "0" : "")+ month + "/" + date.getFullYear();
    angular.forEach(vm.customers,function(v){
      angular.forEach(v.documents , function(v1){
        if(v1.documentTypeDetails.documentName === element.name){
          var doc = {
            "documentName" : v1.documentTypeDetails.documentName,
            "documentId" : '',
            "uploadedDocumentName" :  element.value,
            "documentStatus" : "To be uploaded",
            "amount" : "-",
            "processStatus" : "N/A",
            "uploadDate" : date
                            }
        v1.documentUploaded.push(doc);
        }
      })
    });
    };

    vm.uploadFiles = function(){
      vm.activeDroppedDocumentType = '';
      var count = 0;
      var atleastOneToBeUploaded = 0;
      NotificationService.clear();
      $timeout.cancel(vm.timer);

      if(formDataFactory.atleastOneDocumentUploaded){
      formDataFactory.uploadedDocumentDetails = angular.copy(vm.documents);
      //TODO - service call to upload data
      angular.forEach(vm.customers, function(v){
        angular.forEach(v.documents, function(v1){
          angular.forEach(v1.documentUploaded, function(v2){
          if(v2.documentStatus === "To be uploaded"){
            atleastOneToBeUploaded = atleastOneToBeUploaded + 1;
          }
        });
          if(v1.documentUploaded.length > 0){
            count = count + 1;
          }
        });
      });
      if(count === 0 || atleastOneToBeUploaded === 0){
        $location.hash('top');
         $anchorScroll();
        vm.isUploadingFilesFlag = false;
        NotificationService.custom("UploadAtleastOneDocument" , "Please upload minimum one document before submitting.","WARNING");
      }else{
          vm.isUploadingFilesFlag = true;
          vm.uploadTimer();
      }

    }else{
      $location.hash('top');
       $anchorScroll();
      NotificationService.custom("UploadAtleastOneDocument" , "Please upload minimum one document before submitting.","WARNING");
    }
    };


    vm.uploadTimer = function(){
      vm.timer = $timeout(function(){
        angular.forEach(vm.customers, function(v){
          angular.forEach(v.documents, function(v1){
            angular.forEach(v1.documentUploaded, function(v2){
            if(v2.documentStatus == "To be uploaded"){
              v2.documentStatus = "In progress";
              v2.showDeleteButton = false;
            }
          });
          });
        });
            vm.isUploadingFilesFlag = false;
            $location.hash('top');
             $anchorScroll();
      },4000);
    };


    vm.getDocuments = function() {

       vm.fetchedDocuments = [];
       vm.documents = [];
       vm.moreThanSixDocuments = [];
       vm.uploadedDocuments = [];
                   if (formDataFactory.defaultDocumentListStatus === "SUCCESS") {
                       vm.showDocumentsSection = true;
                       vm.isLoading = false;
                       vm.fetchedDocuments = formDataFactory.defaultDocumentListResponse;
                       angular.forEach(vm.fetchedDocuments , function(k){
                         if(k.docTypeId == 1000){
                           vm.populateScopeDocumentsList(0, k);
                         }else if(k.docTypeId == 1005){
                           vm.populateScopeDocumentsList(1, k);
                         }else if(k.docTypeId == 1001){
                           vm.populateScopeDocumentsList(2, k);
                         }else if(k.docTypeId == 1004){
                           vm.populateScopeDocumentsList(3, k);
                         }else if(k.docTypeId == 1003){
                           vm.populateScopeDocumentsList(4, k);
                         }else if(k.docTypeId == 1002){
                           vm.populateScopeDocumentsList(5, k);
                         }else {
                           vm.moreThanSixDocuments.push(k);
                         }
                       });
                       vm.moreThanSixDocuments.sort(function(a, b){
                         if(a.documentName < b.documentName) return -1;
                         if(a.documentName > b.documentName) return 1;
                         return 0;
                       });
                       angular.forEach(vm.moreThanSixDocuments, function(v , k){
                          vm.populateScopeDocumentsList( k + 6, v);
                       });
                   }else if(formDataFactory.defaultDocumentListStatus === "ERROR"){
                       vm.showDocumentsSection = false;
                     if(formDataFactory.defaultDocumentListResponse && formDataFactory.defaultDocumentListResponse.errors && formDataFactory.defaultDocumentListResponse.errors.length > 0){
                       angular.forEach(formDataFactory.defaultDocumentListResponse.errors,function(v){
                         NotificationService.custom('DocumentList',v.errorMessage,formDataFactory.defaultDocumentListStatus);
                       });
                     }else{
                       NotificationService.custom('DocumentList',formDataFactory.defaultDocumentListResponse,formDataFactory.defaultDocumentListStatus);
                     }

                   }
               angular.forEach(vm.customers, function(v){
                 v.documents = angular.copy(vm.documents);
                 v.showMoreLink = true;
                 v.showDocumentListLength = 6;
               });

   };





    vm.saveCreateFetchDocuments = function(){
      var saveAndCreatResponse = '';
      vm.customers = angular.copy(formDataFactory.createNewApplicationDetails.customerDetails);
      vm.applicationNumber = angular.copy(formDataFactory.createNewApplicationDetails.classApplicationNumber);
      var requestData = {};
      var customers = [];
      angular.forEach(vm.customers,function(v,k){
        var isPrimaryApplicant = "N";
        if(k == 0){
          isPrimaryApplicant = "Y";
        }
        var customer = {
          "name" : v.customerNameText,
          "cisKey" : v.cisKey,
          "isPrimaryApplicant" : isPrimaryApplicant
        };
        customers.push(customer);
      });
      requestData = {
        "arn" : vm.applicationNumber,
        "customer" : customers
      };

      window.addEventListener("dragstart",function(e){
        e = e || event;
        e.preventDefault();
      },false);
      window.addEventListener("dragover",function(e){
        e = e || event;
        e.preventDefault();
      },false);

      window.addEventListener("drop",function(e){
        e = e || event;
        e.preventDefault();
      },false);

        vm.fetchedDocuments = [];
        vm.documents = [];
        vm.moreThanSixDocuments = [];
        vm.uploadedDocuments = [];
      RestService.saveAndCreateNewCase(requestData).then(function (serviceResponse){
	      vm.showLoadingMessage = false;
        saveAndCreatResponse = serviceResponse.data;
        if(saveAndCreatResponse.status){
          if(saveAndCreatResponse.status.toUpperCase() === "ERROR"){
            vm.errorResponseFromCreateService = true;
            errorResponse = saveAndCreatResponse.errorResult.errors;
            angular.forEach(errorResponse,function(v){
              NotificationService.custom('CreateNewCase',v.errorMessage,saveAndCreatResponse.status.toUpperCase());
            });
          }else if(saveAndCreatResponse.status.toUpperCase() === "SUCCESS"){
           vm.errorResponseFromCreateService = false;
           vm.getDocuments();
          }
        }
      },function(errorResponse){
          vm.errorResponseFromCreateService = true;
          NotificationService.custom('CreateNewCase',"Create application service is unavailable. Please try again later.","ERROR");
      });
    };



    vm.saveCreateFetchDocuments();














}]);
