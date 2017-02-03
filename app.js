const app = angular.module('myapp',['ngRoute','ngSanitize']);

app.controller('viewController',function($scope){
  console.log('viewController');
});
app.config(function($routeProvider, $locationProvider){
  $routeProvider.when('/', {
      templateUrl: 'temp/home.html',
      //controller: 'MainController'
  })
  .when('/garant/', {
      templateUrl: 'temp/garant.html',
      controller: 'garantController'
  })
  .when('/form/', {
      templateUrl: 'temp/form.php',
      controller: 'formController'
  })
  .when('/settings/', {
      templateUrl: 'temp/settings.html',
      controller: 'viewController'
  })
  .when('/home/', {
      templateUrl: 'temp/home.html',
      //controller: 'MainController'
  })
  .when('/article/', {
      templateUrl: 'temp/article.html',
      controller: 'articleController'
  })
  .when('/folders/', {
      templateUrl: 'temp/folders.html',
      controller: 'foldersController'
  })
  .when('/files/', {
      templateUrl: 'temp/files.html',
      controller: 'filesController'
  }).otherwise({ redirectTo: '/' });
  $locationProvider.html5Mode(true);
});
