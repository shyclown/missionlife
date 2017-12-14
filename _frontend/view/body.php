<body ng-app='myapp' ng-controller='viewFront'>
  <div id="pageWrap">
  <!-- php debug -->
  <div ng-bind-html="php"></div>

  <!-- TOP -->
  <header ng-if="!collapsedNav">
    <img id="imageLogo" src="/uploads/image/{{settings.logo}}">
    <h1>{{settings.page_name}}</h1>
    <p class="motto">{{settings.page_motto}}</p>
  </header>
  <div ng-if="collapsedNav" class="collapsed">
    <button ng-click="toogleHiddenNav()"><i class="fa fa-bars"></i></button>
    <img src="/uploads/image/{{settings.logo}}">
    <h1>{{settings.page_name}}</h1>
  </div>

  <nav ng-if="!collapsedNav" id="topNav">
    <ul>
      <li ng-repeat="page in topNav"><a href="#" ng-click="selectPage(page)">{{page.name}}</a></li>
    </ul>
  </nav>

  <div ng-if="collapsedNav">
    <nav ng-show="showHiddenNav" id="hiddenNav">
      <ul>
        <li ng-repeat="page in topNav"><a href="#" ng-click="selectPage(page)">{{page.name}}</a></li>
        <li ng-repeat="page in sideNav"><a href="#" ng-click="selectPage(page)">{{page.name}}</a></li>
      </ul>
    </nav>
  </div>

  <div id="pageContent">
  <!--MAIN CONTENT -->
    <div id="contentMain">
        <?php
        if(isset($_GET) && isset($_GET['ECDSA'])){
          require( $_SERVER['DOCUMENT_ROOT']."/system/tatrapay/verify.php");

          if(verifyTatraPay()){
            echo '<h1>Ďakujeme!</h1>';
          }
        }
        ?>
        <div ng-view></div>
        <section>
        <h2>Spolupracuju s nami:</h2>
        <div class="flex">
        <div class="column" ng-repeat="i in getNumber(garant_col)" >
            <div ng-repeat="garant in garants" ng-if="$index % garant_col == 0">
              <div class="card" ng-if="garants.length > $index + i">
                <div class="content shadow">
                  <p>{{garants[$index+i].content}}</p>
                  <img src="/uploads/image/{{garants[$index+i].image}}" ng-if="garants[$index+i].image"/>
                  <h3>{{garants[$index+i].header}}</h3>
                  <p class="title">{{garants[$index+i].title}}</p>
                </div>
                <a ng-if="garants[$index+i].webpage" href="{{garants[$index+i].webpage}}" target="_blank">
                    navstiv stranku
                </a>
              </div>
            </div>
        </div>
        </div>
        </section>
    </div>

  <!-- SIDE -->
  <!-- SIDE  -->
  <div id="sideContent" ng-if="!hideSide" >
    <nav id="sideNav" >
      <style>.tatrapay{
        vertical-align: middle;
        line-height: 2rem;
        }
        .tatrapay img{
          display: inline-block;
          vertical-align: middle;
          height: 2rem;
          padding-right: 1rem;

          }</style>
        <ul>
          <li><a href="#" class="tatrapay" ng-click="selectTatraPay()"><img class="tp"  src="/TPlogo_white.png" alt="TatraPay Logo">Daruj</a></li>
          <li ng-repeat="page in sideNav"><a href="#" ng-click="selectPage(page)">{{page.name}}</a></li>
        </ul>
    </nav>
    <section >
        <h2>Spolupracuju s nami:</h2>
        <div class="card" ng-if="garants">
          <div class="content shadow">
            <p class="motto">{{garants[garantPick].content}}</p>
            <img src="/uploads/image/{{garants[garantPick].image}}" ng-if="garants[garantPick].image"/>
            <h3>{{garants[garantPick].header}}</h3>
            <p class="title">{{garants[garantPick].title}}</p>
          </div>
          <a ng-if="garants[garantPick].webpage" href="{{garants[garantPick].webpage}}" target="_blank">
              navstiv stranku
          </a>
        </div>
    </section>
    <div>
  </div><!--PageContent-->
  </div><!--PageWrap-->
</body>
