app.directive('editFileWindow',['FileService','Article','Garant', 'Shared',
function( FileService, Article, Garant, Shared ) {
  return {
    restrict: 'E',
    scope:{},
    templateUrl: '/_backend/app/template/window/edit_file_window.html',
    link: function (scope, element, attrs)
    {
      const oFileWindow = Shared.openElement[attrs.editObj];
      const oFile = oFileWindow.item;

      scope.cancel = function(){
        oFileWindow.callback();
        oFileWindow.close();
      }

      if(oFile){
        scope.file = Shared.fn.cloneObject(oFile);
        scope.filesize = Shared.fn.getFileSize(scope.file.file_size);
        FileService.details(scope.file, function(res){
          if(res.data){ scope.details = res.data; }
        });
      }
      else{
        scope.cancel();
      }

      scope.rotate = function(){
        FileService.rotate(scope.file, function(res){
          scope.$apply();
        });
      }
      scope.delete = function(){
        FileService.delete(scope.file, function(res){
          scope.cancel();
          scope.$apply();
        });
      }


  }//link
  }//return
  }//directivefunction
]);
