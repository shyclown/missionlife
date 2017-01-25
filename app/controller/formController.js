app.controller('formController',function($scope, Form, $compile, $http){

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
  const copy = function(object){ return Object.assign({},object); }
  $scope.editForm = {};
  $scope.newForm = {
    name: '',
    email: '',
    state: 0,
    data: '[]'
  }
  const sortByOrder = function(arr){
    arr.sort(function(a,b){ return a.order - b.order; });
  }
  const findByOrder = function(arr, order){
    arr.find(function(el){
      return el.order == order;
    })
  }
  $scope.switchOrder = {
    reorder: function(arr, obj, direction){
      const newOrder = obj.order + direction;
      switchObj = findByOrder(arr, newOrder);
      switchObj.order = obj.order;
      obj.order = newOrder;
      sortByOrder(arr);
    }
    up: function(arr, obj){ this.reorder(arr, obj, 1);},
    down: function(arr, obj){ this.reorder(arr, obj, -1);},
  }
  const json = {
    load: function(str){ return JSON.parse(str);},
    save: function(obj){ return JSON.stringify(obj);}
    sort: function(arr){ }
  }
  /* Edit Form */
  $scope.editFormWindow = false;
  $scope.editForm = {}

  $scope.formWindow = function(form){
    console.log(form);
    $scope.editForm = copy(form);
    $scope.editForm.data = JSON.parse($scope.editForm.data);
    console.log($scope.editForm.data);
  }
  $scope.addField = function(form){
    form.data.push({
      name: 'fieldName',
      type: 'fieldType',
      order: 'fieldOrder'
    });
  }


  const loadForms = function(){
    Form.select_all(function(response){
      $scope.forms = response.data;
    });
  }
  $scope.formStateText = function(form){
    return (form.state) ? 'active' : 'inactive';
  }
  $scope.changeState = function(form){
    form.state = !form.state;
    $scope.updateForm(form);
  }
  $scope.createNewForm = function(){
    Form.insert($scope.newForm, loadForms);
  }
  $scope.deleteForm = function(form){
    Form.delete(form, loadForms);

  }
  $scope.updateForm = function(form){
    Form.update_all(form);
  }
  loadForms();

});
