app.controller('garantController',function(Ajax, $scope, $http, customAjax, Garant, resizeDroppedImage){

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
  $scope.onDropImage = function(){
    const afterDrop = function(dataUrl){ $scope.new_garant.image = dataUrl; $scope.$apply(); }
    $scope.new_garant.file_name = event.dataTransfer.files[0].name;
    resize(event, afterDrop);
  }


  let imageReplaced = false;
  $scope.editImagePath = function(){
    return imageReplaced ? $scope.edit_garant.image : '/missionlife/uploads/image/'+$scope.edit_garant.image;
  }
  $scope.onEditDropImage = function(){
    const afterDrop = function(dataUrl){
    imageReplaced = true;
    $scope.edit_garant.image = dataUrl; $scope.$apply(); }
    $scope.edit_garant.file_name = event.dataTransfer.files[0].name;
    resize(event, afterDrop);
  }

  $scope.labelPosition = function(item){return item.image ? 'inCorner' : '';};

  const url = '/missionlife/system/ng/garant.php';

  const ajax = function(data, completeFn, errorFn){
    $http({ method: 'POST', url: url, data:data })
    .then(
      function(response){ completeFn(response); },
      function(response){ errorFn(response) }
    );
  }
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
    Ajax.call(
      {action: 'select'}, url,
      function(response){
        $scope.garants = response.data; },
      function(response){ console.log(response); } // error
    );
  }

  $scope.update = function(){
    console.log($scope.edit_garant);
    $scope.editor_open = false;
    $scope.open_garant = $scope.edit_garant;
    $scope.edit_garant.action = 'update';
    Ajax.call(
      $scope.edit_garant, url,
      function(response){
        imageReplaced = false;
        $scope.load_garants();
        $scope.php = response.data;
      },
      function(response){ console.log(response); } // error
    );
  }

  $scope.insert = function(garant){
    $scope.editor_open = false;
    $scope.open_garant = $scope.edit_garant;
    $scope.new_garant.action = 'insert';
    Ajax.call(
      $scope.new_garant, url,
      function(response){
        $scope.php = response.data,
        $scope.new_garant = {
          header: 'new Garant',
          content: 'new Content',
          image: false,
          state: true,
        };
        $scope.load_garants();
      },
      function(response){ console.log(response); } // error
    );
  }

  $scope.remove = function(garant){
    garant.action = 'remove';
    Ajax.call(
      garant, url,
      function(response){
        $scope.load_garants();
        $scope.php = response.data;
      },
      function(response){ console.log(response); } // error
    );
  }

  $scope.load_garants();
  // change to ajax call
  $scope.delete = function(garant){
    Garant.delete({
      id: garant.id
    },function(response){
      $scope.php = response.data;
      load();
    })
  }
});
