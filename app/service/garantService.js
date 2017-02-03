app.service('Garant',function(Ajax){

  const url = '/missionlife/system/ng/garant.php';

  this.select = function(callback){
    Ajax.call({action: 'select'}, url, callback);
  };
  this.insert = function(data, callback){
    data.action = 'insert';
    console.log('insert', data);
    Ajax.call(data, url, callback);
  };
  this.update = function(data, callback){
    console.log('update', data);
    data.action = 'update';
    Ajax.call(data, url, callback);
  };
  this.delete = function(data, callback){
    data.action = 'delete';
    Ajax.call(data, url, callback);
  };
});
