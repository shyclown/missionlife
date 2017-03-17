/*
POP UP Select
Select item to callback function provided
*/

app.directive('popNewPage',['Shared', 'Page',
function(Shared, Page) {
  return {
    restrict: 'E',
    scope:{},
    templateUrl: '/missionlife/app/template/popup/pop_new_page.html',
    link: function (scope, element, attrs)
    {
      console.log('open');
      oNewPageWindow = Shared.openElement[attrs.editObj];
      console.log(oNewPageWindow);
      callbackFn = oNewPageWindow.callback;

      scope.name = '';
      scope.cancel = function(){ oNewPageWindow.close(); }
      scope.save = function(){
        Page.insert({
          name: scope.name
        }, callbackFn );
        scope.cancel();
      }
    }
  };
}]);
