/**
 * Created by l058374 on 16/05/2016.
 */

docUpload.controller('DashboardController',['RestService','$state','displayMessage','$scope','NotificationService','USER_ID','formDataFactory',function(RestService,$state,displayMessage,$scope,NotificationService,USER_ID,formDataFactory){

    var vm =this;
    vm.enteredHFM = '';
    vm.listOfARN = [];
    vm.arnDetails = [];
    vm.ARNListIsEmpty = true;
    vm.emptyARNListMessage = '';
    vm.showBackButton = false;
    vm.loggedInUserId = USER_ID;
    vm.userId = '';
    vm.showHFMErrorMessage = false;
    vm.HFMErrorMessage = '';
    vm.reverseSort = false;
    vm.pageMessages = angular.copy(displayMessage);
    vm.rangeOfPages = '0';
    vm.pagesToBeDisplayed = [];
    vm.rangeOfPageNumberDisplayed = 5;
    vm.showPaginationNextButton  = true;
    vm.showPaginationBackButton  = true;
    vm.nextClicked = false;
    vm.hasMoreThan1000Records = false;
    vm.storeARNList = [];
    vm.rowCount = 1;
    vm.noOfRecordsToBeFetchedAtOnce = 1000;
    vm.firstPageIndex = 1;
    vm.arnListServiceFetchStatus = '';
    vm.loanWriterPattern = /^[cCeE]{1}\d{6}/;
    vm.showLoading = false;
    vm.listOfCisKeysReq = [];
    vm.listOfCisKeysRes = [];
    vm.cisKeyPattern = /^\d+$/;
    vm.arnPattern =/^[a-zA-Z0-9]*$/;
  	vm.customerDetails = [ {
								'srNumber' : '1',
								'cisKey' : '',
								'customerNameText' : '',
								'displayDelete' : false,
								'isCisKeyVerified':false
							} ];
    vm.arn = '';
    vm.isArnValid = false;
    vm.isPrimaryKeyVerified = false;
    vm.activetabcordion = "View";
    vm.customerDetailsCopy= [];
    vm.showARNLoading = false;
    vm.showMandatoryMessageFlag = false;
    vm.mandatoryCisKeyEnteredFlag = false;
    vm.isArnLengthValid = false;
    vm.showMandatoryArnError = false;


    vm.orderByField = "lastUpdateDateParsed";
    vm.reverseSort = true;
    vm.proceedButtonClicked = false;
    vm.showSortingButtons = false;
    vm.showScrollBar = false;
    vm.duplicatedCisKey = "";



    vm.tabcordionClicked = function(tabcordion){
        vm.activetabcordion = tabcordion;
        NotificationService.clear();
        vm.arn = '';
        vm.isArnValid = false;
        vm.isPrimaryKeyVerified = false;
        vm.customerDetails = [ {
             'srNumber' : '1',
             'cisKey' : '',
             'customerNameText' : '',
             'displayDelete' : false,
             'isCisKeyVerified':false
             } ];

          if(tabcordion === "View"){
            vm.rowCount = 1;
            vm.firstPageIndex = 1;
	    vm.orderByField = "lastUpdateDateParsed";
            vm.reverseSort = true;
            vm.getListOfARNForLoggedInUser(vm.loggedInUserId,vm.rowCount,vm.firstPageIndex );
          }
                  } ;






    vm.addCustomerKeyRow = function() {
    	vm.customerDetails.push({
		'srNumber' : vm.customerDetails.length+1,
		'cisKey' : vm.customerDetails.cisKey,
		'customerNameText' : '',
		'displayDelete' : true,
		'isCisKeyVerified':false

	});
    };

    vm.deleteCustomerKeyRow = function(index) {
    	console.log("delete method called");
    	vm.customerDetails.splice(index,1);
    	data = vm.customerDetails;
    	for (var j=1; j < data.length; j++) {
	    	console.log("sr Number"+data[j].srNumber);
	    	data[j].srNumber=j+1;

	    }
    };

    vm.onCisKeyFocus = function(index){
      NotificationService.clear();
      vm.customerDetails[index].patternError = false;
      vm.customerDetails[index].mandatoryCisKeyEnteredFlag = false;
    };

    vm.validateLengthOfCiskeyField = function(index){
      angular.forEach(vm.customerDetails,function(v,k){
        if(k === index){
            v.patternError = (v.cisKey && v.cisKey.length !== 11);
        }
      });
    };


    vm.onChangeOfCisKey = function(index){
      NotificationService.clear();
      vm.customerDetails[index].patternError = false;
      vm.customerDetails[index].cisKeyTouched = true;
      vm.customerDetails[index].mandatoryCisKeyEnteredFlag = false;
      vm.customerDetails[index].customerNameText = '';
      if(vm.customerDetails && vm.customerDetails[index].cisKey){
      if(vm.customerDetails[index].cisKey.length === 11){
          vm.customerDetails[index].patternError = !vm.cisKeyPattern.test(vm.customerDetails[index].cisKey);
      }
      }else{
        vm.customerDetails[index].mandatoryCisKeyEnteredFlag = (index === 0);
      }
      if(vm.customerDetailsCopy && vm.customerDetailsCopy.length > 0 && (vm.customerDetailsCopy[index] && vm.customerDetailsCopy[index].cisKey !== vm.customerDetails[index].cisKey)){
        vm.customerDetails[index].customerNameText = '';
        vm.isPrimaryKeyVerified = false;
      }
    };

   function hasDuplicates(array) {
    return _.some(array, function(elt, index) {
        if(array.indexOf(elt) !== index){
            vm.duplicatedCisKey =elt;
          return true;
        }else{
          return false;
        }
    });
  };

   vm.verifyCiskey = function(){
     vm.customerDetailsCopy= vm.customerDetails;
     vm.listOfCisKeysReq = [];
     vm.isPrimaryKeyVerified=false;
     vm.makeVerifyCisKeyServiceCall = false;
     var enteredCisKeyList = [];
     angular.forEach(vm.customerDetails , function(v,k){
       enteredCisKeyList.push(v.cisKey);
       if(k === 0){
         if(v.cisKey !== undefined){
          v.mandatoryCisKeyEnteredFlag  = v.cisKey.length !== 11;
          vm.makeVerifyCisKeyServiceCall = (v.cisKey.length === 11 && !v.mandatoryCisKeyEnteredFlag );
         }
       }
         if(vm.makeVerifyCisKeyServiceCall && !v.patternError){
           vm.listOfCisKeysReq.push(v.cisKey);
       }
     });

     if(hasDuplicates(enteredCisKeyList)){
       NotificationService.custom("verifyCisKey", "The CIS key "+ vm.duplicatedCisKey +" is already verified . Please check and mention another CIS key.", "ERROR");
       return;
     }else{
       NotificationService.clear();
     if(vm.listOfCisKeysReq && vm.listOfCisKeysReq.length > 0){
     		RestService.verifyCisKeys(vm.listOfCisKeysReq).then(function(response){
	    	 vm.listOfCisKeysRes=[];
	         vm.verifyCisKeysStatus = response.data.status;
	         if(response.data.status && response.data.status.toUpperCase() === "SUCCESS") {
	        	 vm.listOfCisKeysRes =  response.data.successResult.cisKeysList;
	        	 var data1 = vm.customerDetails;
	        	 var data2 = vm.listOfCisKeysRes;
		        	 for (var i=0; i < data1.length; i++) {
		     	    	for (var j=0; j < data2.length; j++) {
			     	    	if(data1[i].cisKey== data2[j].cisKey){
                    data1[i].isCisKeyVerified = data2[j].isCisKeyVerified;
                    if(data1[i].cisKey ){
			     	    		if(data2[j].isCisKeyVerified ){
			     	    			data1[i].customerNameText = data2[j].customerName;
			     	    		}else{
			     	    			data1[i].customerNameText = data2[j].message;
			     	    		}
                  }
			     	    	}
			     	    	if(data1[i].srNumber==1 && data1[i].cisKey== data2[j].cisKey && data2[j].isCisKeyVerified){
			     	    		vm.isPrimaryKeyVerified=true;
			     	    		vm.showMandatoryMessageFlag = false;
			     	    	}
		     	    }
	     	    }
             vm.customerDetails = angular.copy(data1);
           }
	       else if(response.data.status && response.data.status.toUpperCase() === "ERROR"){
                 NotificationService.clear();
                 angular.forEach(response.data.errorResult.errors, function (k){
                 NotificationService.custom("verifyCisKey", k.errorMessage, response.data.status.toUpperCase());
                 });
             }
	     },function(errorResponse){
             vm.showLoading = false;
             NotificationService.clear();
             var error = displayMessage.doc_service_unavailable;
             NotificationService.custom("verifyCisKey", error, "ERROR");
         }
	     );
     	}
    }
   };





  /* vm.onCisKeyChange=function(index){
	   console.log("onCisKeyChange method called");
	   data = vm.customerDetails;
	   dataCopy = vm.customerDetailsCopy;
	   cisKey = data[index].cisKey;
	   if(cisKey!=undefined && cisKey==11){
		   console.log("onCisKeyChange cisKey11 block");
		   if(dataCopy[index].cisKey == cisKey){
			   console.log("onCisKeyChange cisKey equals cisKey block");
			   vm.isPrimaryKeyVerified = true;
		   }else{
			   console.log("onCisKeyChange cisKey not equals to cisKey block");
			   vm.isPrimaryKeyVerified = false;
		   }
	   }else if(cisKey!=undefined && cisKey<11){
		   console.log("onCisKeyChange cisKey is less than 11 block");
		   vm.isPrimaryKeyVerified = false;
	   }else if(cisKey==undefined){
		   vm.isPrimaryKeyVerified = false;
	   }else{
		   console.log("onCisKeyChange else block");
		   vm.isPrimaryKeyVerified = false;
	   }


   };*/




    /* Search by ARN, HFM or CIS Key.
     Service call will be made based on the type of the search criteria. */
    vm.searchBy = function(searchValue){

        if (searchValue == 'HFM') {
            if(vm.enteredHFM == '' || angular.isUndefined(vm.enteredHFM )){
                vm.showHFMErrorMessage = true;
                vm.HFMErrorMessage = 'Please enter a HFM';
            }else {
                vm.rowCount = 1;
                vm.firstPageIndex = 1;
                vm.showHFMErrorMessage = false;
                vm.listOfARN = [];
                vm.getListOfARNForLoggedInUser(vm.enteredHFM,vm.rowCount,vm.firstPageIndex );
            };
        };
    };


    /* This function will be called as soon as the dashboard-controller.js is loaded.
     This will make a service call to fetch the list of ARN for that particular logged in HFM salary id. */
    vm.getListOfARNForLoggedInUser = function(user_Id,counter,page) {
        //vm.arnListServiceFetchStatus == '';
        vm.arnDetails =[];
        if(user_Id) {
            vm.showHFMErrorMessage = false;
            user_Id = user_Id.toUpperCase();
            if(counter ==1 ) {
                vm.pagesToBeDisplayed = [];
                vm.rangeOfPages = '0';
                vm.listOfARN = [];
                vm.arnListServiceFetchStatus = '';
            }

            vm.showLoading = (vm.arnListServiceFetchStatus == ''); //Simplified If condition
            RestService.getListOfARn(user_Id,counter).then(function(response){
                    vm.arnListServiceFetchStatus = response.data.status;
                    vm.showLoading = (vm.arnListServiceFetchStatus == ''); //Simplified If condition
                    var errors;
                    if(response.data.status && response.data.status.toUpperCase() == "SUCCESS") {
                        NotificationService.clear();
                        vm.listOfARN =  vm.listOfARN.concat(response.data.successResult.arnDetails);
                        vm.showSortingButtons = (vm.listOfARN && vm.listOfARN.length > 1);
                        vm.showScrollBar = (vm.listOfARN && vm.listOfARN.length > 10);

                        vm.hasMoreThan1000Records = response.data.successResult.hasMoreRecords;
                        angular.forEach(vm.listOfARN, function (key, value) {
                          var c =[];

                                var names = [];
                                var stringNames = '';
                                if (key.customer.length > 1) {
                                    angular.forEach(key.customer, function (key1) {
                                        names.push(key1.name);
                                    });
                                    angular.forEach(names, function (kk) {
                                        stringNames = kk + ' / ' + stringNames;
                                    });
                                    stringNames = stringNames.substr(0, stringNames.length - 2);
                                } else {
                                    stringNames = key.customer[0].name;
                                }
                                key.displayNames = stringNames;
                                c = key.lastUpdate.split("/");
                                c = c[1] + "/" + c[0] + "/" + c[2];
                                key.lastUpdateDateParsed = Date.parse(c);
                                vm.arnDetails.push(key);

                        });
                        // if(vm.listOfARN  && (vm.listOfARN.length >= counter + vm.noOfRecordsToBeFetchedAtOnce )){
                        //     vm.hasMoreThan1000Records = true;
                        // }else{
                        //     vm.hasMoreThan1000Records = false;
                        // }
                        //vm.rangeOfPages = parseInt(vm.rangeOfPages) + response.data.successResult.arnDetails.length/10;
                        //vm.rangeOfPages = vm.rangeOfPages.toString();

                        //if(vm.listOfARN && (vm.listOfARN.length % 10 != 0)){
                        //    vm.rangeOfPages = parseInt(vm.rangeOfPages)  + 1;
                      //  }

                        /*if(counter ==1 ) {
                            for(var i = 1;i<=vm.rangeOfPages; i++ ){
                                if(i <  6){
                                    var pageDetails = {
                                        "id" : i,
                                        "selected" : false
                                    };
                                    vm.pagesToBeDisplayed.push(pageDetails);
                                }
                            }
                            vm.showPaginationBackButton = false;
                            vm.showPaginationNextButton = (vm.rangeOfPages > 5);
                        }else{
                            vm.showPaginationBackButton = true;
                        }*/

                        if (vm.listOfARN && (vm.listOfARN.length > 0)) {
                            vm.ARNListIsEmpty = false;
                        } else {
                            vm.ARNListIsEmpty = true;
                            vm.emptyARNListMessage = displayMessage.Empty_ARN_List;
                        }

                        //vm.getCurrentTenRecords(page);
                    }else if(response.data.status && response.data.status.toUpperCase() == "ERROR"){
                        NotificationService.clear();
                        angular.forEach(response.data.errorResult.errors, function (k){
                          NotificationService.custom("loggedInUserARNList", k.errorMessage, response.data.status.toUpperCase());
                        });
                    }else if(response.data.status && response.data.status.toUpperCase() == "WARNING"){
                        NotificationService.clear();
                        angular.forEach(response.data.errorResult.errors, function (k){
                          NotificationService.custom("loggedInUserARNList", k.errorMessage, response.data.status.toUpperCase());
                        });
                    }
                },function(){
                    vm.showLoading = false;
                    NotificationService.clear();
                    var error = displayMessage.retrieve_arn_list_service_error;
                    NotificationService.custom("loggedInUserARNList", error, "ERROR");
                }
            );
            vm.showBackButton = !(user_Id == vm.loggedInUserId); //Simplified If
            vm.showIdOfUser(user_Id);
        }
    };


    /* This function will be called as when user clicks on the next button of pagination. */
  /*  vm.getNextTenRecords = function(){
        var page = 0;
        vm.showPaginationBackButton = true;
        var arrayOfIds = [];
        var refreshPagesToBeDisplayed;
        var fetchNextRecords = false;
        angular.forEach(vm.pagesToBeDisplayed, function (key) {
            arrayOfIds.push(key.id);
            if(key.selected == true){
                page = key.id + 1;

            }
        });

        refreshPagesToBeDisplayed = (arrayOfIds.indexOf(page) == -1);

        if(refreshPagesToBeDisplayed){
            var addPageDetails = {
                "id" : page,
                "selected" : true
            };
            vm.pagesToBeDisplayed.push(addPageDetails);
            vm.pagesToBeDisplayed.shift();
        }
        if((page) >= vm.rangeOfPages ){
            vm.showPaginationNextButton = false;
            if(vm.hasMoreThan1000Records){
                //service call to fetch new set of 1000 records
                vm.rowCount = vm.rowCount + vm.noOfRecordsToBeFetchedAtOnce;
                vm.showPaginationNextButton = true;
                if(page > vm.rangeOfPages){
                    fetchNextRecords = true;
                    vm.getListOfARNForLoggedInUser(vm.loggedInUserId,vm.rowCount,page);
                }else{
                    fetchNextRecords = false;
                }
            }else{
                vm.showPaginationNextButton = false;

            }

        }else{
            vm.showPaginationNextButton = true;

        }
        if(!fetchNextRecords){
            vm.getCurrentTenRecords(page);
        }


    };*/

    /* This function will be called as when user clicks on the back button of pagination. */
  /*  vm.getPreviousTenRecords = function(){
        var page = 0;
        var arrayOfIds = [];
        var refreshPagesToBeDisplayed;
        angular.forEach(vm.pagesToBeDisplayed, function (key) {
            arrayOfIds.push(key.id);
            if(key.selected == true){
                page = key.id - 1;
            }
        });

        refreshPagesToBeDisplayed = (arrayOfIds.indexOf(page) == -1);//Simplified If

        if(refreshPagesToBeDisplayed){
            var addPageDetails = {
                "id" : page,
                "selected" : true
            };
            vm.pagesToBeDisplayed.unshift(addPageDetails);
            vm.pagesToBeDisplayed.pop();
        }
        vm.showPaginationBackButton = !((page) == 1 );//Simplified If
        vm.getCurrentTenRecords(page);
    };*/

    /* This function will be called as when user clicks on the one particular page button of pagination. */
    /*vm.getCurrentTenRecords = function(page){
        var start;
        var stop;
        if((page) >= vm.rangeOfPages /*&& !vm.showPaginationNextButton){
            vm.showPaginationNextButton = false;
            vm.showPaginationBackButton = (page != 1);
        }else{
            vm.showPaginationBackButton = !(page == 1) ;
            vm.showPaginationNextButton = true;
        }
        angular.forEach(vm.pagesToBeDisplayed, function (key) {
            key.selected = (key.id == page );
        });
        page = page.toString().concat("0");
        stop = parseInt(page);
        stop = stop - 1;
        start = stop - 9;
        vm.populateTenRecordsToDisplay(start,stop,"pageNumber",page);
    };*/

    /* This function will be called on any button click of pagination. It populates the ew set of 10 records to be displayed in the table. */
  /*  vm.populateTenRecordsToDisplay = function(start,stop,action) {
        vm.arnDetails = [];
        if(action == 'next'  && stop > vm.listOfARN.length && ((stop - vm.listOfARN.length)< 10 )){
            vm.showPaginationNextButton = false;
            stop = vm.listOfARN.length;
        }

        angular.forEach(vm.listOfARN, function (key, value) {
          var c =[];
            if (value >= start && value <= stop) {
                var names = [];
                var stringNames = '';
                if (key.customer.length > 1) {
                    angular.forEach(key.customer, function (key1) {
                        names.push(key1.name);
                    });
                    angular.forEach(names, function (kk) {
                        stringNames = kk + ' / ' + stringNames;
                    });
                    stringNames = stringNames.substr(0, stringNames.length - 2);
                } else {
                    stringNames = key.customer[0].name;
                }
                key.displayNames = stringNames;
                c = key.lastUpdate.split("/");
                c = c[1] + "/" + c[0] + "/" + c[2];
                key.lastUpdateDateParsed = Date.parse(c);
                vm.arnDetails.push(key);
            }
        });

    };
*/
    /* This function will be called when ARN link is clicked.
     The page will navigate to the next page (New/Upload/Manual) with the document type list for the clicked ARN. */
    vm.createNewCase = function(){
        $state.go('root.createNew');
    };


    vm.saveAndCreate = function(){
      vm.proceedButtonClicked = true;
      formDataFactory.createNewApplicationDetails.classApplicationNumber = vm.arn;

      var listOfCisKeys = angular.copy(vm.customerDetails);
      var verifiedListOfCisKeys = {};
      formDataFactory.createNewApplicationDetails.customerDetails = [];
        angular.forEach(listOfCisKeys,function(v){
            if(v.isCisKeyVerified){
                verifiedListOfCisKeys = v;
                formDataFactory.createNewApplicationDetails.customerDetails.push(verifiedListOfCisKeys);
            }
        });


      $state.go('root.createNew');
    };

    /* This function will be called on click of Search button and on default landing page.
     It is used to display the id of the searched HFM or logged in HFM. */
    vm.showIdOfUser = function(user_Id){
        vm.userId = user_Id.toUpperCase();
    };


    vm.clearArnRelatedScreenErrors = function(){
        NotificationService.clear();
        vm.isArnLengthValid = false;
    };

    vm.onArnFieldChange = function(){
      vm.showMandatoryArnError = false;
      vm.isArnLengthValid = false;
      if(vm.arn){
          if(vm.arn.length === 7 && !vm.arnPattern.test(vm.arn)){
                vm.isArnLengthValid = true;
          }
        }else{
            vm.showMandatoryArnError = true;
          }
    };



    vm.validateARN = function(){
        vm.isArnValid = false;
        if(vm.arn && vm.arn.length === 7 && !vm.isArnLengthValid){
        vm.showARNLoading = true;
        console.log("inside if block arn length"+this.arn.length);
        RestService.validateARN(this.arn).then(function(response){
                    if(response.data.status && response.data.status.toUpperCase() == "SUCCESS") {
                        NotificationService.clear();
                        NotificationService.custom("validateARN", displayMessage.arn_is_already_exist ,"ERROR");
                        vm.isArnValid = false;
                        vm.showARNLoading = false;
                    }else if(response.data.status && response.data.status.toUpperCase() == "ERROR"){
                        NotificationService.clear();
                        vm.isArnValid = true;
                        vm.showARNLoading = false;
                    }
                },function(errorResponse){
                    vm.showARNLoading = false;
                    NotificationService.clear();
                    var error = displayMessage.doc_service_unavailable;
                    NotificationService.custom("validateARN", error ,"ERROR");
                }
            );
        }else{
          vm.isArnLengthValid = true;
         	vm.isArnValid = false;
        }
    };
    //fetch default document list

    vm.fetchDefaultDocumentList = function(){
      if(angular.isUndefined(formDataFactory.defaultDocumentListStatus)){
      RestService.getDocuments().then(function(response){
        if(response && response.data && response.data.status){
          formDataFactory.defaultDocumentListStatus = response.data.status.toUpperCase();
          if(response.data.status.toUpperCase() === "SUCCESS"){
            formDataFactory.defaultDocumentListResponse = response.data.successResult;
          }else if(response.data.status.toUpperCase() === "ERROR"){
            formDataFactory.defaultDocumentListResponse = response.data.errorResult;
          }
        }
      }, function(errorResponse){
        formDataFactory.defaultDocumentListStatus = "ERROR";
        formDataFactory.defaultDocumentListResponse = "Service to fetch the document list is unavailable. Please try again later.";
      });
      }
    };



    vm.getListOfARNForLoggedInUser(vm.loggedInUserId,vm.rowCount,vm.firstPageIndex );
    vm.fetchDefaultDocumentList();



}]);
