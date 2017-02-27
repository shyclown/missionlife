/*

*/
app.directive('editFileWindow',['FileService',
function( FileService ) {
  return {
    restrict: 'E',
    scope:{
      currentFolder : '=',
      openFile: '=',
      fileWindow: '=',
      afterFileWindow: '='
    },
    templateUrl: '/missionlife/app/template/edit_file_window.html',
    link: function (scope, element, attrs)
    {
      const clone = function(obj){ return Object.assign({},obj); }
      scope.cancel = function(){ scope.fileWindow = false; }
      const getFileSize = function bytesToSize(bytes) {
         var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
         if (bytes == 0) return '0 Byte';
         var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
         return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
      };

      scope.$watch(
        function(){ return scope.openFile; },
        function(){
          if(scope.openFile){
            scope.file = clone(scope.openFile);
            scope.filesize = getFileSize(scope.file.file_size);
            console.log(scope.filesize);
            FileService.details(scope.file,
              function(res){
                console.log(res);
                if(res.data){ scope.details = res.data;
                console.log(scope.details);}
              }
            );
          }
        }, true
      );

  }//link
  }//return
  }//directivefunction
]);
