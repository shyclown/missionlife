app.directive('folderExplorer',['$http', 'Folder', 'Article', function($http, Folder, Article) {
  return {
    restrict: 'E',
    scope:{ folders: '=foldersData' },
    templateUrl: '/missionlife/app/template/folder_window.html',
    link: function (scope, element, attrs)
    {
      scope.currentFolder = null;
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

      // New Folder Object
      scope.new_folder = {};
      scope.saveNewFolder = function(){
        let data = scope.new_folder;
        data.parent = scope.currentFolder;
        Folder.insert(data, function(){ scope.new_folder.name = ""; });
      }
      scope.removeFolder = function(folder){ stopDefault(event);
        Folder.remove(folder);
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
      console.log(scope.children);
      return (scope.openFoldersInTree.indexOf(scope.folder.id)>=0) ? 'fa fa-folder-open' : 'fa fa-folder'};
    }
  };
}]);

app.directive('articleWindow',['$http','Folder', function($http, Folder) {
  return {
    restrict: 'E',
    scope: {},
    templateUrl: '/missionlife/app/template/article_window.html',
    link: function (scope, element, attrs){
      scope.header = 'header';
      scope.content = 'content';
      console.log(scope);
      scope.elArticleHeader = document.getElementById('articleEditorHeader');
      scope.elArticleContent = document.getElementById('articleEditorContent');
      scope.elArticleContent.value = scope.content;
      scope.area = new Editor.area({
        input_id:'articleEditorContent',
        form_id:'articleEditorForm',
        // if AngularJS
        image_url : '/missionlife/uploads/image/',
      });


    }
  };
}]);
