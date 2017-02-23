app.directive('popSelect',['$http', 'Folder', 'Article','FileService', function($http, Folder, Article, FileService) {
  return {
    restrict: 'E',
    scope:{},
    templateUrl: '/missionlife/app/template/pop_select.html',
    link: function (scope, element, attrs)
    {
      // in parent scope
      scope.setup = scope.$parent.$eval(attrs.setup);
      scope.callbackFn = scope.$parent.$eval(attrs.callbackFn);
      console.log('setup',scope.setup);
      scope.call = function(type, obj){
        if(type == 'file') { scope.selectedName = '/ '+obj.file_name; }
        if(type == 'article') { scope.selectedName = '/ '+obj.header; }
        scope.selected = {
          type: type,
          obj: obj
        }
        console.log('type', type);
        console.log('obj', obj);
      }

      scope.folders;
      scope.articles;
      scope.files;

      scope.currentFolder = null;
      scope.currentParents = [];
      scope.openFoldersInTree = [];
      scope.folderWindow = false;
      scope.editFolder = {};
      scope.new_folder = {};

      scope.selected = {};
      scope.selectedName = '';
      scope.getName = function(item){
        let displayName;


        return displayName;
      }

      scope.clickItem = function(type, item){
        scope.closeSelect();
        scope.callbackFn(type, item);
      }
      console.log(scope.setup);

      scope.$watch(
        function(){ return Folder.allFolders; },
        function(){ scope.folders = Folder.allFolders;},
      true);
      Folder.select_all();

      scope.$watch(
        function(){ return Article.selected; },
        function(){ scope.articles = Article.selected; scope.all_rows = Article.all_rows;},
      true);
      Article.load();

      const loadFiles = function(){
        FileService.selectByFolder({
          folder: 'folder',
          folder_id: scope.currentFolder.id,
          limit_min: 0,
          limit_max: 35
        },function(res){
          scope.files = res.data.result;
        });
      }

      const stopDefault = function(){
        event.stopPropagation();
        event.preventDefault();
      }
      const inFolderArray = function(id){
        let pos = scope.openFoldersInTree.indexOf(id);
        return {  open: pos >= 0, position: pos };
      }
      // ISSUE: After changes when article is created it jumps to parent Folder but saves Article to right folder

      // disable placing articles to null folder
      scope.isOpenFolder = function(){ return scope.currentFolder != null; }

      scope.openFolder = function(folder){
        if(folder == null){ scope.currentFolder = null; }
        else{
          const folderInArray = inFolderArray(folder.id);
          const folderIsCurrent = folder == scope.currentFolder;
          if(!folderIsCurrent){
            scope.currentFolder = folder;
            scope.currentParents = Folder.listParents(folder);
            loadFiles();
          }
          if(folderInArray.open && folderIsCurrent){
            scope.openFoldersInTree.splice(folderInArray.position, 1);
          }
          if(!folderInArray.open){
            scope.openFoldersInTree.push(folder.id);
          }
        }
        scope.selected = {};
        scope.selectedName = '';
        Article.Folder = scope.currentFolder;
        Article.load();
      }

      /* Folder Editor Window */
      scope.toogleEditFolder = function(){ scope.folderWindow = !scope.folderWindow; }
      scope.setEditFolder = function(folder){
        stopDefault(event);
        scope.editFolder = folder;
        scope.toogleEditFolder();
      }
      scope.setPosition = function(position){
        scope.editFolder.position = position;
        scope.updatePosition(scope.editFolder);
      }

      scope.isOpen = function(folder){
        return folder.id == scope.currentFolder.id;
      }
      // New Folder Object

      scope.saveNewFolder = function(){
        let data = scope.new_folder;
        data.parent = scope.currentFolder;
        Folder.insert(data, function(response){
          scope.new_folder.name = "";
        });
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
      scope.fileTypeClass = function(type){
        let str = '';
        switch (type) {
          case 'pdf' :
            str = 'fa fa-file-pdf-o';
            break;
          case 'doc' :
            str = 'fa fa-file-word-o';
            break;
          case 'png' :
            str = 'fa fa-file-image-o';
            break;
          case 'txt' :
            str = 'fa fa-file-text-o';
            break;
          default:
            str = 'fa fa-file-o'
        }
        return str;
      }
    }
  };
}]);
