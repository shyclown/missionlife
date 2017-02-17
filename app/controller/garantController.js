app.controller('garantController',function(Ajax, dataURItoBlob, customAjax, FileService, $scope, $http, customAjax, Garant, resizeDroppedImage){


  const newGarant = {
    header: 'new Garant',
    content: 'new Content',
    image: false,
    state: true,
  }
  const uploadFile = function(obj, reset)
  {
    const uploadData = {
      file_name: obj.file_name,
      files: dataURItoBlob(obj.image)
    }
    FileService.upload(uploadData, function(response){
      //const attachFileToFolder = {
      //  folder_id: null,
      //  file_id: response.data.file_id
      //}
      const attachFileToGarant = {
        garant_id: obj.id,
        file_id: response.data.file_id
      }
      //FileService.attachToFolder(attachFileToFolder, function(response){ console.log(response);});
      FileService.attachToGarant(attachFileToGarant, function(response){ reset(); });
    });
  }
  const resize = function(event, callback, sizePX){
    let reader = new FileReader();
    reader.onload = function(ev){ resizeDroppedImage(ev, callback, sizePX);  }
    reader.onprogress = function(ev){ console.log(ev.loaded / (ev.total / 100));}
    reader.readAsDataURL(event.dataTransfer.files[0]);
  }

  let imageReplaced = false;
  let NewImageReplaced = false;

  $scope.garants = [];
  $scope.new_garant = Object.assign({}, newGarant);

  $scope.onDropImage = function(){
    const afterResize = function(dataUrl){
      NewImageReplaced = true;
      $scope.new_garant.image = dataUrl;
      $scope.$apply();
    }
    $scope.new_garant.file_name = event.dataTransfer.files[0].name;
    resize(event, afterResize, 1080);
  }

  $scope.editImagePath = function(){
    return imageReplaced ? $scope.edit_garant.image : '/missionlife/uploads/image/'+$scope.edit_garant.image;
  }

  $scope.onEditDropImage = function(){
    const afterResize = function(dataUrl){
    imageReplaced = true;
    $scope.edit_garant.image = dataUrl;
    $scope.$apply();
    }
    $scope.edit_garant.file_name = event.dataTransfer.files[0].name;
    resize(event, afterResize, 1080);
  }

  $scope.labelPosition = function(item){return item.image ? 'inCorner' : '';};

  $scope.editor_open = false;
  $scope.edit_garant = {};

  $scope.edit = function(garant){
    $scope.edit_garant = Object.assign({}, garant);
    $scope.open_garant = garant;
    $scope.editor_open = true;
  }
  $scope.closeEditor = function(){
    $scope.editor_open = false;
    $scope.edit_garant = {};
  }
  $scope.load_garants = function(){
    Garant.select( function(response){ $scope.garants = response.data; });
  }
  $scope.update = function(){
    Garant.update( $scope.edit_garant, function(response){
      const reset = function(){
        $scope.editor_open = false;
        imageReplaced = false;
        $scope.load_garants();
      };
      if(imageReplaced){ uploadFile($scope.edit_garant, reset); }
      else{ reset(); }
    });
  }

  $scope.insert = function(){
    console.log($scope.new_garant);
    Garant.insert( $scope.new_garant, function(response){
      console.log(response);
      // Receive ID of new Garant
      $scope.new_garant.id = response.data;
      const reset = function(){
        NewImageReplaced = false;
        $scope.new_garant = Object.assign({}, newGarant);
        $scope.load_garants();
      }
      if(NewImageReplaced){ uploadFile($scope.new_garant, reset); }
      else{ reset(); }
    });
  };
  $scope.delete = function(garant){
    garant.action = 'remove';
    Garant.delete({id: garant.id}, function(response){
        $scope.load_garants();
        $scope.php = response.data;
    });
  }
  $scope.load_garants();
  // change to ajax call
});
