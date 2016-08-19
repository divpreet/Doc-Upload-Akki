docUpload.controller('ModalPopupController',['$scope','$modalInstance', 'formDataFactory',function($scope,$modalInstance, formDataFactory){
	$scope.close = function(){
		$modalInstance.close();
	};

	$scope.message = formDataFactory.modalPopupMessage;

}]);