app.factory('Ajax', function(){
  return {
    // default functions
    defSuccess : function(response){console.log('success', response.data);},
    defError : function(response){console.log('error', response);},
    call: function( oData, targetUrl, completeFn, progressFn )
    {

    const createForm = function(oArray){
      var oForm = new FormData();
      for(var oKey in oArray){ oForm.append(oKey,oArray[oKey]); }
      return oForm;
    }

    const request = new XMLHttpRequest();

    request.addEventListener('load',function(){
      const res = { data: JSON.parse(request.responseText) }
      if(completeFn){  completeFn(res);  }
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
  }
});
