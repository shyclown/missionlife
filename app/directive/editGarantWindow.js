/*

*/

app.directive('editGarantWindow',['$http', 'Form',
function($http, Form) {
  return {
    restrict: 'E',
    scope:{
      currentFolder : '=',
      openGarant: '=',
      garantWindow: '=',
      afterGarantWindow: '='
    },
    templateUrl: '/missionlife/app/template/edit_form_window.html',
    link: function (scope, element, attrs)
    {

      // manipulated object before save
      const callbackFn = function(){
        console.log('callback');
        console.log('');
        scope.afterGarantWindow();
      }


    }
  };// end of return
}]);
