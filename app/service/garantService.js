app.service('Garant',function(Ajax, customAjax){

  const url = '/missionlife/system/ng/call.php?class=garant';

  this.select = function(callback){
    Ajax.call({action: 'select'}, url, callback);
  };
  // issue when picture is too big
  // replaced ajax with customAjax which sends dataForm
  this.insert = function(data, callback){
    data.action = 'insert';
    customAjax(url, data, false, callback);
  };
  this.update = function(data, callback){
    data.action = 'update';
    Ajax.call(data, url, callback);
  };
  this.delete = function(data, callback){
    data.action = 'delete';
    Ajax.call(data, url, callback);
  };
  this.attach_file = function(data, callback){
    data.action = 'attach_file';
    Ajax.call(data, url, callback);
  }
  this.addToFolder = function(data, callback){
    data.action = 'add_to_folder';
    Ajax.call(data, url, callback);
  }
  this.selectByFolder = function(data, callback){
    data.action = 'select_by_folder';
    Ajax.call(data, url, function(response){
      self.selected = response.data.result;
      if(callback){ callback(response) };
    });
  }
});
