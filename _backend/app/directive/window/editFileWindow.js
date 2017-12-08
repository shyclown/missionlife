app.directive('editFileWindow',['FileService','Article','Garant', 'Shared',
function( FileService, Article, Garant, Shared ) {
  return {
    restrict: 'E',
    scope:{},
    templateUrl: '/_backend/app/template/window/edit_file_window.html',
    link: function (scope, element, attrs)
    {
      scope.fileWindow = Shared.openElement[attrs.editObj];
      scope.cancel = function(){  scope.fileWindow.close();  }
      scope.openFile = scope.fileWindow.item;

      console.log(scope.openFile);

      if(scope.openFile){
        scope.file = Shared.fn.cloneObject(scope.openFile);
        scope.filesize = Shared.fn.getFileSize(scope.file.file_size);
        FileService.details(scope.file, function(res){
          if(res.data){ scope.details = res.data; }
        });
      }


  }//link
  }//return
  }//directivefunction
]);
