/*

*/

app.directive('newFormWindow',['$http', 'Form', function($http, Form) {
  return {
    restrict: 'E',
    scope:{
      currentFolder : '=',
    },
    templateUrl: '/missionlife/app/template/new_form_window.html',
    link: function (scope, element, attrs)
    {
      const copy = function(obj){ return Object.assign({},obj); }
      /* http://stackoverflow.com/questions/2440700/reordering-arrays */
      Array.prototype.move = function (from, to) {
      this.splice(to, 0, this.splice(from, 1)[0]);
      };
      scope.editForm = {};
      scope.newForm = {
        name: '',
        email:'',
        state:0,
        data:'[]'
      }
      scope.order = {
        up: function(arr, obj, index){
          arr.move(index, (index - 1));
          openForm.data = JSON.stringify(arr);
          Form.update_all(openForm);
        },
        down: function(arr, obj, index){
          arr.move(index, (index + 1));
          openForm.data = JSON.stringify(arr);
          Form.update_all(openForm);
        },
      }
      const json = {
        load: function(str){ return JSON.parse(str);},
        save: function(obj){ return JSON.stringify(obj);},
        sort: function(arr){ }
      }

      /* Edit Form */
      scope.editFormWindow = false;
      scope.editForm = {};
      let openForm = {};

      scope.formWindow = function(form){
        openForm = form;
        $scope.editForm = copy(form);
        $scope.editForm.data = JSON.parse($scope.editForm.data);
      }
      scope.addField = function(form){
        form.data.push({
          name: 'fieldName',
          type: 'fieldType',
          order: form.data.length + 1
        });
      }

        openForm.name = form.name;
        openForm.email = form.email;
        openForm.data =  JSON.stringify(form.data);
        Form.update_all(openForm);
      }
        field.type = type;
      }

      const loadForms = function(){
        Form.select_all(function(response){
        });
      }
        return (form.state) ? 'active' : 'inactive';
      }
        form.state = !form.state;
      }
        Form.insert($scope.newForm, loadForms);
      }
        Form.delete(form, loadForms);

      }
        Form.update_all(form);
      }
      loadForms();

    }
  };
}]);
