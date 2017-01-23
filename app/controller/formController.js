app.controller('formController',function($scope, Folder, $compile, $http){

  // Form creators
  /*
  Form is sent to selected email adress and stored to database for review
  JSON - structure:
  { form name: Form Example,
    email: Reciever Email,
    data: {
      field: [
      { name: Field name, limit: MaxCharacters, type: limiType, order: fieldOrder },
      { name: Field name, limit: MaxCharacters, type: limiType, order: fieldOrder },
      { name: Field name, limit: MaxCharacters, type: limiType, order: fieldOrder },
      ]
    }
  }
  */
  const newForm = {
    name: 'new Form',
    email: 'email',
    data: { field: [] }
  }
  Form.load_all(function(response){ $scope.forms = response.data; });
  
});
