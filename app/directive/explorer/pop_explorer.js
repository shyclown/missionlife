app.directive('popFolderExplorer',['$http','Shared', 'Folder', 'Article','FileService','uploadDropped', function($http, Shared, Folder, Article, FileService, uploadDropped) {
  return {
    restrict: 'E',
    scope:{
    },
    templateUrl: '/missionlife/app/template/pop_folder_window.html',
    link: function (scope, element, attrs)
    {
      scope.currentFolder = Shared.currentFolder;
      scope.articleWindow = false;
      scope.openArticle = {
        new: true,
        header: 'No Article',
        content: 'No Article',
        state: 0 };
        console.log(scope.openArticle);
      scope.newArticle = {};

      const callbackFn = scope.$eval(attrs.callbackFn);
      const popSetup = {
        articles: false,
        article_click: false,
        files: false,
        file_click: false,
        submit: true
      }

      scope.formWindow = false;
      scope.openForm = false;
      scope.openFormWindow = function(){
        console.log('open');
        scope.formWindow = true;
      }

      // Watch Folders
      scope.folders;
      scope.currentParents = [];
      scope.articles = [];
      scope.openFoldersInTree = [];

      scope.$watch(
        function(){ return Article.selected; },
        function(){ scope.articles = Article.selected;},
      true);
      scope.$watch(
        function(){ return FileService.selected; },
        function(){ scope.files = FileService.selected;},
      true);
      scope.$watch(
        function(){ return Folder.allFolders; },
        function(){ scope.folders = Folder.allFolders;},
      true);
      // Load Folders
      Folder.select_all();
      // Load Articles in Folder

      const loadArticles = function(){
        Article.selectByFolder({ folder_id: scope.currentFolder.id });
      }

      const afterUploadOne = function(response, update){
        FileService.attachToFolder({
          file_id: response.data.file_id,
          folder_id: scope.currentFolder.id },
          function(res){ if(update){ afterUploadAll(); }
        });
      }
      const afterUploadAll = function(response){ FileService.refresh(); }

      scope.uploadFile = function(){
        const files = event.dataTransfer.files;
        const update = function(){}
        let completed = 0;
        let all = files.length;

        for (let i = 0; i < all; i++){
          let file = [files[i]];
          let res = uploadDropped.bind(null, file,
            function(response){},
            function(response){
              completed++;
              let update = completed == all;
              afterUploadOne(response, update);
            })();
        }

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

      scope.selectArticle = function(article){
        scope.articleWindow = true;
        scope.openArticle = article;
      }
      scope.deleteArticle = function(article){
        Article.delete(article, function(){
          loadArticles();
        });
      }
      scope.callbackArticleWindow = function(action){

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
      // disable placing articles to null folder
      scope.isOpenFolder = function(){ return scope.currentFolder != null; }

      scope.openFolder = function(folder){
        if(folder == null){ scope.currentFolder = null; }
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
        }
      }

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

      scope.isOpen = function(folder){
        return folder.id == scope.currentFolder.id;
      }
      // New Folder Object
      scope.new_folder = {};
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
    }
  };
}]);
