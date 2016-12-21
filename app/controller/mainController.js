app.controller('mainController',function($http, pageInfo, $scope, $route, $routeParams, $location){

  $scope.page = pageInfo.data;

  $scope.$route = $route;
  $scope.$location = $location;
  $scope.$routeParams = $routeParams;

  $scope.i = 0;
  $scope.pagename = pageInfo.data;


});
