app.directive('popPrompt',['Shared', function(Shared){
  return{
    restrict: 'E',
    transclude: true,
    scope:{},
    templateUrl:'/_backend/app/template/popup/pop_prompt.html',
    link: function(scope, element, attrs){
      const popup = Shared.openPopup[attrs.editObj];

      scope.message = popup.item.message;
      scope.description = popup.item.description;
      scope.acceptBtn = popup.item.acceptBtn;
      scope.cancelBtn = popup.item.cancelBtn;

      scope.accept = function(){
        popup.callback();
        popup.close();
      }
      scope.cancel = function(){ popup.close();}
    }
  }
}]);
