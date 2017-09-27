app.factory('uploadDropped', ['dataURItoBlob','resizeDroppedImage','Ajax',function(dataURItoBlob, resizeDroppedImage, Ajax){
  return function(files, progressFn, completeFn)
  {
    const targetUrl = '/system/ng/call.php?class=file';
    // If multiple files we call callback only openArticle
    angular.forEach(files, function(one_file)
    {
      if(one_file.type.match('image.*'))
      {
        const callbackImageResize = function(fileURL){
          const oData = {
            action: 'upload',
            file_name: one_file.name,
            files: dataURItoBlob(fileURL),
          };
          Ajax( oData, targetUrl, completeFn, progressFn);
        }
        const reader = new FileReader();
        reader.onload = function(readerEvent){
          resizeDroppedImage(readerEvent, callbackImageResize, 1080);
        }
        reader.readAsDataURL(one_file);
      }
      else {
        let oData = {
          action: 'upload',
          files: one_file,
        }
        Ajax( oData, targetUrl, completeFn, progressFn);
      }
    });
  }//resizeDropped
}]);
