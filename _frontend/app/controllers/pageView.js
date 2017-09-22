app.controller('pageView', function($scope, Ajax, $sanitize, $routeParams, $location){

    // display whole if only one else display headers and parts

    $scope.itemToShow = function(index, column){
      let rad = (index % $scope.columns == 0);
      let size = ($scope.garants >= (index + column));
      return rad && size;
    }
    $scope.linkModelFunc = function(url){

      $window.open(url);
    }
    $scope.sanit = function(str){return $sanitize(str);}
    $scope.perex = function(str){
      let perex = $scope.sanit(str).split(">", 2)[1];
      return $scope.sanit(perex).split("<", 2)[0];
    }
    $scope.lastOpen = false;
    $scope.toogleContent = function(article){
      if($scope.lastOpen != article){
        $scope.lastOpen.open = false;
        $scope.lastOpen = article;
      }
      if(!article.open){ article.open = false; }
        article.open = !article.open;
        $scope.lastOpen = article;
    }

});
