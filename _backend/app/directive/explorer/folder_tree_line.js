app.directive('folderTreeLine',['$http', function($http) {
  return {
    restrict: 'E',
    templateUrl: '/_backend/app/template/explorer/folder_tree_line.html',
    link: function (scope, element, attrs)
    {
      scope.folder.open = false;
      scope.icon = function(){
      const theChildren = function(child){ return child.parent == scope.folder.id; }
      scope.children = scope.folders.filter(theChildren);
      return (scope.openFoldersInTree.indexOf(scope.folder.id)>=0) ? 'fa fa-folder-open' : 'fa fa-folder'};
    }
  };
}]);
