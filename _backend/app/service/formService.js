app.service('Form',function($rootScope, Ajax, Shared){

  const url = '/system/ng/call.php?class=form';
  const self = this;
  const ex = Shared.explorer;

  $rootScope.$watch(
    function(){ return ex.current_folder; },
    function(){ self.updateExplorer(); },
    true
  );

  this.updateExplorer = function(){
    if(ex.current_folder == null){
      ex.forms = [];
    }
    else{ self.selectByFolder(
      { folder_id: ex.current_folder.id },
      function(response){ ex.forms = response.data.result; $rootScope.$apply();
    });
    }
  }

  // ---------------------------------
  // Prop
  // ---------------------------------

  this.onePageSize = 5;
  this.sortByData = 'date';
  this.sortOrder = true; // asc

  this.scopePage = 1;
  this.allFiles = 0;
  this.Folder = null;

  /* ---------------------------------
                 fns
  ------------------------------------*/

  this.selected = [];
  this.all_rows = 0;

  // Load articles
  // watch.required or callback

  this.select_all = function(callback){
    Ajax.call({  action:'select_all' }, url, callback );
  }
  this.select_by_id = function(data, callback){
    data.action = 'select_by_id';
    Ajax.call(data, url, callback);
  }
  this.insert = function(data, callback){
    data.action = 'insert';
    Ajax.call(data, url, callback);
  }
  this.update_all = function(data, callback){
    data.action = 'update_all';
    Ajax.call(data, url, callback);
  }
  this.delete = function(data, callback){
    data.action = "delete";
    Ajax.call(data, url, callback);
  }
  this.addToFolder = function(data, callback){
    data.action = 'add_to_folder';
    Ajax.call(data, url, callback);
  }
  this.selectByFolder = function(data, callback){
    data.action = 'select_by_folder';
    Ajax.call(data, url, function(response){
      if(callback){ callback(response) };
    });
  }
});
