<style>
#FormArea{
  background-color: #EFEFEF;
}
#FormArea input{
  width: 50%;
  box-sizing: border-box;
  padding: 4px;
}
#FormArea textarea{
  resize: none;
  width: 100%;
  box-sizing: border-box;
  height:100px;
  padding: 8px;
}

</style>

<article class="article card">
<div ng-bind-html='response'></div>
<h2>{{form.name}}</h2>
<div id="FormArea">
<form method="post" target="handleForm.php" ng-submit="submit()">
<div class="field" ng-repeat="field in form.data">
  {{field.name}}:<br>
  <input ng-if="(field.type != 'all')" name="{{field.name}}" placeholder="{{field.name}}" ng-model="input[field.name].value">
  <textarea ng-if="(field.type == 'all')" name="{{field.name}}" placeholder="{{field.name}}" ng-model="input[field.name].value"></textarea>
  <div ng-init="(input[field.name].type = field.type)"></div>
</div>




 <input type="submit" ng-disabled="formInvalid()" value="Submit">
</form>
</div>
</article>
