app.service('Form',function(Ajax){

  const url = '/missionlife/system/ng/form.php';

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
  const self = this;
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
  this.load_files = function(data, callback){
    data.action = 'load_files';
    Ajax.call(data, url, callback);
  }
  this.updateFileDesc = function(data, callback){
    data.action = 'update_file_desc';
    Ajax.call(data, url, callback);
  }
});