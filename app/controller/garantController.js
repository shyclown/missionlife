app.controller('garantController',function(Ajax, uploadURIToGarant, $scope, $http, customAjax, Garant, resizeDroppedImage){

  $scope.garants = [];
  $scope.new_garant = {
    header: 'new Garant',
    content: 'new Content',
    image: false,
    state: true,
  }

  function resize(event, callback){
    let reader = new FileReader();
    reader.onload = function(ev){ resizeDroppedImage(ev, callback, 1080);  }
    reader.onprogress = function(ev){ console.log(ev.loaded / (ev.total / 100));}
    reader.readAsDataURL(event.dataTransfer.files[0]);
  }
  let imageReplaced = false;
  let NewImageReplaced = false;

  $scope.onDropImage = function(){
    const afterDrop = function(dataUrl){
      NewImageReplaced = true;
      $scope.new_garant.image = dataUrl; $scope.$apply();
    }
    $scope.new_garant.file_name = event.dataTransfer.files[0].name;
    resize(event, afterDrop);
  }

  $scope.editImagePath = function(){
    return imageReplaced ? $scope.edit_garant.image : '/missionlife/uploads/image/'+$scope.edit_garant.image;
  }

  $scope.onEditDropImage = function(){
    const afterDrop = function(dataUrl){
    imageReplaced = true;
    $scope.edit_garant.image = dataUrl; $scope.$apply();
    }
    $scope.edit_garant.file_name = event.dataTransfer.files[0].name;
    resize(event, afterDrop);
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
    Garant.select( function(response){
        $scope.garants = response.data;
    });
  }
  $scope.update = function(){

    $scope.editor_open = false;
    $scope.open_garant = $scope.edit_garant;
    Garant.update( $scope.edit_garant, function(response){
      const reset = function(){
        imageReplaced = false;
        $scope.load_garants();
      };
      if(imageReplaced){
        uploadURIToGarant(
          $scope.edit_garant.image,
          false,
          function(response){ reset(); },
          $scope.edit_garant.id
        );
      }
      else{ reset(); }
    });
  }

  $scope.insert = function(){

    // images werent uploaded when they were sent to Garant.insert
    // garant was not created as well
    // solved it by this hack >
    let imageURI = $scope.new_garant.image;
    $scope.new_garant.image = false;

    Garant.insert( $scope.new_garant, function(response){
      const reset = function(){
        NewImageReplaced = false;
        $scope.new_garant = {
          header: 'new Garant',
          content: 'new Content',
          image: false,
          state: true,
        };
        $scope.load_garants();
      }
      if(NewImageReplaced){
        uploadURIToGarant(
          imageURI,
          false,
          function(response){ reset(); },
          response.data
        );
      }
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
