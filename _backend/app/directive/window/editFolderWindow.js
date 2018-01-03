app.directive('editFolderWindow', ['Folder','Shared', function(Folder, Shared) {
  return {
    restrict: 'E',
    scope:{},
    templateUrl: '/_backend/app/template/window/edit_folder_window.html',
    link: function (scope, element, attrs){

      scope.folderWindow = Shared.openElement[attrs.editObj];
      scope.folder = Shared.fn.cloneObject(scope.folderWindow.item);

      scope.setPosition = function(newPosition){
        scope.folder.position = newPosition;
      }
      scope.text = Shared.text.edit.folder;

      scope.changeState = function(state){ scope.folder.state = state; }
      scope.removeFolder = function(folder){ Folder.remove(folder); }
      scope.updateName = function(folder){ Folder.updateName(folder); }
      scope.updatePosition = function(folder){ Folder.updatePosition(folder); }


      scope.cancel = function(){
        new Shared.prompt( Shared.text.prompt.folder.cancel, function(){
          //Folder.update(scope.folder);
          scope.folderWindow.callback();
        }, scope);
        //
        scope.folderWindow.close();
      }

      scope.save = function(folder){
        Folder.update(folder);
        scope.folderWindow.callback();
        scope.folderWindow.close();
      }

      scope.delete = function(){
        new Shared.prompt( Shared.text.prompt.folder.delete, function(){
          Folder.remove(scope.folder);
          scope.folderWindow.callback();
          scope.folderWindow.close();
        }, scope);
      }
    }
  }
}]);
