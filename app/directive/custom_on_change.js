app.directive('customOnChange', function() {
  return {
    restrict: 'A',
    scope: { onChangeHandler: '=customOnChange' },
    link: function (scope, element, attrs) {
      element.bind('change', function(event){
        event.stopPropagation();
        event.preventDefault();
        scope.onChangeHandler(event);
    });
    }
  };
});
