app.controller('foldersController',function($scope, Folder, $compile, $http){

  // display html responses if failed
  $scope.php = '';
  // Folder Explorer
  $scope.currentFolder = null;

  $scope.$watch(
    function(){ return $scope.currentFolder; },
    function(){ console.log($scope.currentFolder);},
  true);
  // Article Window
  $scope.newArticle = {};
  $scope.openArticle = {
    new: true,
    header: 'No Article',
    content: 'No Article is open please close this window to prevent errors',
    state: 0
  };

  $scope.openArticleWindow = true;
});
