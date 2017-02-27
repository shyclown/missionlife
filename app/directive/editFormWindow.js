/*

*/

app.directive('editFormWindow',['$http', 'Form', function($http, Form) {
  return {
    restrict: 'E',
    scope:{
      currentFolder : '=',
      openForm: '=',
      formWindow: '=',
      afterFormWindow: '='
    },
    templateUrl: '/missionlife/app/template/edit_form_window.html',
    link: function (scope, element, attrs)
    {
      const copy = function(obj){ return Object.assign({},obj); }
      /* http://stackoverflow.com/questions/2440700/reordering-arrays */
      Array.prototype.move = function (from, to) {
      this.splice(to, 0, this.splice(from, 1)[0]);
      };
      // check values when is open
      let sourceForm;
      scope.editForm;
      scope.$watch(
        function(){ return scope.openForm; },
        function(){
          sourceForm = scope.openForm;
          if(!sourceForm){ scope.editForm = copy(newForm); }
          else{ scope.editForm = copy(sourceForm); }
          scope.editForm.data = JSON.parse(scope.editForm.data);
        },
        true
      )
      scope.cancel = function(){ scope.formWindow = false; }
      const newForm = { name: '', email: '', state: 0, data: '[]' }
      // manipulated object before save
      const callbackFn = function(){ scope.afterFormWindow(); }
      const orderFn = function(arr, obj, index, value){
        arr.move(index, (index + value));
        //openForm.data = JSON.stringify(arr);
        //Form.update_all(openForm);
      }
      scope.order = {
        up: function(arr, obj, index){orderFn(arr, obj, index, -1)},
        down: function(arr, obj, index){orderFn(arr, obj, index, +1)},
      }

      /* Edit Form */

      scope.addField = function(form){
        form.data.push({ name: 'name', type: 'type', order: form.data.length + 1 });
      }
      scope.save = function(form){
        if(!form.id){
          form.data = JSON.stringify(form.data);
          Form.insert(form, function(res){ Form.addToFolder({
              form_id: res.data,
              folder_id: scope.currentFolder.id
            }, function(){
              form.data = JSON.parse(form.data);
              form.id = res.data;
              callbackFn(); });
          });
        }
        else{
          form.data = JSON.stringify(form.data);
          scope.form = form;
          Form.update_all(form, function(){
            form.data = JSON.parse(form.data);
            callbackFn();
          });
        }
      }
      scope.setType = function(type, field){ field.type = type; }
      scope.formStateText = function(form){ return (form.state) ? 'active' : 'inactive';}
      scope.changeState = function(form){ form.state = !form.state; }
      scope.deleteForm = function(form){ Form.delete(form, function(){
        callbackFn();
      });}
    }
  };// end of return
}]);
