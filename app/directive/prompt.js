app.directive('wrapprompt',function(){
  return{
    restrict: 'E',
    transclude: true,
    scope:{},
    templateUrl:'app/template/prompt.html',
    link: function(scope, element, attrs){
    }
  }
});
app.directive('prompt',function(){
  return{
    restrict: 'E',
    scope: {
      promptfn: '&'
    },
    templateUrl:'app/template/customPrompt.html',
    link: function(scope, element, attrs){
      scope.message = attrs.message;
      scope.no = attrs.no;
      scope.yes = attrs.yes;
      scope.closePrompt = function(){ element.remove() }
      scope.clickYes = function(){
        scope.promptfn();
        scope.closePrompt();
      }
    }
  }
});
