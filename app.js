const app = angular.module('myapp',['ngRoute','ngSanitize']);

app.service('pageInfo',function(){
  this.data = {
    name: '::swosh',
    motto: 'motto'
  }
});
app.controller('viewController',function(pageInfo, Garant,$scope){
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
