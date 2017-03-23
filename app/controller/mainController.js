app.controller('mainController',function($http, Data , $scope, $route, $routeParams, $location){

  /* Route Info */
  $scope.$route = $route;
  $scope.$location = $location;
  $scope.$routeParams = $routeParams;

});
