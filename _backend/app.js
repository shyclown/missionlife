const app = angular.module('myapp',['ngRoute','ngSanitize']);


app.controller('viewController',function($scope){
  console.log('viewController');
});

app.config(function($routeProvider, $locationProvider){
  $routeProvider.when('/', {
      templateUrl: 'view/home.html',
      //controller: 'MainController'
  })
  .when('/pages/', {
      templateUrl: 'view/pages.html',
      controller: 'pagesController'
  })
  .when('/settings/', {
      templateUrl: 'view/settings.html',
      controller: 'settingsController'
  })
  .when('/home/', {
      templateUrl: 'view/home.html',
      //controller: 'MainController'
  })
  .when('/folders/', {
      templateUrl: 'view/folders.html',
      controller: 'foldersController'
  }).otherwise({ redirectTo: '/folders/' });
  $locationProvider.html5Mode(true);
});
