app.controller('mainController',function($http, Data , $scope, $route, $routeParams, $location){

  $scope.page = {};
  /* Page Data */
  Data.select({ name:'settings' },function(res){
    console.log(res);
    if(!res.data){
      console.log('epty');
      $scope.settings = {
            name: 'settings',
            data:{
            page_name: 'Default page Name',
            page_motto: 'Default under Name'
            }
          }
          Data.insert( $scope.settings , function(res){
            $scope.settings.id = res.data;
            $scope.page = $scope.settings.data;
          });
    }else{
      res.data[0].data = JSON.parse(res.data[0].data);
      $scope.settings = res.data[0];
    }
    $scope.page = $scope.settings.data;
  });

  /* Route Info */
  $scope.$route = $route;
  $scope.$location = $location;
  $scope.$routeParams = $routeParams;

  $scope.changePageData = function(){
    $scope.settings.data = $scope.page;
    Data.update($scope.settings,function(res){console.log(res.data);});
  }
});
