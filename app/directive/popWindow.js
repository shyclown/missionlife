app.directive('popWindow',function(){
  return{
    restrict: 'E',
    transclude: true,
    //scope:{},
    templateUrl:'app/template/pop_window.html',
    compile: function(){}
  }
});

app.directive('prompt', function(){
  return{
    restrict: 'E',
    transclude: true,
    //scope:{},
    templateUrl:'app/template/prompt_window.html',
    compile: function(){}
  }
});
