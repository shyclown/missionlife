app.service('FileService',function($rootScope, Shared, Ajax,  uploadDropped){

  const url = '/system/ng/call.php?class=file';

  const self = this;
  this.selected = [];


  // returns array of uploaded IDs
  this.uploadFilesToFolder = function(files, folder, callback, progressItems){
    const all = files.length;
    const uploaded = [];
    const data = function(res){ return { file_id: res.data.file_id, folder_id: folder.id } }
    let completed = 0;
    for (var i = 0; i < all; i++) {
      let file = [files[i]];
      uploadDropped( file,
        function(data){ // PROGRESS
          console.log(data);
        },
        function(response){ // AFTER
        completed++; // some files take longer to load
        progressItems(completed);
        let update = completed == all;
        uploaded.push(response.data);
        self.attachToFolder( data(response), function(){
          if(update){ callback(uploaded); }
        });
      });// uploadDropped
    }
  }
  this.uploadFile = function(folder)
  {
    console.log('file upload');
    if(!folder){ folder = Shared.explorer.current_folder }
    const files = event.dataTransfer.files;
    const all = files.length;
    const oData = function(response){
      return { file_id: response.data.file_id, folder_id: folder.id }
    }
    let completed = 0;
    for (let i = 0; i < all; i++){
      let file = [files[i]];
      uploadDropped(file, false, function(response){
        completed++; // some files take longer to load
        let update = completed == all;
        self.attachToFolder( oData(response), function(){
          if(update){ self.updateExplorer(); }
        });
      });// uploadDropped
    }// for
  }

  /* Watch explorer */
  const ex = Shared.explorer;
  $rootScope.$watch(
    function(){ return ex.current_folder; },
    function(){ self.updateExplorer() },
  true);

  this.updateExplorer = function(){
    if(ex.current_folder == null){
      ex.files = [];
    }
    else{ self.selectByFolder(
      { folder_id: ex.current_folder.id },
      function(response){ ex.files = response.data.result; $rootScope.$apply();
    });
    }
  }

  this.selectAll = function(data, callback){
    Ajax.call({action:'select_all'}, url, callback);
  }
  this.selectByID = function(data, callback){
    data.action = 'select_by_id';
    Ajax.call(data, url, callback);
  }
  this.selectByData = function(data,callback){
    data.action = 'get_files_by_selected';
    Ajax.call(data, url, callback);
  }
  this.selectByArticle = function(data, callback){
    data.action = 'select_by_article';
    Ajax.call(data, url, callback);
  }
  this.selectByGarant = function(data, callback){
    data.action = 'select_by_garant';
    Ajax.call(data, url, callback);
  }
  this.selectByFolder = function(data, callback){
    data.action = 'select_by_folder';
    Ajax.call(data, url, function(response){
      if(callback){ callback(response) };
    });
  }
  this.search = function(data, callback){
    data.action = 'search';
    Ajax.call(data, url, callback);
  }
  this.details = function(data, callback){
    data.action = 'get_all_details';
    Ajax.call(data, url, callback);
  }
  // Insert
  this.insert = function(data, callback){
    data.action = 'insert';
    Ajax.call(data, url, callback);
  }

  this.upload = function(data, callback){
    // chack if file is in URI or Blob
    console.log('upload', data);
    data.action = 'upload';
    Ajax.call(data, url, callback);
  }

  // Attach
  // Attach to article
  // reqire article_id
  this.attachToArticle = function(data, callback){
    data.action = 'attach_to_article';
    Ajax.call(data,url,callback);
  }
  // Attach to garant
  // require garant_id
  this.attachToGarant = function(data, callback){
    console.log('Attach file to Garant data: ',data);
    data.action = 'attach_to_garant';
    Ajax.call(data,url,callback);
  }
  // Attach to folder
  // require folder_id
  this.attachToFolder = function(data, callback){
    data.action = 'attach_to_folder';
    Ajax.call(data, url, callback);
  }
  // Update All
  this.update = function(data, callback){
    data.action = 'update';
    Ajax.call(data,url,callback);
  }
  // Delete
  this.delete = function(data, callback){
    data.action = 'delete';
    Ajax.call(data,url,callback);
  }
  // Rotate
  this.rotate = function(data, callback){
    data.action = 'rotate';
    Ajax.call(data,url,callback);
  }



});
