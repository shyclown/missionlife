app.directive('editFolderWindow', ['Folder', function(Folder) {
  return {
    restrict: 'E',
    scope:{ folderWindow : '=editObj' },
    templateUrl: '/missionlife/app/template/window/edit_folder_window.html',
    link: function (scope, element, attrs){
      const stopDefault = function(){ event.stopPropagation(); event.preventDefault(); }
      scope.folder = scope.folderWindow.item;

      scope.removeFolder = function(folder){ stopDefault(event); Folder.remove(folder); }
      scope.orderUp = function(folder){ stopDefault(event); Folder.orderUp(folder); }
      scope.orderDown = function(folder){ stopDefault(event); Folder.orderDown(folder); }
      scope.updateName = function(folder){ stopDefault(event); Folder.updateName(folder); }
      scope.updatePosition = function(folder){ stopDefault(event); Folder.updatePosition(folder); }

      scope.close = function(){
        scope.folderWindow.close();
      }


    }
  }
}]);
