/**
 * Created by l058374 on 24/05/2016.
 */

docUpload.factory('formDataFactory',[function(){

return {
  createNewApplicationDetails : {
    classApplicationNumber : undefined,
    customerDetails : []
  },

  uploadedDocumentDetails : [],
  noOfDocuments : undefined,
  atleastOneDocumentUploaded : false,
  defaultDocumentList : undefined,
  defaultDocumentListErrorResponse : undefined,
  defaultDocumentListStatus : undefined,
  modalPopupMessage : undefined
}
}]);
