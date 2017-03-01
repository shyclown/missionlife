app.service('Shared',function($document, $compile){

  this.explorer = {
    current_folder: null,
    all_folders: {},
    articles: {},
    forms: {},
    garants: {},
    files: {},
    currentParents : [],
    openFoldersInTree : []
  }

  this.window = {
    garant: false,
    article: false,
    file: false,
    form: false
  }

  let windowID = 0;
  this.openWindows = [];

  const directiveOBJ = function(name, generatedOBJ, item, callback, scope){
    this.html = '<'+name+' edit-obj="'+generatedOBJ+'"></'+name+'>';
    this.el = $compile( this.html )( scope );
    this.item = item;
    this.callback = callback;
    this.close = function(){ this.el.remove(); };
  }
  this.directiveElement = function( name, item, callback, scope )
  {
      const generatedID = 'item_'+windowID;
      const generatedOBJ = 'openWindows.'+generatedID;
      scope.openWindows[generatedID] = new directiveOBJ(name, generatedOBJ, item, callback, scope);
      windowID++;
      return scope.openWindows[generatedID];
  }




  this.currentFolder = null;

});
