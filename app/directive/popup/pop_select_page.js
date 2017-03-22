app.directive('popSelectPage',['Shared', 'Page',
function(Shared, Page) {
  return {
    restrict: 'E',
    scope:{},
    templateUrl: '/missionlife/app/template/popup/pop_select_page.html',
    link: function (scope, element, attrs)
    {
      const oEditPageWindow = Shared.openElement[attrs.editObj];
      const oPage = oEditPageWindow.item;
      const oCallback = oEditPageWindow.callback;

      scope.pages = [];
      scope.selectedPage = {};

      Page.select(function(response){
        scope.pages = response.data;
      });
      scope.selectPage = function(page){ scope.selectedPage = page; }
      scope.cssSelected = function(page){ return scope.selectedPage == page ? 'selected' : ''; }
      scope.cancel = function(){ oEditPageWindow.close(); }
      scope.select = function(){
        if(scope.selectedPage){ scope.selectedPage.type = 'page'; }
        oCallback(scope.selectedPage);
        scope.cancel();
      }
    }
  };
}]);
