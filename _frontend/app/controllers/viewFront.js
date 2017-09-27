app.controller('viewFront',
function($scope, Shared, Ajax, $sce, Form, $sanitize, $routeParams, $location, Data, Page, Article, Garant){

  $scope.php;
  $scope.settings = {};
  $scope.garants;
  $scope.columns = 2;
  $scope.garant_col = 3;
  $scope.hasArticles = false;
  $scope.hideSide = false;
  $scope.pageItems = [];
  $scope.collapsedNav = true;
  $scope.showHiddenNav = false;

  $scope.toogleHiddenNav = function(){
    console.log('showHiddenNav');
    $scope.showHiddenNav = !$scope.showHiddenNav;
  }


  const getArrayOfItems = function(){
    $scope.pageItems = [];
    if($routeParams.pageID && Shared.pages){
      let foundPage = Shared.pages.find(function(page){ return page.id == $routeParams.pageID; });
      if(foundPage){
        Shared.current_page = foundPage;
        Page.loadItems({page_id: Shared.current_page.id },
          function(response){
              response.data.forEach(function(item){
                // Article
                if(item.type === 1){
                  Article.selectByID({id: item.item_id},function(res){
                    item.obj = res.data[0];
                    item.obj.content = $sce.trustAsHtml(decodeURIComponent(item.obj.content));
                    $scope.$apply(); // important!
                });}
                // Folder
                if(item.type === 2){
                  Article.selectByFolder({folder_id: item.item_id},function(res){
                    res.data.result.forEach(function(article){
                      article.content = decodeURIComponent(article.content);
                    });
                    item.obj = res.data.result;
                    $scope.$apply(); // important!
                });}
                // Form
                if(item.type === 3){
                    Form.selectByID(item.item_id,function(res){
                    item.obj = res.data[0];
                    item.obj.data = JSON.parse(item.obj.data);
                    $scope.$apply(); // important!
                });}
                $scope.pageItems.push(item); // Save
              });
        });
      }
    }
  }

  Page.loadPages(function(response){
    Shared.pages = response.data;
    $scope.topNav = Shared.pages.filter(function(page){ return page.state == 1; });
    $scope.sideNav = Shared.pages.filter(function(page){ return page.state == 2; });
    getArrayOfItems();
    $scope.resize();
  });

  $scope.selectPage = function(page){ $scope.showHiddenNav = false; $location.path('/page/'+ page.id+'/'); }
  $scope.$on('$routeChangeSuccess', function() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    if($routeParams.pageID){ getArrayOfItems(); }
  });


  const url = '/system/ajax.php';

  const loadSettings = function(){ Data.loadSettings(function(response){
      $scope.settings = Shared.settings;
  });}
  const loadArticles = function(){ Article.selectByCurrentPage(function(response){
      response.data.result.forEach(function(item){ item.content = decodeURIComponent(item.content); });
      $scope.articles = response.data.result;
  });}
  const loadGarants = function(){ Garant.load(function(response){
        $scope.garants = response.data;
        $scope.garantPick = Math.floor(Math.random()*$scope.garants.length);
  });}

  const sanitizeString = function(string){ return $sanitize(string); }
  $scope.sizeOfString = function(string){ let str = sanitizeString(string); }

  loadSettings();
  loadGarants();



  /* COLUMNS IN VIEW FUNCTIONS */

  $scope.getNumber = function(num){
      let arr = []; let i = 0; while(i != num){
        arr.push(i); i++; }
      return arr;
  }
  const resized = function(){
    let change = $scope.resize();
    if(change){ $scope.$apply(); }
  }
  window.addEventListener('resize', resized, false);
  $scope.$on("$destroy",function (){
       window.removeEventListener('resize', resized, false);
  });
  $scope.resize = function(){
    let w = window.innerWidth;
    if(screen.width <= w){ w = screen.width; }

    let change = false;
    if(w >= 1080 && $scope.columns != 3){
      $scope.columns = 3;
      $scope.garant_col = 3;
      $scope.hideSide = false;
      $scope.collapsedNav = false;
      change = true;
    }
    if(w < 1080 && w > 768 && ($scope.columns != 2 || $scope.hideSide == true)){
      $scope.columns = 2;
      $scope.garant_col = 2;
      $scope.hideSide = false;
      $scope.collapsedNav = false;
      change = true;
    }
    if(w <= 768 && w > 540 && ($scope.columns != 2 || $scope.hideSide == false)){
      $scope.columns = 2;
      $scope.garant_col = 2;
      $scope.hideSide = true;
      $scope.collapsedNav = true;
      change = true;
    }
    if(w <= 540 ){
      $scope.columns = 1;
      $scope.garant_col = 2;
      $scope.hideSide = true;
      $scope.collapsedNav = true;
      change = true;
    }
    return change;
  }

});
