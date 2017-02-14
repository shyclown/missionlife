app.directive('addArticle',['$http', function($http) {
  return {
    restrict: 'E',
    templateUrl: '/missionlife/app/template/explorer/add_article.html',
    link: function (scope, element, attrs)
    { }
  };
}]);
