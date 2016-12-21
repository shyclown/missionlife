app.controller('foldersController',function($scope, Folder, $compile, $http){

  const url = '/missionlife/system/ng/folders.php';
  const stopDefault = function(){
    event.stopPropagation();
    event.preventDefault();
  }

  $scope.$watch(
    function(){ return Folder.allFolders; },
    function(){ $scope.folders = Folder.allFolders;},
  true);

  $scope.php = '';
  $scope.current_folder = null;
  $scope.current_parents = [];

  $scope.openFolder = function(folder){
    $scope.current_folder = folder;
    $scope.current_parents = Folder.listParents(folder);
  }
  // DRAG
  $scope.dragItem = {};
  $scope.dragTarget = {};

  $scope.onDropFn = function(){
    // update parent
    const item = $scope.dragItem;
    const target = $scope.dragTarget;

    if(item.folder.id != target.folder.id){
      if(!Folder.isParent(item, target)){

        item.folder.parent = target.folder.id; // set new parent in view
        let data = { id: item.folder.id, parent:target.folder.id };
        Folder.updateParent(data);
      }
    }
  }
// ------------------------
// Button Actions
// ------------------------
  $scope.new_folder = {};

  $scope.saveNewFolder = function(){
    let data = $scope.new_folder;
    data.parent = $scope.current_folder;
    Folder.insert(data, function(){ $scope.new_folder.name = ""; });
  }
  $scope.removeFolder = function(folder){ stopDefault(event);
    Folder.remove(folder);
  }
  $scope.orderUp = function(folder){ stopDefault(event);
    Folder.orderUp(folder);
  }
  $scope.orderDown = function(folder){ stopDefault(event);
    Folder.orderDown(folder);
  }
  $scope.updateName = function(folder){ stopDefault(event);
    Folder.updateName(folder);
  }
  $scope.updatePosition = function(folder){ stopDefault(event);
    Folder.updatePosition(folder);
  }
  // ------------------------
  // Root
  // ------------------------
  const root = document.getElementById('dropRoot');
  root.addEventListener('dragenter',function(){ stopDefault(event); },false);
  root.addEventListener('drop',function(){ Folder.updateParent({ id:$scope.dragItem.folder.id, parent: null });},false);
  root.addEventListener('dragover',function(){ stopDefault(event);},false);

  $scope.stateText = function(state){
    return state ? 'Disable' : 'Enable'}
  $scope.changeState = function(folder){ stopDefault(event); folder.state = !folder.state; }

  $scope.alertDrag = function(folder){
    console.log(event);
    console.log(folder);
  }
  $scope.folders;
  $scope.new_folder;
  Folder.select_all();
});
