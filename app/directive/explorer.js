app.directive('folderExplorer',['$http', 'Folder', 'Article', function($http, Folder, Article) {
  return {
    restrict: 'E',
    scope:{
      currentFolder: '=',
      openArticle: '='
    },
    templateUrl: '/missionlife/app/template/folder_window.html',
    link: function (scope, element, attrs)
    {
        const stopDefault = function(){ event.stopPropagation(); event.preventDefault();}
      // Watch Folders
      scope.folders;
      scope.$watch( function(){ return Folder.allFolders; }, function(){ scope.folders = Folder.allFolders;}, true);
      // Load Folders
      Folder.select_all();

      scope.currentParents = [];
      scope.articles = [];
      scope.openFoldersInTree = [];

      // Load Articles in Folder
      scope.$watch(
        function(){ return Article.selected; },
        function(){ scope.articles = Article.selected; scope.all_rows = Article.all_rows;},
      true);
      Article.load();
      const inFolderArray = function(id){
        let pos = scope.openFoldersInTree.indexOf(id);
        return {  open: pos >= 0, position: pos }
      }
      scope.isOpen = function(folder){
        return folder.id == scope.currentFolder.id;
      }
      // Click Event for Articles
      scope.selectArticle = function(article){
        scope.articleWindow = true;
        scope.openArticle = article;
      }
      // Click Event for New Article Button
      scope.createNewArticle = function(){
        scope.articleWindow = true;
        scope.openArticle = false;
      }
      scope.isOpenFolder = function(){ return scope.currentFolder != null; }
      scope.openFolder = function(folder){
        if(folder == null){ scope.currentFolder = null; }
        else{
          const folderInArray = inFolderArray(folder.id);
          const folderIsCurrent = folder == scope.currentFolder;
          if(!folderIsCurrent){
            scope.currentFolder = folder;
            scope.currentParents = Folder.listParents(folder);
            Article.Folder = folder;
            Article.load();
          }
          if(folderInArray.open && folderIsCurrent){
            scope.openFoldersInTree.splice(folderInArray.position, 1);
          }
          if(!folderInArray.open){
            scope.openFoldersInTree.push(folder.id);
          }
        }
      }
      // Delete article and reload list
      // todo: prompt panel question
      // todo: in php remove files too or set them to unused tag
      scope.deleteArticle = function(article){
        Article.delete(article, function(response){
          Article.load();
        });
      }

      // New Folder Object
      scope.new_folder = {};
      scope.saveNewFolder = function(){
        let data = scope.new_folder;
        data.parent = scope.currentFolder;
        Folder.insert(data, function(){ scope.new_folder.name = ""; });
      }
      scope.removeFolder = function(folder){
        stopDefault(event);
        Folder.remove(folder);
        Folder.select_all();
      }
      scope.orderUp = function(folder){ stopDefault(event);
        Folder.orderUp(folder);
      }
      scope.orderDown = function(folder){ stopDefault(event);
        Folder.orderDown(folder);
      }
      scope.updateName = function(folder){ stopDefault(event);
        Folder.updateName(folder);
      }
      scope.updatePosition = function(folder){ stopDefault(event);
        Folder.updatePosition(folder);
      }
      // CSS Style
      scope.currentOpen = function(folder){
        return (folder.id == scope.openFolder.id) ? 'currentFolder' : '';
      }
    }
  };
}]);

app.directive('folderTree',['$http','Folder', function($http, Folder) {
  return {
    restrict: 'E',
    templateUrl: '/missionlife/app/template/folder_tree.html',
    link: function (scope, element, attrs){}
  };
}]);
app.directive('folderOpen',['$http', function($http) {
  return {
    restrict: 'E',
    templateUrl: '/missionlife/app/template/folder_open.html',
    link: function (scope, element, attrs){}
  };
}]);
app.directive('folderTreeLine',['$http', function($http) {
  return {
    restrict: 'E',
    templateUrl: '/missionlife/app/template/folder_tree_line.html',
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
