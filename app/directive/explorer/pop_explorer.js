app.directive('popFolderExplorer',['$http','Form','Shared', 'Folder', 'Article', 'Garant','FileService','uploadDropped',
function($http, Form, Shared, Folder, Article, Garant, FileService, uploadDropped) {
  return {
    restrict: 'E',
    scope:{
    },
    templateUrl: '/missionlife/app/template/pop_folder_window.html',
    link: function (scope, element, attrs)
    {

      scope.currentFolder = Shared.currentFolder;
      scope.folders = [];
      scope.articles = [];
      scope.files = [];
      scope.currentParents = [];
      scope.openFoldersInTree = [];
      // Article and File can be changed updated in outside directive
      scope.$watch( function(){ return Article.selected; }, function(){ scope.articles = Article.selected;}, true);
      scope.$watch( function(){ return FileService.selected; }, function(){ scope.files = FileService.selected;}, true);
      scope.$watch( function(){ return Folder.allFolders; }, function(){ scope.folders = Folder.allFolders;}, true);
      // Load Folders
      Folder.select_all();
      const stopDefault = function(){ event.stopPropagation(); event.preventDefault(); }


      /* Folder Editor Window */

      scope.folderWindow = false;
      scope.editFolder = {};
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

      scope.new_folder = {};
      scope.saveNewFolder = function(){
        let data = scope.new_folder;
        data.parent = scope.currentFolder;
        Folder.insert(data, function(response){
          scope.new_folder.name = "";
        });
      }

      /* Form Window Data */

      scope.formWindow = false;
      scope.openForm = false;
      scope.openFormWindow = function(form){
        scope.openForm = form;
        console.log(scope.openForm);
        scope.formWindow = true;
      }
      const loadForms = function(){
        Form.selectByFolder({folder_id: Shared.currentFolder.id},function(response){
          scope.forms = response.data.result;
          console.log(scope.forms);
        })
      }
      scope.afterFormWindow = function(){
        loadForms();
      }

      /* Garant Window */

      scope.garantWindow = false;
      scope.openGarant = false;
      scope.openGarantWindow = function(garant){
        console.log(garant);
        scope.openGarant = garant;
        scope.garantWindow = true;
      }
      const loadGarants = function(){
        Garant.selectByFolder({folder_id: Shared.currentFolder.id},function(response){
          scope.garants = response.data.result;
          console.log(scope.garants);
        })
      }
      scope.afterGarantWindow = function(){ loadGarants(); }

      /* Article Window Data */

      scope.articleWindow = false;
      scope.openArticle = {
        new: true,
        header: 'No Article',
        content: 'No Article',
        state: 0 };
      scope.newArticle = {};

      scope.selectArticle = function(article){
        scope.articleWindow = true;
        scope.openArticle = article;
      }

      scope.createNewArticle = function(){
        Article.insert({
          header: 'New Article',
          content: '<p>Content</p>',
          folder_id: scope.currentFolder.id,
          state: 0 },
          function( response ){
          Article.select_by_id({id: response.data},
            function(ArticleByID){
            scope.openArticle = ArticleByID.data[0]; // data[0], because ajax returns array of results
            scope.articleWindow = true;
          });
        })
      }

      /* File Upload On Drop */

      scope.uploadFile = function(){
        const files = event.dataTransfer.files;
        const all = files.length;
        const oData = function(response){
          return { file_id: response.data.file_id, folder_id: scope.currentFolder.id }
        }
        const refreshFiles = function(update){
          const fn = function(){ if(update){ FileService.refresh(function(){ scope.$apply(); }); } }
          return fn;
        }
        // refres only after all filea are uploaded
        let completed = 0;
        for (let i = 0; i < all; i++){ let file = [files[i]];
          uploadDropped(file, false, function(response){
            let update = completed == all;
            FileService.attachToFolder( oData(response), refreshFiles(update));});
        }
      }

      /* Folders */

      scope.isOpenFolder = function(){ return scope.currentFolder != null; }
      scope.openFolder = function(folder){
        const inFolderArray = function(id){
          let pos = scope.openFoldersInTree.indexOf(id);
          return {  open: pos >= 0, position: pos };
        }
        if(folder == null){
          scope.currentFolder = folder;
          Shared.currentFolder = folder;
        }
        else{
          const folderInArray = inFolderArray(folder.id);
          const folderIsCurrent = folder == scope.currentFolder;
          if(!folderIsCurrent){
            Shared.currentFolder = folder;
            scope.currentFolder = folder;
            scope.currentParents = Folder.listParents(folder);
          }
          if(folderInArray.open && folderIsCurrent){
            scope.openFoldersInTree.splice(folderInArray.position, 1);
          }
          if(!folderInArray.open){ scope.openFoldersInTree.push(folder.id); }

          // Load forms
          loadForms();
          loadGarants();
        }
      }
      scope.isOpen = function(folder){ return folder.id == scope.currentFolder.id; }
      scope.removeFolder = function(folder){ stopDefault(event); Folder.remove(folder); }
      scope.orderUp = function(folder){ stopDefault(event); Folder.orderUp(folder); }
      scope.orderDown = function(folder){ stopDefault(event); Folder.orderDown(folder); }
      scope.updateName = function(folder){ stopDefault(event); Folder.updateName(folder); }
      scope.updatePosition = function(folder){ stopDefault(event); Folder.updatePosition(folder); }
      // CSS Style
      scope.currentOpen = function(folder){ return (folder.id == scope.openFolder.id) ? 'currentFolder' : ''; }
    }
  };
}]);
