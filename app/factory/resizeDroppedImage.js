app.factory('resizeDroppedImage', function(){
  return function(readerEvent, callback, size)
  {
    var callback = callback;
    var dataUrl = false;
    var image = new Image();
    image.src = readerEvent.target.result;
    image.onload = function(ev)
    {
      var canvas = document.createElement('canvas'),
        max_size = size,
        width = image.width,
        height = image.height;
      if(width > height && width > max_size){
        height *= max_size / width;
        width = max_size;
      } else if(height > max_size) {
        width *= max_size / height;
        height = max_size;
      }
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(image, 0, 0, width, height);
      dataUrl = canvas.toDataURL('image/png');
      callback(dataUrl);
    }// image.onload
  }//resizeDropped
});
