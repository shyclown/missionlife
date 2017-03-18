app.service('Shared',function($document, $compile){

  const self = this;

  this.fn ={
    cloneObject: function(obj){ return Object.assign({},obj); },
    getFileSize: function bytesToSize(bytes) {
       var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
       if (bytes == 0) return '0 Byte';
       var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
       return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    },
    stopDefaultEvent: function(){ event.stopPropagation(); event.preventDefault(); },
    storeRange: function(){ return document.getSelection().getRangeAt(0); },
    selectRange: function(oRange) {
      let oSelection = document.getSelection();
      oSelection.removeAllRanges();
      oSelection.addRange(oRange);
    }
  }
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
  this.setupNewForm = { name: '', email: '', state: 0, data: '[]' }
  this.setupSelect = {
    selectArticle : {
      selectImage: false,
      articles : true,
      files: false,
      forms: false,
      selectFolder: false,
      selectArticleOrFile: true,
      createFolder: false
    },
    selectFile : {
      selectImage: false,
      articles : false,
      files: true,
      forms: false,
      selectFolder: false,
      selectArticleOrFile: true,
      createFolder: false
    },
    selectImage : {
      selectImage: true,
      articles : false,
      files: true,
      forms: false,
      selectFolder: false,
      selectArticleOrFile: false,
      createFolder: false
    },
    selectForm : {
      selectImage: false,
      articles : false,
      files: false,
      forms: true,
      selectFolder: false,
      selectArticleOrFile: true,
      createFolder: false
    },
    selectFolder : {
      selectImage: false,
      articles : false,
      files: false,
      forms: false,
      selectFolder: true,
      selectArticleOrFile: false,
      createFolder: true
    }
  }
  this.window = {
    garant: false,
    article: false,
    file: false,
    form: false
  }

  let windowID = 0;
  this.openElement = [];

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
      item = item || false;
      const generatedID = 'item_'+windowID;
      self.openElement[generatedID] = new directiveOBJ(name, generatedID, item, callback, scope);
      angular.element($document).find('body').append(self.openElement[generatedID].el);
      windowID++;
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
  this.text = {
    edit:{
      folder:{
        top:{
          name: 'Folder Editor'
        },
        name:{
          label: 'Name'
        },
        position:{
          label: 'position',
          top: 'top',
          side: 'side',
          none: 'none',
        },
        state:{
          label: 'state',
          public: 'public',
          private: 'private'
        },
        button:{
          delete: 'delete',
          save: 'save'
        },
        NameLabel: 'Name',
        PositionLabel: 'Position',
        StateLabel: 'State',
      }
    },
    prompt:{
      folder:{
        delete:{
          message: 'Delete folder',
          description: 'You are about to delete the folder',
          cancelBtn: 'Cancel',
          acceptBtn: 'Delete Folder'
        },
        cancel:{
          message: 'Cancel',
          description: 'Save changes?',
          cancelBtn: 'Leave Without Save',
          acceptBtn: 'Save Changes'
        }
      }
    }
  }

});
