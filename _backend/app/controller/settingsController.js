app.controller('settingsController',function($http, Data , Shared, FileService, $scope, $route, $routeParams, $location){

  $scope.page = {};


  function prepareJSON(res){
    let result = Object.assign({}, res);
    result.data = JSON.parse(result.data);
    return result;
  }
  function prepareString(res){
    let result = Object.assign({}, res);
    result.data = JSON.stringify(result.data);
    return result;
  }

  /* Page Data */
  Data.select({ name:'settings' },function(res){
    const result = res.data[0];
    console.log('setResult', result);
    if(!result){
      $scope.settings = {
            name: 'settings',
            data: JSON.stringify({
              page_name: 'Name',
              page_motto: 'Name',
              logo: ''
            })
          }
          Data.insert( $scope.settings , function(res){
            $scope.settings.id = res.data;
            $scope.page = $scope.settings.data;
          });
    }else{
      $scope.settings = prepareJSON(result);
    }

    $scope.page = $scope.settings.data;
    $scope.$apply();
  }); // end dataSelect



  const uploadFile = function(filedata){
    console.log(filedata);
    const files = filedata;
    return function(folder){
      FileService.uploadFilesToFolder( files, folder.obj ,
        function(res){
          $scope.page.logo = res[0].file_src;
          $scope.changePageData();
        },
        function(i){ console.log('uploaded: '+i+'/'+files.length);}
      );
    }
  }
  const changeLogo = function(filedata){
    console.log(filedata);
    $scope.page.logo = filedata.obj.file_src;

console.log($scope.page);
    //$scope.changePageData();
  }

  $scope.selectFolder = function(event){

  }
  $scope.pickFile = function(event){
    const files = event.target.files;
    new Shared.directiveElement('pop-select', Shared.setupSelect.selectFolder, uploadFile(files), $scope);
    event.preventDefault();
  }
  $scope.searchImage = function(){
    new Shared.directiveElement('pop-select', Shared.setupSelect.selectImage, changeLogo, $scope);
  }

  $scope.dropFunction = function(event){
    const files = event.dataTransfer.files;
    new Shared.directiveElement('pop-select', Shared.setupSelect.selectFolder, uploadFile(files), $scope);
    event.preventDefault();
  }

  $scope.changePageData = function(){
    $scope.settings.data = $scope.page;
    const saveData = prepareString($scope.settings);
    Data.update(saveData,function(res){
      $scope.$apply();
    });
  }


});
