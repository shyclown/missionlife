app.service('Garant',function($http){
  this.postAjax = function(data, callback){
    var req = {
      method:'POST',
      url: '/missionlife/system/ng/handle_ajax.php',
      //headers:{ 'Content-Type':undefined },
      data: data
    };
    $http(req).then(
      function(response){callback(response);}, // success
      function(response){callback(response);} //error
    );
  }
  this.load = function(callback){
    this.postAjax({action: 'select'}, callback);
  };
  this.insert = function(data, callback){
    data.action = 'insert';
    this.postAjax(data, callback);
  };
  this.update = function(data, callback){
    data.action = 'update';
    this.postAjax(data, callback);
  };
  this.delete = function(data, callback){
    data.action = 'delete';
    this.postAjax(data, callback);
  };
  this.test = function(callback){
    let data = {
      action: 'test',
      test: 'test' };
    this.postAjax(data, callback);
  }
});
