/*
POP UP Select
Select item to callback function provided
*/

app.directive('popSelect',['$http', 'Shared', 'Folder', 'Article','Form','FileService',
function($http, Shared, Folder, Article, Form, FileService) {
  return {
    restrict: 'E',
    scope:{},
    templateUrl: '/_backend/app/template/popup/pop_select.html',
    link: function (scope, element, attrs)
    {

      const oSelectWindow = Shared.openElement[attrs.editObj];
      const oSetup = oSelectWindow.item;
      const oCallback = oSelectWindow.callback;
      const setup = oSetup;
      scope.setup = setup;

      scope.folders;
      scope.forms;
      scope.articles;
      scope.files;
      scope.currentFolder = null;
      scope.cancel = function(){ oSelectWindow.close();  }

      scope.$watch(
        function(){ return Folder.allFolders; },
        function(){ scope.folders = Folder.allFolders;},
      true);
      scope.$watch(
        function(){ return scope.currentFolder; },
        function(){
          if( scope.currentFolder != null ){ loadItems(); }
          else { resetItems(); }
      },true);

      Folder.select_all();

      const loadItems = function(){


        console.log(setup);
        scope.currentParents = Folder.listParents(scope.currentFolder);
        scope.selected = false;
        scope.selectedName = '';

        scope.articles = [];
        scope.files = [];
        scope.forms = [];
        scope.images = [];

        if(setup.articles){ loadArticles(); }
        if(setup.files){ loadFiles();  }
        if(setup.forms){ loadForms(); }
      }

      const resetItems = function(){
        scope.currentFolder = null;
        scope.currentParents = [];
        scope.openFoldersInTree = [];
        scope.folderWindow = false;
        scope.editFolder = {};
        scope.new_folder = {};
        scope.selected = false;
        scope.selectedName = '';
      }
      const stopDefault = function(){
        event.stopPropagation();
        event.preventDefault();
      }
      const loadArticles = function(){
        Article.selectByFolder(
          { folder_id: scope.currentFolder.id, },
          function(res){ scope.articles = res.data.result; }
        );
      }
      const loadFiles = function(){
        FileService.selectByFolder(
          { folder_id: scope.currentFolder.id, },
          function(res){
            scope.files = res.data.result;
            scope.images = scope.files.filter(function(img){ return img.file_type == 'png'; });
          }
        );
      }
      const loadForms = function(){
        Form.selectByFolder(
          { folder_id: scope.currentFolder.id, },
          function(res){ scope.forms = res.data.result; }
        );
      }


      // columns
      scope.getNumber = function(num){
          let arr = []; let i = 0; while(i != num){
            arr.push(i); i++; }
          return arr;
      }
      scope.columns = 2;
      //-----------------------------------------------------
      // Selected
      //-----------------------------------------------------

      scope.call = function(type, obj){
        if(type == 'file') { scope.selectedName = '/ '+obj.file_name; }
        if(type == 'article') { scope.selectedName = '/ '+obj.header; }
        scope.selected = { type: type, obj: obj }
        switch (type) {
          case 'file':
            scope.selected.path = 'uploads';
            scope.selected.target = obj.file_src;
            scope.selected.name = obj.file_name;
            break;
          case 'article':
            scope.selected.path = 'article';
            scope.selected.target = obj.id;
            scope.selected.name = obj.header;
            break;
          case 'form':
            scope.selected.path = 'form';
            scope.selected.target = obj.id;
            scope.selected.name = obj.name;
            break;
          case 'folder':
            scope.selected.path = 'folder';
            scope.selected.target = obj.id;
            scope.selected.name = obj.name;
          break;
          default:
        }
      }
      scope.submitFn = function(){
        console.log(scope.setup.selectFolder);
        if(scope.setup.selectFolder){
          scope.call('folder', scope.currentFolder);
        }
        if(!scope.selected){ alert('Nothing Was Selected'); }
        else{ oCallback(scope.selected); scope.cancel();}
      }

      scope.getName = function(item){  let displayName;  return displayName; }
      scope.clickItem = function(type, item){  scope.closeSelect();  scope.callbackFn(type, item); }
      scope.isOpenFolder = function(){ return scope.currentFolder != null; }
      scope.openFolder = function(folder){ scope.currentFolder = folder;  if(folder != null){ folderTreeUpdate(folder); } }

      /* Updates folder tree array */
      const folderTreeUpdate = function(folder)
      {
        const inFolderArray = function(id){
          let pos = scope.openFoldersInTree.indexOf(id);
          return {  open: pos >= 0, position: pos };
        }
        const folderInArray = inFolderArray(folder.id);
        const folderIsCurrent = folder == scope.currentFolder;
        if(folderInArray.open && folderIsCurrent){
          scope.openFoldersInTree.splice(folderInArray.position, 1);
        }
        if(!folderInArray.open){
          scope.openFoldersInTree.push(folder.id);
        }
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
      scope.removeFolder = function(folder){ stopDefault(event); Folder.remove(folder); }
      scope.orderUp = function(folder){ stopDefault(event); Folder.orderUp(folder); }
      scope.orderDown = function(folder){ stopDefault(event); Folder.orderDown(folder); }
      scope.updateName = function(folder){ stopDefault(event); Folder.updateName(folder); }
      scope.updatePosition = function(folder){ stopDefault(event); Folder.updatePosition(folder); }

      // CSS Style
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
      scope.currentOpen = function(folder){
        return (folder.id == scope.openFolder.id) ? 'currentFolder' : '';
      }
    }
  };
}]);
