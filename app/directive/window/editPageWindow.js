/* Uses Editor */

app.directive('editPageWindow',['$http','Folder', 'Article', 'Form', 'uploadDropped', 'Shared',
function($http, Folder, Article, Form, uploadDropped, Shared) {
  return {
    restrict: 'E',
    scope:{},
    templateUrl: '/missionlife/app/template/window/edit_article_window.html',
    link: function (scope, element, attrs)
    {
      

  //-----------------------------------------------------
  // Select Window
  //-----------------------------------------------------

  /* Default */
  scope.popSelect = false;
  scope.cancelPopSelect = function(){ scope.popSelect = false;}
  scope.showPopSelect = function(){  scope.popSelect = true;}
  scope.selectFn = function(selected){ scope.addLinkToArticle(selected.obj); }

  /* Range */
  let storedRange = {};
  /* Add Links to Items */
  const addLink = function(selected){
    Shared.fn.selectRange(storedRange)
    let link = document.createElement('a');
    link.className = 'custom';
    link.href = selected.path+"/"+selected.target;
    link.innerHTML = selected.name;
    scope.area.insertAfterSelection(link);
  }
  /* Event Function */
  const openPopSelect = function(setup, after){ return function(){
      storedRange = Shared.fn.storeRange();
      scope.setupSelect = Shared.setupSelect[setup];
      scope.selectFn = function(selected){ after(selected); }
      scope.showPopSelect();
    }
  }
  scope.selectArticlePop = openPopSelect('selectArticle', addLink);
  scope.selectFilePop = openPopSelect('selectFile', addLink);
  scope.selectFormPop = openPopSelect('selectForm', addLink);

    }// link
  };
}]);
