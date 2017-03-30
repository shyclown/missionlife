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
      const oGarant = oGarantWindow.item;
      const oCallback = oGarantWindow.callback;
      const newGarant = { image: false, header: '', title: '', webpage: '', motto: '', state: 1 }

      let newImageFile;

      if(oGarant){ scope.garant = Object.assign({}, oGarant); scope.new = false; }
      else{ scope.garant = Object.assign({}, newGarant); }

      console.log(scope.garant);

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
        if(scope.garant.image != oGarant.image ){
          const attachFileToGarant = { garant_id: scope.garant.id, file_id: newImageFile.item_id }
          FileService.attachToGarant(attachFileToGarant,
            function(){ callback(true); });
        }
        else{ callback(false); }
      }
      // save

      const uploadCompleted = function(){ console.log('upload Completed');}

      const uploadFile = function(filedata){
        let storedName = filedata[0].name;
        let reader = new FileReader();
        reader.onload = function(ev){ resizeDroppedImage(ev, afterResize, 1080); }
        reader.readAsDataURL(filedata[0]);

        afterResize = function(dataUrl){
          filedata = dataURItoBlob(dataUrl);
          FileService.upload({ file_name: storedName, files:filedata }, function(response){
              let newImageFile = response.data;
              const attachFileToFolder = { folder_id: scope.currentFolder.id, file_id: response.data.item_id }
              FileService.attachToFolder(attachFileToFolder,
                function(){ uploadCompleted(); });
              scope.garant.image = response.data.file_src;
            },
            function(i){ console.log('uploaded: '+i+'/'+files.length);}
          );
        }
      }

      const changeImage = function(filedata){ newImageFile = filedata.obj; scope.garant.image = filedata.obj.file_src; }

      scope.onDropImage = function(){ uploadFile(event.dataTransfer.files); }
      scope.onPickImage = function(){ uploadFile(event.target.files); }
      scope.searchImage = function(){
        new Shared.directiveElement('pop-select', Shared.setupSelect.selectImage, changeImage, scope);
      }

  }//link
  }//return
  }//directivefunction
]);
