app.controller('pagesController',function($scope, $sanitize, Shared, Page, Article){

  $scope.php = '';
  $scope.pages = [];
  $scope.onPage = [];
  $scope.currPage = false;
  $scope.currPageItems = [];

  const loadPages = function(){
    Page.select(function(response){ $scope.pages = response.data; console.log(response); });
  }
  loadPages();

  $scope.$watch(
    function() { return $scope.currPage; },
    function() { console.log($scope.currPage.id);},
    true
  )

  $scope.openPage = function(page){
    $scope.currPageItems = [];
    $scope.currPage = page;
    Page.loadItems({page_id: $scope.currPage.id},function(response){
      response.data.forEach(function(item){
        if(item.type === 1){
          Article.select_by_id({id: item.item_id},function(res){
            item.obj = res.data[0];
            item.obj.content = decodeURIComponent(item.obj.content);
        });}
        $scope.currPageItems.push(item);
      })
    })
  }
  const getIntType = function(stringType){ if(stringType === "article"){ return 1; } }
  const readIntType = function(intType){ if(intType === 1){ return 'article'; } }

  /* POP EDIT PAGE */
  $scope.openPopEditPage = function(page){
    new Shared.directiveElement('pop-edit-page', page, function(){ loadPages();}, $scope);
  }
  /* REMOVE */
  $scope.removeItem = function(item){
    // item should be retreived object with id attached already
    Page.removeItem({ id:item.id },function(){ $scope.openPage($scope.currPage); })
  }

  /* REORDER */
  $scope.orderUp = function(item){
    if(item.order == 0){ console.warn('item is on top of stack');; }
    else{ Page.orderUp(item, function(){ $scope.openPage($scope.currPage); }); }
  }
  $scope.orderDown = function(item){
    if(item.order == $scope.currPageItems.length - 1){ console.warn('item is already at bottom of the stack'); }
    else{ Page.orderDown(item, function(){ $scope.openPage($scope.currPage);});  }
  }

  /* POP SELECT WINDOW */
  $scope.openSelectArticle = function(){
    new Shared.directiveElement('pop-select', Shared.setupSelect.selectArticle, function(selection){
      $scope.onPage.push(selection);
      Page.attachItem({
        page_id:  $scope.currPage.id,
        item_id: selection.target,
        type: getIntType(selection.type),
        order: $scope.currPageItems.length
      }, function(res){ $scope.openPage($scope.currPage)})
    }, $scope);
  }
});
