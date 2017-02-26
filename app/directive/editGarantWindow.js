/*

*/
app.directive('editGarantWindow',['Garant', 'FileService', 'dataURItoBlob', 'resizeDroppedImage',
function( Garant, FileService, dataURItoBlob, resizeDroppedImage ) {
  return {
    restrict: 'E',
    scope:{
      currentFolder : '=',
      openGarant: '=',
      garantWindow: '=',
      afterGarantWindow: '='
    },
    templateUrl: '/missionlife/app/template/edit_garant_window.html',
    link: function (scope, element, attrs)
    {
      let sourceGarant;
      let imageReplaced;
      scope.editGarant;
      scope.image;

      const copy = function(obj){ return Object.assign({},obj); }
      const callbackFn = function(){ scope.afterGarantWindow(); }
      const newGarant = { image: false, header: '', title: '', webpage: '', motto: '', state: 1 }

      const updateValue = function(){
          sourceGarant = scope.openGarant;
          imageReplaced = false;
          if(!sourceGarant){ scope.editGarant = copy(newGarant); }
          else{ scope.editGarant = copy(sourceGarant); }
          scope.image = scope.editGarant.image;
      }

      scope.cancel = function(){ scope.garantWindow = false; }
      scope.$watch(
        function(){ return scope.openGarant; },
        function(){ updateValue(); }, true
      );

      // Garant functions
      scope.save = function(garant){
        if (garant.id) {
          Garant.update( garant,
            function(response){
              scope.afterGarantWindow();
              replaceImage();});
        }
        else{
          Garant.insert( garant,
            function(response){ garant.id = response.data;
              const reply = function(r){ scope.afterGarantWindow(); }
              const attachGarantToFolder = { folder_id: scope.currentFolder.id, garant_id: scope.editGarant.id }
              Garant.addToFolder(attachGarantToFolder, reply );
              replaceImage();});
        }
        scope.cancel(); // close window
      }

      const replaceImage = function(){ if(imageReplaced){ uploadFile(); }}

      // not implemented yet
      scope.delete = function(garant){
        garant.action = 'remove';
        Garant.delete({id: garant.id}, function(response){
            scope.load_garants();
            scope.php = response.data;
        });
      }  // delete

      const resize = function(event, callback, sizePX){
        let reader = new FileReader();
        reader.onload = function(ev){ resizeDroppedImage(ev, callback, sizePX);  }
        reader.onprogress = function(ev){ console.log(ev.loaded / (ev.total / 100));}
        reader.readAsDataURL(event.dataTransfer.files[0]);
      }

      const uploadFile = function(reset)
      {
        const uploadData = { file_name: scope.new_file_name, files: dataURItoBlob(scope.image) }
        FileService.upload(uploadData, function(response){
          const reply = function(r){ console.log('reply', r); }
          const attachFileToFolder = { folder_id: scope.currentFolder.id, file_id: response.data.file_id }
          const attachFileToGarant = { garant_id: scope.editGarant.id, file_id: response.data.file_id }
          FileService.attachToFolder(attachFileToFolder, reply);
          FileService.attachToGarant(attachFileToGarant, reply);
        });
      }

      // TODO: !!!
      // need to store image somewhere else because of size of request

      scope.onDropImage = function(){
        const afterResize = function(dataUrl){
          console.log(imageReplaced);
          imageReplaced = true;
          console.log(imageReplaced);
          scope.image = dataUrl;
          scope.$apply();
        }
        scope.new_file_name = event.dataTransfer.files[0].name;
        resize(event, afterResize, 1080);
      }

      scope.editImagePath = function(){
        return imageReplaced ? scope.image : '/missionlife/uploads/image/'+scope.image;
      }
      scope.labelPosition = function(item){
        //return item.image ? 'inCorner' : '';};
        return 'inCorner';

    }
  }//link
  }//return
  }//directivefunction
]);
