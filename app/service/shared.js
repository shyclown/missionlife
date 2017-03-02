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

  const self = this;

  const directiveOBJ = function(name, generatedOBJ, item, callback, scope){
    this.html = '<'+name+' edit-obj="'+generatedOBJ+'"></'+name+'>';
    this.el = $compile( this.html )( scope );
    this.item = item;
    this.callback = callback;
    this.close = function(){ this.el.remove(); };
  }
  this.directiveElement = function( name, item, callback, scope )
  {
      callback = callback || function(){};
      item = item || {};
      const generatedID = 'item_'+windowID;
      const generatedOBJ = 'openWindows.'+generatedID;
      scope.openWindows[generatedID] = new directiveOBJ(name, generatedOBJ, item, callback, scope);
      windowID++;
      return scope.openWindows[generatedID];
  }

  let popupID = 0;
  this.openPopup = [];

  this.prompt = function(item, callback, scope){
    const generatedID = 'item_'+popupID;
    self.openPopup[generatedID] = new directiveOBJ('pop-prompt', generatedID, item, callback, scope);
    angular.element($document).find('body').append(self.openPopup[generatedID].el);
    popupID++;
  }

  this.document = $document;

  this.currentFolder = null;

});
