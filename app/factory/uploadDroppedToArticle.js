app.factory('uploadDroppedToArticle', ['dataURItoBlob','resizeDroppedImage','customAjax',function(dataURItoBlob, resizeDroppedImage, customAjax){
  return function(files, progressFn, completeFn, article_id)
  {
    const targetUrl = '/missionlife/system/ng/files.php';
    // If multiple files we call callback only openArticle
    angular.forEach(files, function(one_file)
    {
      if(one_file.type.match('image.*'))
      {
        const callbackImageResize = function(fileURL){
          const oData = {
            action: 'upload',
            files: dataURItoBlob(fileURL),
            article_id: article_id
          };
          customAjax(targetUrl, oData, progressFn, completeFn);
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
          article_id: article_id
        }
        customAjax(targetUrl, oData, progressFn, completeFn);
      }
    });
  }//resizeDropped
}]);
