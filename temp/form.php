<!-- Forms -->
<div ng-bind-html="debug"></div>

<div id="newForm">
  <h3>Create new Form</h3>
  <input ng-model="newForm.name" placeholder="Name of Form">
  <input ng-model="newForm.email" placeholder="Email to">
  <button ng-click="createNewForm()"><i class="fa fa-plus"></i> Create</button>
</div>

  <div class="formLine" ng-repeat="form in forms">
    <input ng-model="form.name" ng-change="updateForm(form)" placeholder="Name of Form">
     to <input ng-model="form.email" ng-change="updateForm(form)" placeholder="email">
     <button class="edit" ng-click="formWindow(form)"><i class="fa fa-pencil"></i> edit</button>
    <button ng-class="formStateText(form)" ng-click="changeState(form)">{{formStateText(form)}}</button>
    <button class="delete" ng-click="deleteForm(form)"><i class="fa fa-trash"></i></button>
  </div>

<div id="editFormWindow">
  <h1>Edit Form</h1>
  <h2>Form Name</h2>
  <input ng-model="editForm.name"/>
  <input ng-model="editForm.email"/>
  <button ng-click="addField(editForm)">Add Field</button>

  <div ng-if="editForm.data" ng-repeat="field in editForm.data track by $index">
    <input ng-model="field.name"/>
    <input ng-model="field.type"/>
    <button ng-click="order.up(field)">Up</button>
    <button ng-click="order.down(field)">Down</button>

  </div>
</div>
