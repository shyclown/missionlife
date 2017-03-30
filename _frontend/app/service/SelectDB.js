app.service('Shared', function(){
  this.pages = [];
  this.current_page = {};
  this.page_articles = [];
});

app.service('Data',function(Ajax, Shared){
  const url = '/system/ng/call.php?class=data';
  this.loadSettings = function(callback){
    Ajax.call({ name: 'settings', action: 'select'}, url, function(response){
      Shared.settings = JSON.parse(response.data[0].data);
      if(callback){ callback(response); }
    });
  }
});
app.service('Page',function(Ajax, Shared){
  const url = '/system/ng/call.php?class=page';
  this.loadPages = function(callback){ Ajax.call({action : 'select'}, url, callback);};
  this.loadItems = function(data, callback){ data.action = "load_items"; Ajax.call(data, url, callback); }
});

app.service('Article',function(Ajax, Shared){
  const url = '/system/ng/call.php?class=article';
  this.selectByCurrentPage = function(callback){
    Ajax.call({ action : 'select_by_page', page_id: Shared.current_page.id}, url, function(response){
      Shared.page_articles = response.data; console.log(Shared.page_articles);
      if(callback){ callback(response); }
    });
  }
  this.selectByID = function(data, callback){ Ajax.call({ action: 'select_by_id', id: data.id }, url, callback); }
  this.selectByFolder = function(data, callback){ data.action = 'select_by_folder';  Ajax.call(data, url, callback); }
});

app.service('Form',function(Ajax, Shared){
  const url = '/system/ng/call.php?class=form';
  this.selectByID = function(id, callback){
    console.log('Form ID: ',id);
    Ajax.call({ action : 'select_by_id', id: id }, url, callback);}
});

app.service('Garant',function(Ajax, Shared){
  const url = '/system/ng/call.php?class=garant';
  this.load = function(callback){
    Ajax.call({ action : 'select'}, url, callback);
  }
});
