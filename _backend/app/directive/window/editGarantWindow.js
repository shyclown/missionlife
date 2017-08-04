/*

*/
app.directive('editGarantWindow',['Garant', 'FileService', 'dataURItoBlob', 'resizeDroppedImage', 'Shared',
function( Garant, FileService, dataURItoBlob, resizeDroppedImage, Shared ) {
  return {
    restrict: 'E',
    scope:{},
    templateUrl: '/_backend/app/template/window/edit_garant_window.html',
    link: function (scope, element, attrs)
    {
      const oGarantWindow = Shared.openElement[attrs.editObj];
      const oGarant = oGarantWindow.item; // is false if new
      const oCallback = oGarantWindow.callback;
      const newGarant = { image: false, header: '', title: '', webpage: '', motto: '', state: 1 }

      let newImageFile = {};

      scope.new = true;
      if(oGarant){ scope.garant = Object.assign({}, oGarant); scope.new = false; }
      else{ scope.garant = Object.assign({}, newGarant); }

      scope.currentFolder = Shared.explorer.current_folder;

      scope.cancel = function(){ oGarantWindow.close(); }
      // Garant functions
      scope.save = function(){
        Garant.insert( scope.garant, function(response){
          scope.garant.id = response.data;
          updateImage(oCallback);
          scope.cancel();
        });
      }
      scope.update = function(){
        Garant.update( scope.garant, function(response){
          updateImage(oCallback);
          scope.cancel();
        });
      }
      scope.delete = function(){
        Garant.delete( scope.garant, function(response){
            scope.cancel();
        });
      }

      const updateImage = function(callback){
        if(scope.garant.image != oGarant.image && newImageFile){

          // selected item is called item.id
          console.log('selected item id: ', newImageFile.item_id);
          const attachFileToGarant = { garant_id: scope.garant.id, file_id: newImageFile.item_id }

          FileService.attachToGarant(attachFileToGarant,
            function(res){console.log(res); callback(true); });
        }
        else{ callback(false); }
      }
      // save

      const uploadCompleted = function(){ console.log('upload Completed'); scope.$apply(); }

      const uploadFile = function(filedata){

        FileService.uploadFilesToFolder(filedata, Shared.explorer.current_folder,
          function(response){
            console.log(response);
            scope.garant.image = response[0].file_src;
            newImageFile.file_id = response[0].file_id;
            scope.$apply(); },
          function(prog){  }
        );
      }

      const changeImage = function(filedata){
        console.log(filedata.obj);
        newImageFile = filedata.obj;
        scope.garant.image = filedata.obj.file_src;
      }

      scope.onDropImage = function(){ uploadFile(event.dataTransfer.files); }
      scope.onPickImage = function(){ uploadFile(event.target.files); }
      scope.searchImage = function(){
        // ElementClass to open, type of Item, callback, scope
        new Shared.directiveElement('pop-select', Shared.setupSelect.selectImage, changeImage, scope);
      }

  }//link
  }//return
  }//directivefunction
]);
