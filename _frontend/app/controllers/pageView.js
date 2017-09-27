app.controller('pageView', function($scope, Ajax, $sanitize, $routeParams, $location){


    $scope.itemToShow = function(index, column){
      let rad = (index % $scope.columns == 0);
      let size = ($scope.garants >= (index + column));
      return rad && size;
    }
    $scope.linkModelFunc = function(url){ $window.open(url); }
    $scope.sanit = function(str){return $sanitize(str);}

    // display only first part of item
    $scope.perex = function(str){
      let perex = $scope.sanit(str).split(">", 2)[1];
      return $scope.sanit(perex).split("<", 2)[0];
    }

});
