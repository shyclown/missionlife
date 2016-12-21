var Editor = Editor || { };
// functions
Editor.fn = {};
Editor.fn.el = function( oTag, oClass ){
  const el = document.createElement( oTag );
  el.className = oClass;
  return el;
}
Editor.resizeDropped = function(readerEvent, callback, size){
  var callback = callback;
  var dataUrl = false;
  var image = new Image();
  image.src = readerEvent.target.result;

  image.onload = function(imageEvent){
    var canvas = document.createElement('canvas'),
        max_size = 450,
        width = image.width,
        height = image.height;
    if(width > height){
      if (width > max_size) {
        height *= max_size / width;
        width = max_size;
      }
    } else {
        if(height > max_size){
          width *= max_size / height;
          height = max_size;
        }
    }
    canvas.width = width;
    canvas.height = height;
    canvas.getContext('2d').drawImage(image, 0, 0, width, height);
    dataUrl = canvas.toDataURL('image/png');
    callback(dataUrl);
  }// image.onload
}// mouse.resizeDropped

Editor.elementUnderMouse = function(event){
  var pos = this.getPosition(event);
  return document.elementFromPoint( pos.x - window.pageXOffset, pos.y - window.pageYOffset);
}
