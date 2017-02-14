app.directive('addFolder',['$http', function($http) {
  return {
    restrict: 'E',
    templateUrl: '/missionlife/app/template/explorer/add_folder.html',
    link: function (scope, element, attrs)
    { }
  };
}]);
