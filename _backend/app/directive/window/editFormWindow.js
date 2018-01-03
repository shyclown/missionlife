app.directive('editFormWindow',['$http', 'Form', 'Shared', function($http, Form, Shared) {
  return {
    restrict: 'E',
    scope:{},
    templateUrl: '/_backend/app/template/window/edit_form_window.html',
    link: function (scope, element, attrs)
    {

      /* http://stackoverflow.com/questions/2440700/reordering-arrays */
      Array.prototype.move = function (from, to) {
      this.splice(to, 0, this.splice(from, 1)[0]);
      };
      // check values when is open

      const oFormWindow = Shared.openElement[attrs.editObj];
      const oForm = oFormWindow.item;

      scope.text = Shared.text.edit.form;
      scope.new = true;

      if(oForm){ scope.form = Object.assign({},oForm); scope.new = false; }
      else{ scope.form = Object.assign({},Shared.setupNewForm); }

      scope.form.data = JSON.parse(scope.form.data);


      const callbackFn = function(){
        oFormWindow.callback();
        oFormWindow.close();
      }
      const orderFn = function(arr, obj, index, value){
        arr.move(index, (index + value));
      }
      scope.order = {
        up: function(arr, obj, index){orderFn(arr, obj, index, -1)},
        down: function(arr, obj, index){orderFn(arr, obj, index, +1)},
      }

      /* Edit Form */
      scope.setType = function(type, field){ field.type = type; }
      scope.formStateText = function(form){ return (form.state) ? 'active' : 'inactive';}
      scope.changeState = function(form){ form.state = !form.state; }

      scope.addField = function(form){
        console.dir(form.data);
        form.data.push({
          name: 'name',
          type: 'type',
          order: form.data.length + 1
        });
      }

      /* Button functions */

      scope.cancel = function(){
        oFormWindow.close();
      }
      scope.insert = function(form){
        form.data = JSON.stringify(form.data);
        Form.insert(form, function(res){ Form.addToFolder({
            form_id: res.data,
            folder_id: Shared.explorer.current_folder.id
          }, function(){
            form.data = JSON.parse(form.data);
            form.id = res.data;
            callbackFn(); });
        });
      }
      scope.save = function(form){
          form.data = JSON.stringify(form.data);
          scope.form = form;
          Form.update_all(form, function(){
            form.data = JSON.parse(form.data);
            callbackFn();
          });
      }
      scope.delete = function(form){ Form.delete(form, function(){
        callbackFn();
      });}
    }
  };// end of return
}]);
