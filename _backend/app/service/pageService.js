app.service('Page',function(Ajax){
  const url = '/system/ng/call.php?class=page';

  this.select = function(callback){
    let data = {};
    data.action = 'select';
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
  this.reorder = function(data, callback){
    data.action = "reorder";
    Ajax.call(data, url, callback);
  }

  this.attachItem = function(data, callback){
    console.log(data);
    data.action = "attach_item";
    Ajax.call(data, url, callback);
  }
  this.loadItems = function(data, callback){
    data.action = "load_items";
    Ajax.call(data, url, callback);
  }
  // TODO: php side
  this.removeItem = function(data, callback){
    data.action = "remove_item";
    Ajax.call(data, url, callback);
  }

  this.orderUp = function(data, callback){
    data.action = "order_up";
    Ajax.call(data, url, callback);
  }
  this.orderDown = function(data, callback){
    data.action = "order_down";
    Ajax.call(data, url, callback);
  }
});
