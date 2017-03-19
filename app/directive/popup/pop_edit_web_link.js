/*
POP UP Select
Select item to callback function provided
*/

app.directive('popEditWebLink',['Shared', 'Page',
function( Shared, Page ) {
  return {
    restrict: 'E',
    scope:{},
    templateUrl: '/missionlife/app/template/popup/pop_edit_web_link.html',
    link: function (scope, element, attrs)
    {
      console.log('link fired');
      const oEditWebLinkWindow = Shared.openElement[attrs.editObj];
      const oLink = oEditWebLinkWindow.item;
      const oCallback = oEditWebLinkWindow.callback;

      scope.new = true;
      if(oLink){ scope.link = Object.assign({}, oLink), scope.new = false; }
      else{ scope.link = { name: '', href: '', new: true } }

      scope.cancel = function(){ oEditWebLinkWindow.close(); }
      scope.save = function(){
        oCallback(scope.link);
        scope.cancel();
      }

      scope.update = function(){
        oLink.href = scope.link.href;
        oLink.innerHTML = scope.link.name;
        scope.link.new = false;
        oCallback(scope.link);
        scope.cancel();
      }
    }
  };
}]);
