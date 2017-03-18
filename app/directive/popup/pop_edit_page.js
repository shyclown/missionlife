app.directive('popEditPage',['Shared', 'Page',
function(Shared, Page) {
  return {
    restrict: 'E',
    scope:{},
    templateUrl: '/missionlife/app/template/popup/pop_edit_page.html',
    link: function (scope, element, attrs)
    {
      oEditPageWindow = Shared.openElement[attrs.editObj];
      oPage = oEditPageWindow.item;
      callbackFn = oEditPageWindow.callback;
      scope.new = false;
      scope.cancel = function(){ oEditPageWindow.close(); }
      if(oPage){ scope.page = Object.assign({}, oPage); }
      else{ scope.page = {}; scope.new = true; }


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