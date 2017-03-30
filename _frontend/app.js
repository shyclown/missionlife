// https://tc39.github.io/ecma262/#sec-array.prototype.find
// POLYFILL
if (!Array.prototype.find) {
  Object.defineProperty(Array.prototype, 'find', {
    value: function(predicate) {
      if (this == null) { throw new TypeError('"this" is null or not defined'); }
      var o = Object(this);
      var len = o.length >>> 0;
      if (typeof predicate !== 'function') { throw new TypeError('predicate must be a function'); }
      var thisArg = arguments[1]; var k = 0;
      while (k < len) {
        var kValue = o[k];
        if (predicate.call(thisArg, kValue, k, o)) { return kValue; }
        k++;
      }
      return undefined;
    }
  });
}
// APP //

const app = angular.module('myapp',['ngRoute','ngSanitize']);
app.config(function($routeProvider, $locationProvider){
  $routeProvider.when('/page/:pageID/', {
      templateUrl: 'templates/page.php',
      controller: 'pageView'
  })
  .when('/article/:articleID/',{
      templateUrl: 'templates/article.php',
      controller: 'articlePage'
  }).otherwise({ redirectTo: 'page/4/' });

  $locationProvider.html5Mode(true);
});
