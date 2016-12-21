app.service('Article',function($http){

  const url = '/missionlife/system/ng/article.php';

  const ajax = function(data, url, completeFn, errorFn){
    $http({ method: 'POST', url: url, data:data })
    .then( completeFn, errorFn );
  }
  const defSuccess = function(response){console.log('success', response.data);};
  const defError = function(response){console.log('error', response);};

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
    ajax({  action:'select',
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
         }, defError );
  }
  this.insert = function(data, callback){
    data.action = 'insert';
    data.folder_id = this.Folder.id;
    ajax(data, url, callback, defError);
  }
  this.update = function(data, callback){
    data.action = 'update';
    ajax(data, url, callback, defError);
  }
  this.delete = function(data, callback){
    data.action = "delete";
    ajax(data, url, callback, defError);
  }
  this.load_files = function(data, callback){
    data.action = 'load_files';
    ajax(data, url, callback, defError);
  }
  this.updateFileDesc = function(data, callback){
    data.action = 'update_file_desc';
    ajax(data, url, callback, defError);
  }
});
