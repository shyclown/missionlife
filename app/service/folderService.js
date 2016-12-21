app.service('Folder',function($http){

  this.allFolders = {};

  const self = this;
  const url = '/missionlife/system/ng/folders.php';

  const ajax = function(data, url, completeFn, errorFn){
    $http({ method: 'POST', url: url, data:data })
    .then( completeFn, errorFn );
  }
  const stopDefault = function(){ event.stopPropagation(); event.preventDefault();}
  const defSuccess = function(response){console.log('success', response.data);};
  const defError = function(response){console.log('error', response);};
  const folderID = function(id){
    let i = 0; while(self.allFolders[i].id != id){ i++; }; return self.allFolders[i];
  }

  this.listParents = function(folder){
    let parents = [];
    if(folder != null){
      while(folder.parent != null){
        folder = folderID(folder.parent);
        parents.push(folder);
      }
    }
    return parents;
  }
  this.select_all = function( callback ){
    ajax({action: 'select_all'}, url, function(response){
      self.allFolders = response.data;
      if(callback){ callback(response); }
    }, defError);
  }
  this.isParent = function(item, target){
    let parent = target.folder.parent;
    let inParents = false;
    while(!inParents && parent != null){
      if(parent == item.folder.id){ inParents = true; }
      parent = folderID(parent).parent;
    }
    return inParents;
  }

// ----
//  DB
// ----

  this.insert = function(data, callback)
  {
    data.parent = (data.parent == null) ? null : data.parent.id;
    data.name = (!data.name || data.name == '')? data.name = 'NewFolder' : data.name;
    data.order = 0;
    data.action = 'insert';
    data.state = 0;
    ajax(data, url, function(response){
      if(callback){ callback(response); }
      self.select_all();
    }, defError);
  }

  this.remove = function(data, callback){
    data.action = 'delete';
    ajax(data, url, function(response){
      if(callback){ callback(response); }
      self.select_all();
    }, defError);
  }
  this.orderUp = function(data, callback){
    data.action = 'order_up';
    ajax(data, url, function(response){
      if(callback){ callback(response); }
      self.select_all();
    }, defError);
  }
  this.orderDown = function(data, callback){
    data.action = 'order_down';
    ajax(data, url, function(response){
      if(callback){ callback(response); }
      self.select_all();
    }, defError);
  }
  this.updateName = function(data, callback){
    data.action = 'update_name';
    ajax(data, url, function(response){
      if(callback){ callback(response); }
    }, defError);
  }
  this.updatePosition = function(data, callback){
    data.action = 'update_position';
    ajax(data, url, function(response){
      if(callback){ callback(response); }
    }, defError);
  }
  // expects two IDs, itemID and newParentID
  this.updateParent = function(data, callback){
    data.action = 'new_parent';
    ajax(data, url, function(response){
      if(callback){ callback(response); }
      self.select_all();
    }, defError);
  }
});
