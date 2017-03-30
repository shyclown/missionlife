app.controller('articlePage', function($scope, Ajax, $sanitize, $routeParams, $location){
  const url = '/system/ajax.php';
  $scope.article = {};
  function loadArticle(id){
    Ajax.call({action: 'select_article', id: id}, url,
    function(res){
      $scope.article = res.data[0]; });
  }
  loadArticle($routeParams.articleID);

});
