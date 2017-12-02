<section ng-repeat="item in pageItems">

  <article class="card" ng-if="item.type == 1">
    <div class="content shadow">
      <h1>{{item.obj.header}}</h1>
      <p ng-bind-html="item.obj.content"></p>
    </div>
  </article>

  <div ng-if="item.type == 2">
    <h2>Podporili sme</h2>
    <div  class="flex">
    <div class="column" ng-repeat="k in getNumber(columns)">
        <div ng-repeat="article in item.obj" ng-if="$index % columns == 0">
            <div class="card" ng-class="((item.obj[$index+k].open) ? 'open' : 'close')" ng-if="item.obj.length > ($index+k)">
            <!--<div class="card" ng-click="toogleContent(articles[$index+k])">-->
            <div class="content shadow">
              <h2>{{item.obj[$index+k].header}}</h2>
              <p ng-if="!item.obj[$index+k].open" ng-bind-html="perex(item.obj[$index+k].content)"></p>
              <p ng-if="item.obj[$index+k].open" ng-bind-html="item.obj[$index+k].content"></p>
            </div>
            <a href="article/{{item.obj[$index+k].id}}/">citaj viac</a>
          </div>
        </div>
    </div>
    </div>
  </div>

  <article class="card" ng-if="item.type == 3">
    <div class="content shadow">
    <h1>{{item.obj.name}}</h1>
    <div id="FormArea">
    <form ng-submit="submit()" ng-controller="formPage">
      <div class="field" ng-repeat="field in item.obj.data">
        {{field.name}}:<br>
        <input ng-if="(field.type != 'all')" name="{{field.name}}" placeholder="{{field.name}}" ng-model="input[field.name].value">
        <textarea ng-if="(field.type == 'all')" name="{{field.name}}" placeholder="{{field.name}}" ng-model="input[field.name].value"></textarea>
        <div ng-init="(input[field.name].type = field.type)"></div>
      </div>
       <input class="submit" type="submit" ng-disabled="formInvalid()" value="Odoslat">
    </form>
    </div>
    </div>
  </article>

</section>
