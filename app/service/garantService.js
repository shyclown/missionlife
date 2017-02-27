app.service('Garant',function($rootScope, Shared, Ajax, customAjax){

  const url = '/missionlife/system/ng/call.php?class=garant';
  const self = this;
  const ex = Shared.explorer;

  $rootScope.$watch(
    function(){ return ex.current_folder; },
    function(){ self.updateExplorer(); },
    true
  );

  this.updateExplorer = function(){
    if(ex.current_folder == null){
      ex.garants = [];
    }
    else{ self.selectByFolder(
      { folder_id: ex.current_folder.id },
      function(response){ ex.garants = response.data.result;
    });
    }
  }

  this.select = function(callback){
    Ajax.call({action: 'select'}, url, callback);
  };
  // issue when picture is too big
  // replaced ajax with customAjax which sends dataForm


  // make insert possible to to folder only
  this.insert = function(data, callback){
    data.action = 'insert';
    customAjax(url, data, false, function(response){
      const res = response;
      self.addToFolder( {
        folder_id: ex.current_folder.id,
        garant_id: res.data
      }, function(){
        if(callback){ callback(res); };
      });
    });
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
