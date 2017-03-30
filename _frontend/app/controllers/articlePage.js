app.controller('articlePage', function($scope, Ajax, Article, $sanitize, $routeParams, $location){
  const url = '/system/ajax.php';
  $scope.article = {};
  function loadArticle(id){
    Article.selectByID({id: id}, function(response){
      response.data[0].content = decodeURIComponent(response.data[0].content);
      $scope.article = response.data[0]; });
  }
  loadArticle($routeParams.articleID);

});
