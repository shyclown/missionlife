app.factory('Ajax',function($http){
  return {
    // default functions
    defSuccess : function(response){console.log('success', response.data);},
    defError : function(response){console.log('error', response);},
    call: function(data, url, completeFn, errorFn){
      if(!errorFn){ errorFn = this.defError; }
      $http({
        method: 'POST',
        url: url, data:data,
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
      })
      .then( completeFn, errorFn );
    }
  }
});
