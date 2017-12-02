app.controller('formPage', function($scope, Ajax, Form, $sanitize, $routeParams, $location){

  console.log("controller","formPage");
  const url = '/system/ajax.php';
  $scope.response;
  $scope.message;
  $scope.form = {};
  $scope.input = {};



  $scope.formInvalid = function(){ return false; };
  $scope.submit = function(){
    console.log('submit');
    console.log($scope.item.obj);
    /* todo check data */
    /*
    function check(value, type){
      if(type == 'all'){ return true; }
      if(type == 'email'){}
      if(type == 'name'){}
      if(type == 'number'){}
    }
    */

    let data = {form: $scope.item.obj, data: $scope.input};
    console.log(data);
    data.form = JSON.stringify(data.form);
    data.data = JSON.stringify(data.data);
    Ajax.call(data, 'system/formEmail.php', function(res){
      console.log(res.data);
      $scope.response = res.data;
      $scope.$apply(); // important;
    });
  };
});
