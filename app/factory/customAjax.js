/*
This custom ajax was created for purpose of displaying progres
of upload process
*/
app.factory('customAjax', function(){
  return function(targetUrl, oData, progressFn, completeFn)
  {
    const createForm = function(oArray){
      var oForm = new FormData();
      for(var oKey in oArray){ oForm.append(oKey,oArray[oKey]); }
      return oForm;
    }
    const request = new XMLHttpRequest();
    request.addEventListener('load',function(){
      completeFn(request.responseText);
    });
    if(progressFn){
      request.addEventListener('progress',function(){
        if(event.lengthComputable){
          var percent = event.loaded / event.total;
          progressFn(percent);
        }
      });
    }
    request.open("POST", targetUrl);
    request.send(createForm(oData));
  }
});
