app.service('Article',function(Ajax){

  const url = '/missionlife/system/ng/article.php';

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

  this.load = function(callback){
    if(self.Folder == null){ this.selected = []; return; }
    Ajax.call({  action:'select',
            folder_id: this.Folder.id,
            sort_by: this.sortByData,
            order: this.sortOrder,
            limit_min:(this.scopePage-1)*this.onePageSize,
            limit_max: this.onePageSize
         }, url,
         function(response){
           self.selected = response.data.result;
           self.all_rows = response.data.all_rows;
           if(callback){ callback(response) };
         } );
  }
  this.insert = function(data, callback){
    data.action = 'insert';
    data.folder_id = self.Folder.id;
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
  this.load_files = function(data, callback){
    data.action = 'load_files';
    Ajax.call(data, url, callback);
  }
  this.updateFileDesc = function(data, callback){
    data.action = 'update_file_desc';
    Ajax.call(data, url, callback);
  }
});
