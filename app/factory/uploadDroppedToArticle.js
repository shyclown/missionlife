app.factory('uploadDroppedToArticle', ['resizeDroppedImage','customAjax',function(resizeDroppedImage, customAjax){
  return function(files, targetUrl, progressFn, completeFn, article_id)
  {
    console.log(files);
    angular.forEach(files, function(one_file)
    {
      console.log(one_file);
      if(one_file.type.match('image.*'))
      {
        const callbackImageResize = function(resultUrl){
          const oData = {
            file_name: one_file.name,
            article_id: article_id,
            action: 'image',
            image: resultUrl
          }
          customAjax(targetUrl, oData, progressFn, completeFn);
        }
        const reader = new FileReader();
        reader.onload = function(readerEvent){
          resizeDroppedImage(readerEvent, callbackImageResize, 1080);
        }
        reader.onprogress = function(ev){
          console.log(ev.loaded / (ev.total / 100));
        }
        reader.readAsDataURL(one_file);
      }
      else {
        let oData = {
          files: one_file,
          article_id: article_id
        }
        customAjax(targetUrl, oData, progressFn, completeFn);
      }
      console.log('article:',article_id);
    });
  }//resizeDropped
}]);
