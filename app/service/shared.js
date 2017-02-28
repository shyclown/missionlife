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


  this.editWindowElement = function( name, window_element_obj, item, callback, scope )
  {
      this.html = '<edit-'+name+'-window edit-obj="'+window_element_obj+'"></edit-'+name+'-window>';
      this.el = $compile( this.html )( scope );
      this.item = item;
      this.callback = callback;
      this.close = function(){ this.el.remove(); };
  }

  this.currentFolder = null;

});
