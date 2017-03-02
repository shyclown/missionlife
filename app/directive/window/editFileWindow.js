/*

*/
app.directive('editFileWindow',['FileService','Article','Garant', 'Shared',
function( FileService, Article, Garant, Shared ) {
  return {
    restrict: 'E',
    scope:{ fileWindow : '=editObj' },
    templateUrl: '/missionlife/app/template/window/edit_file_window.html',
    link: function (scope, element, attrs)
    {
      const clone = function(obj){ return Object.assign({},obj); }
      scope.cancel = function(){
        scope.fileWindow.close();
      }
      const getFileSize = function bytesToSize(bytes) {
         var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
         if (bytes == 0) return '0 Byte';
         var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
         return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
      };

      scope.openFile = scope.fileWindow.item;

      if(scope.openFile){
        scope.file = clone(scope.openFile);
        scope.filesize = getFileSize(scope.file.file_size);
        FileService.details(scope.file, function(res){
          if(res.data){ scope.details = res.data; }
        });
      }

      scope.openItem = function(item){
        const type = item.table_name;
        if(type == 'article'){}
        else if(type =='garant'){
          Garant.selectByID({ garant_id: item.id },
            function(response){
              Shared.window.garant = true;
              // open garant editor
              console.log(response.data);
            }
          );
        }
      }

  }//link
  }//return
  }//directivefunction
]);
