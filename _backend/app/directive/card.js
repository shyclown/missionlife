app.directive('card',function(){
  return{
    restrict: 'E',
    transclude: {
      'name': '?cardName',
      'content':'?cardContent',
      'control':'?cardControl'
    },
    //scope:{},
    templateUrl:'/_backend/app/template/card.html',
    compile: function(){
      return{
        pre: function(scope, element){},
        post: function(scope, element){
            // REMOVE Header
            let header_el = element[0].getElementsByClassName('el-header')[0];
            let header = angular.element(header_el).find('card-name');
            if(!header.text()){ angular.element(header_el).remove(); }
            // REMOVE Control
            let control_el = angular.element(element[0].getElementsByClassName('el-control')[0]);
            if(!control_el.text()){ angular.element(control_el).remove(); }
        }
      }
    }
  }
});
