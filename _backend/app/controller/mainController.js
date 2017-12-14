app.controller('mainController', function(Shared, $http, Data , $scope, $route, $routeParams, $location){

  /* Route Info */
  $scope.$route = $route;
  $scope.$location = $location;
  $scope.$routeParams = $routeParams;

  $scope.text = Shared.text;
});
