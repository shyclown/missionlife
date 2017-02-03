app.service('File',function(Ajax){

  const url = '/missionlife/system/ng/file.php';

  // Select
  this.selectAll = function(data, callback){
    Ajax.call({action:'select_all'}, url, callback);
  }
  this.selectByID = function(data, callback){
    data.action = 'select_by_id';
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
  this.search = function(data, callback){
    data.action = 'search';
    Ajax.call(data, url, callback);
  }

  // Insert
  this.insert = function(data, callback){
    data.action = 'insert';
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
    data.action = 'attach_to_garant';
    Ajax.call(data,url,callback);
  }
  // Attach to folder
  // require folder_id
  this.attachToFolder = function(data, callback){
    data.action = 'attach_to_folder';
    Ajax.call(data,url,callback);
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


});