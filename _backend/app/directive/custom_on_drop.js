app.directive('customOnDrop',['$http','customAjax','uploadDroppedToArticle', function($http, Ajax, uploadDroppedToArticle) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs)
    {
      console.log('scope check', scope.edit_article);
      const targetUrl = '/system/ng/upload_file.php';
      const completeFn = scope.$eval(attrs.customOnDrop);
      const progressFn = scope.$eval(attrs.customOnUpdate);
      const stopDefault = function(){
        event.stopPropagation();
        event.preventDefault();
      }
      element.bind('dragover',  stopDefault );
      element.bind('dragenter', stopDefault );
      element.bind('dragleave', stopDefault );
      element.bind('drop', function(event)
      {
        stopDefault(event);
        console.log(event);
        uploadDroppedToArticle(event.dataTransfer.files, targetUrl,
           progressFn, completeFn,
          scope.edit_article.id);
      });
    }
  };
}]);

app.directive('isDropArea',['$http',function($http) {
  return {
    restrict: 'A',
    scope: { onDropFn: '=isDropArea' },
    link: function (scope, element, attrs)
    {
      //const onDropFn = scope.$eval(attrs.isDropArea);
      const stopDefault = function(){
        event.stopPropagation();
        event.preventDefault();
      }
      element.bind('dragover',  stopDefault );
      element.bind('dragenter', stopDefault );
      element.bind('dragleave', stopDefault );
      element.bind('drop', function(event)
      {
        stopDefault(event);
        scope.onDropFn(event);
      });
    }
  };
}]);
