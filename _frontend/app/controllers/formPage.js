app.controller('formPage', function($scope, Ajax, Form, $sanitize, $routeParams, $location){
  const url = '/system/ajax.php';
  $scope.response;
  $scope.message;
  $scope.form = {};
  $scope.input = {};
  function loadForm(id){
    Ajax.call({action: 'load_form', id: id}, url,
    function(res){

    });
  }
  console.log('controller');
  Form.selectByID($routeParams.formID, function(res){
    console.log(res);
    let form = res.data[0];
    form.data = JSON.parse(form.data);
    $scope.form = form;
  });
  $scope.formInvalid = function(){ return false};
  $scope.submit = function(){
    /* check data */
    function check(value, type){
      if(type == 'all'){ return true; }
      if(type == 'email'){}
      if(type == 'name'){}
      if(type == 'number'){}
    }
    let data = {form: $scope.form, data: $scope.input};
    console.log(data);
    Ajax.call(data, 'system/formEmail.php', function(res){ $scope.response = res.data});
  };
});
