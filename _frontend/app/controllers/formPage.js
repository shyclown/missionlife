app.controller('formPage', function($scope, Ajax, Form, $sanitize, $routeParams, $location){
  const url = '/system/ajax.php';
  $scope.response;
  $scope.message;
  $scope.form = {};
  $scope.input = {};


  Form.selectByID($routeParams.formID, function(res){
    let form = res.data[0];
    form.data = JSON.parse(form.data);
    $scope.form = form;
    $scope.$apply(); // important;
  });
  $scope.formInvalid = function(){ return false; };
  $scope.submit = function(){
    /* todo check data */
    /*
    function check(value, type){
      if(type == 'all'){ return true; }
      if(type == 'email'){}
      if(type == 'name'){}
      if(type == 'number'){}
    }
    */
    let data = {form: $scope.form, data: $scope.input};
    console.log(data);
    Ajax.call(data, 'system/formEmail.php', function(res){
      $scope.response = res.data;
      $scope.$apply(); // important;
    });
  };
});
