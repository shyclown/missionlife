app.directive('addFolder',['$http', function($http) {
  return {
    restrict: 'E',
    templateUrl: '/_backend/app/template/explorer/add_folder.html',
    link: function (scope, element, attrs)
    { }
  };
}]);
