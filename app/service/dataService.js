app.service('Data',function(Ajax){
  const url = '/missionlife/system/ng/page_data.php';
  this.select = function(data, callback){
    if(!data){ data = {}; }
    data.action = 'select';
    Ajax.call(data, url, callback);
  }
  this.insert = function(data, callback){
    data.action = 'insert';
    Ajax.call(data, url, callback);
  }
  this.update = function(data, callback){
    data.action = 'update';
    Ajax.call(data, url, callback);
  }
  this.delete = function(data, callback){
    data.action = "delete";
    Ajax.call(data, url, callback);
  }
});
