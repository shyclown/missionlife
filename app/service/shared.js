app.service('Shared',function(){

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

  this.currentFolder = null;

});
