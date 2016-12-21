var Editor = Editor || {}

Editor.ajax = function(target, data, progress, callback){

  var request = new XMLHttpRequest();
  request.addEventListener('load',function(){
    callback(request.responseText);
  });
  if(progress){
    request.addEventListener('progress',function(){
      if(event.lengthComputable){
        var percent = event.loaded / event.total;
        progress(percent);
      }
    });
  }
  request.open("POST", target);
  request.send(this.createForm(data));
}

Editor.ajax.prototype.createForm = function(oArray){
  var oForm = new FormData();
  for(var oKey in oArray){
    oForm.append(oKey,oArray[oKey]);
  }
  return oForm;
}
