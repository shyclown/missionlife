const app = angular.module('myapp',['ngRoute','ngSanitize']);

app.controller('viewController',function($scope){
  console.log('viewController');
});

app.config(function ($httpProvider) {
    $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
    $httpProvider.defaults.headers.post['Content-Type'] =  'application/x-www-form-urlencoded';
});
app.config(function($routeProvider, $locationProvider){
  $routeProvider.when('/', {
      templateUrl: 'temp/home.html',
      //controller: 'MainController'
  })
  .when('/pages/', {
      templateUrl: 'temp/pages.html',
      controller: 'pagesController'
  })
  .when('/settings/', {
      templateUrl: 'temp/settings.html',
      controller: 'viewController'
  })
  .when('/home/', {
      templateUrl: 'temp/home.html',
      //controller: 'MainController'
  })
  .when('/folders/', {
      templateUrl: 'temp/folders.html',
      controller: 'foldersController'
  }).otherwise({ redirectTo: '/' });
  $locationProvider.html5Mode(true);
});
