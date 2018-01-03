/*
POP UP Select
Select item to callback function provided
*/

app.directive('popEditWebLink',['Shared', 'Page',
function( Shared, Page ) {
  return {
    restrict: 'E',
    scope:{},
    templateUrl: '/_backend/app/template/popup/pop_edit_web_link.html',
    link: function (scope, element, attrs)
    {
      console.log('link fired');
      const oEditWebLinkWindow = Shared.openElement[attrs.editObj];
      const oLink = oEditWebLinkWindow.item;
      const oCallback = oEditWebLinkWindow.callback;

      scope.text = Shared.text.edit.weblink;

      scope.new = true;
      if(oLink){
        scope.link = Object.assign({}, oLink), scope.new = false; }
      else{
        let oSelection = Shared.fn.selectRange(Shared.storedRange);
        scope.link = { name: oSelection.toString(), href: '', new: true }
      }
      scope.link.type = 'weblink';

      scope.cancel = function(){ oEditWebLinkWindow.close(); }
      scope.save = function(){
        console.log(scope.link);
        oCallback(scope.link);
        scope.cancel();
      }

      scope.update = function(){
        oLink.href = scope.link.href;
        oLink.innerHTML = scope.link.name;
        scope.link.new = false;

        console.log(scope.link);
        //
        oCallback(scope.link);
        scope.cancel();
      }
    }
  };
}]);
