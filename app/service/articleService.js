app.service('Article',function($rootScope, Ajax, Shared){

  const url = '/missionlife/system/ng/call.php?class=article';
  const self = this;

  $rootScope.$watch(
    function(){ return Shared.explorer.current_folder; },
    function(){
      const ex = Shared.explorer;
      if(ex.current_folder == null){ ex.articles = []; }
      else{
        self.selectByFolder({ folder_id: ex.current_folder.id },
        function(response){
          ex.articles = response.data.result;
          console.log(response);
        });
      }
    },
    true
  );


  this.onePageSize = 150;
  this.sortByData = 'date';
  this.sortOrder = false; // desc

  this.scopePage = 1;
  this.allFiles = 0;
  this.Folder = null;

  this.selected = [];
  this.all_rows = 0;

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

  this.select_all = function(callback){
    Ajax.call({action:'select_all'}, url, callback);
  }
  this.search = function(data, callback){
    data.action = 'search';
    Ajax.call(data, url, callback);
  }
  this.select_by_id = function(data, callback){
    data.action = 'select_by_id';
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
  this.load_files = function(data, callback){
    data.action = 'load_files';
    Ajax.call(data, url, callback);
  }
  this.updateFileDesc = function(data, callback){
    data.action = 'update_file_desc';
    Ajax.call(data, url, callback);
  }
  this.selectByFolder = function(data, callback){
    data.action = 'select_by_folder';
    Ajax.call(data, url, function(response){
      if(callback){ callback(response) };
    });
  }

});
