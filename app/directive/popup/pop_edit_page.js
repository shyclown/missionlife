app.directive('popEditPage',['Shared', 'Page',
function(Shared, Page) {
  return {
    restrict: 'E',
    scope:{},
    templateUrl: '/missionlife/app/template/popup/pop_edit_page.html',
    link: function (scope, element, attrs)
    {
      const oEditPageWindow = Shared.openElement[attrs.editObj];
      const oPage = oEditPageWindow.item;
      const callbackFn = oEditPageWindow.callback;

      scope.new = false;
      scope.cancel = function(){ oEditPageWindow.close(); }
      if(oPage){ scope.page = Object.assign({}, oPage); console.log(scope.page);}
      else{ scope.page = {}; scope.new = true; }


      scope.setState = function(state){ scope.page.state = state;  }
      scope.isState = function(state){ scope.page.state == state; }
      scope.cssState = function(state){ return scope.page.state == state ? 'selected' : ''; }

      scope.update = function(){
        Page.update(scope.page, callbackFn );
        scope.cancel();
      }
      scope.delete = function(){
        Page.delete(scope.page, callbackFn );
        scope.cancel();
      }
      scope.save = function(){
        Page.insert(scope.page, callbackFn );
        scope.cancel();
      }
    }
  };
}]);
