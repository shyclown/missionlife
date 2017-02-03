app.controller('mainController',function($http, Data , $scope, $route, $routeParams, $location){

  $scope.page = {};
  /* Page Data */
  Data.select({ name:'settings' },function(res){
    res.data[0].data = JSON.parse(res.data[0].data);
    console.log(res.data[0]);
    $scope.settings = res.data[0];

    if(!$scope.settings){
      // Set drfault values
      $scope.settings = {
        name: 'settings',
        data:{
        page_name: 'Default page Name',
        page_motto: 'Default under Name'
        }
      }
      Data.insert( $scope.settings , function(res){
        $scope.settings.id = res.data; console.log('inserted');
        $scope.page = $scope.settings.data;
        console.dir($scope.page);
      });
    }else{ $scope.page = $scope.settings.data; console.dir($scope.page.page_name);}
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
