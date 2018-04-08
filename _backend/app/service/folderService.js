app.service('Folder',function(Ajax, Shared){

  this.allFolders = {};

  const self = this;
  const url = '/system/ng/call.php?class=folder';
  const stopDefault = function(){ event.stopPropagation(); event.preventDefault();};
  const folderID = function(id){
    let i = 0;
    while(self.allFolders[i].id !== id){ i++; }
    return self.allFolders[i];
  };

  this.listParents = function(folder){
    let parents = [];
    if(folder !== 0){
      while(folder.parent !== 0){
        folder = folderID(folder.parent);
        parents.push(folder);
      }
    }
    return parents;
  };
  this.select_all = function( callback ){
    Ajax.call({action: 'select_all'}, url, function(response){
      console.log(response.data);
      self.allFolders = response.data;
      Shared.explorer.all_folders = response.data;
      if(callback){ callback(response); }
    });
  };

  this.isParent = function(item, target){
    let parent = target.folder.parent;
    let inParents = false;
    while(!inParents && parent != 0){
      if(parent === item.folder.id){ inParents = true; }
      parent = folderID(parent).parent;
    }
    return inParents;
  };

// ----
//  DB
// ----

  this.insert = function(data, callback){

    data.parent = (data.parent === 0) ? 0 : data.parent.id;
    data.name = (!data.name || data.name === '')? data.name = 'NewFolder' : data.name;
    data.order = 0;
    data.action = 'insert';
    data.state = 0;

    Ajax.call(data, url, function(response){
      if(callback){ callback(response); }
      self.select_all();
    });
  };

  this.remove = function(data, callback){

    data.action = 'delete';

    Ajax.call(data, url, function(response){
      if(callback){ callback(response); }
      self.select_all();
    });
  };

  this.orderUp = function(data, callback){
    data.action = 'order_up';
    data.new_order = data.order + 1;
    data.direction = false;
    Ajax.call(data, url, function(response){
      if(callback){ callback(response); }
      self.select_all();
    });
  };

  this.orderDown = function(data, callback){
    data.action = 'order_down';
    data.new_order = data.order - 1;
    data.direction = true;
    Ajax.call(data, url, function(response){
      if(callback){ callback(response); }
      self.select_all();
    });
  };

  this.update = function(data, callback){
    console.log(data);
    data.action = 'update';
    Ajax.call(data, url, function(response){
      if(callback){ callback(response);}
      self.select_all();
    });
  };

  this.updateName = function(data, callback){
    data.action = 'update_name';
    Ajax.call(data, url, function(response){
      if(callback){ callback(response);}
    });
  };

  this.updatePosition = function(data, callback){
    console.log(data);
    data.action = 'update_position';
    Ajax.call(data, url, function(response){
      console.log('update position: ', response.data);
      if(callback){ callback(response);}
    });
  };
  // expects two IDs, itemID and newParentID
  this.updateParent = function(data, callback){
    data.action = 'update_parent';
    Ajax.call.call(data, url, function(response){
      if(callback){ callback(response); }
      self.select_all();
    });
  };
});
