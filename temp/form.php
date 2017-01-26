<!-- Forms -->
<div ng-bind-html="debug"></div>

<div id="newForm">
  <h3>Create new Form</h3>
  <input ng-model="newForm.name" placeholder="Name of Form">
  <input ng-model="newForm.email" placeholder="Email to">
  <button ng-click="createNewForm()"><i class="fa fa-plus"></i> Create</button>
</div>
  <!-- add response page
  After load of form to selected page we need to set respose page redirect
  or make it default
  -->
  <div class="formLine" ng-repeat="form in forms">
    <span class="name">{{form.name}}</span><span class="email">{{form.email}}</span>
    <button class="edit" ng-click="formWindow(form)"><i class="fa fa-pencil"></i> edit</button>
    <button ng-class="formStateText(form)" ng-click="changeState(form)">{{formStateText(form)}}</button>
    <button class="delete" ng-click="deleteForm(form)"><i class="fa fa-trash"></i></button>
  </div>

<div id="editFormWindow">
  <h1>Edit Form: </h1>
  <div class="main">
  <label>name:</label>
  <input ng-model="editForm.name"/>
  <label>to email:</label>
  <input ng-model="editForm.email"/>
  <button ng-click="addField(editForm)"><i class="fa fa-plus"></i> Add Field</button>
  </div>
  <div ng-if="editForm.data" ng-repeat="field in editForm.data track by $index">
    <input ng-model="field.name"/>
    <button class="type" ng-class="(field.type == 'all')?'selected':''" ng-click="setType('all',field)">all</button>
    <button class="type" ng-class="(field.type == 'name')?'selected':''" ng-click="setType('name',field)">name</button>
    <button class="type" ng-class="(field.type == 'number')?'selected':''" ng-click="setType('number',field)">number</button>
    <button class="type" ng-class="(field.type == 'email')?'selected':''" ng-click="setType('email',field)">email</button>

    <button class="move" ng-if="($index != 0)" ng-click="order.up(editForm.data, field, $index)"><i class="fa fa-chevron-up"></i></button>
    <button class="move" ng-if="($index != editForm.data.length - 1)" ng-click="order.down(editForm.data, field, $index)"><i class="fa fa-chevron-down"></i></button>

  </div>
  <button class="save" ng-click="save(editForm)"><i class="fa fa-save"></i> Save</save>
</div>
