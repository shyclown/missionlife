app.factory('uploadDroppedToArticle', ['resizeDroppedImage','customAjax',function(resizeDroppedImage, customAjax){
  return function(files, targetUrl, progressFn, completeFn, article_id)
  {
    // If multiple files we call callback only openArticle
    function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0){
      byteString = atob(dataURI.split(',')[1]); }
    else{
      byteString = unescape(dataURI.split(',')[1]); }
    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], {type:mimeString});
    }

    angular.forEach(files, function(one_file)
    {
      if(one_file.type.match('image.*'))
      {
        console.log(targetUrl);
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
