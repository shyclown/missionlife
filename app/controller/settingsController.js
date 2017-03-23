app.controller('settingsController',function($http, Data , Shared, FileService, $scope, $route, $routeParams, $location){

  $scope.page = {};
  /* Page Data */
  Data.select({ name:'settings' },function(res){
    if(!res.data[0]){
      $scope.settings = {
            name: 'settings',
            data:{
            page_name: 'Name',
            page_motto: 'Name'
            }
          }
          Data.insert( $scope.settings , function(res){
            $scope.settings.id = res.data;
            $scope.page = $scope.settings.data;
          });
    }else{
      res.data[0].data = JSON.parse(res.data[0].data);
      $scope.settings = res.data[0];
    }
    $scope.page = $scope.settings.data;
  });

  const uploadFile = function(filedata){
    const files = filedata;
    return function(folder){
      FileService.uploadFilesToFolder( files, folder.obj ,
        function(res){ console.log(res);},
        function(i){ console.log('uploaded: '+i+'/'+files.length);}
      );
    }
  }
  $scope.pickFile = function(event){
    const files = event.target.files;
    new Shared.directiveElement('pop-select', Shared.setupSelect.selectFolder, uploadFile(files), $scope);
    event.preventDefault();
  }
  $scope.dropFunction = function(){
    const files = event.dataTransfer.files;
    new Shared.directiveElement('pop-select', Shared.setupSelect.selectFolder, uploadFile(files), $scope);
    event.preventDefault();
  }

  $scope.changePageData = function(){
    $scope.settings.data = $scope.page;
    Data.update($scope.settings,function(res){console.log(res.data);});
  }


});
