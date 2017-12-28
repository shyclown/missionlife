app.service('Prompt',function(Shared){
  // prompts

  /*
  requires
  item.message : message
  item.description: description
  item.acceptBtn: accept button text
  item.cancelBtn: cancel button text

  */
  function promptObject(message, description, accept, cancel){
    return { message: message, description: description, acceptBtn: accept, cancelBtn: cancel }
  }
  this.load = {
    cancelNewArticle: function(callback, scope){
      Shared.prompt(promptObject('Article was not saved', 'All changes will be lost', 'Cancel', 'Do not save'))};
  }
  this.load = function(){

  }
}
