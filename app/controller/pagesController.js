app.controller('pagesController',function($scope, $sce, $sanitize, Shared, Page, Article, Form){

  $scope.php = '';
  $scope.pages = [];
  $scope.onPage = [];
  $scope.currPage = false;
  $scope.currPageItems = [];
  $scope.columns = 2;

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
            item.obj.content = $sce.trustAsHtml(decodeURIComponent(item.obj.content));
        });}
        if(item.type === 2){
          Article.selectByFolder({folder_id: item.item_id},function(res){
            res.data.result.forEach(function(article){
              article.content = decodeURIComponent(article.content);
            });
            item.obj = res.data.result;
        });}
        if(item.type === 3){
          Form.select_by_id({id: item.item_id},function(res){
              console.log(res.data[0]);
              item.obj = res.data[0];
              item.obj.data = JSON.parse(item.obj.data);
        });}
        $scope.currPageItems.push(item);
      })
    })
  }
  const getIntType = function(stringType){
    if(stringType === "article"){ return 1; }
    if(stringType === "folder"){ return 2; }
    if(stringType === "form"){ return 3; }
  }
  const readIntType = function(intType){
    if(intType === 1){ return 'article'; }
    if(intType === 2){ return 'folder'; }
    if(intType === 3){ return 'form'; }
  }

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
    else{   item.obj = [];
      console.log(item);
      Page.orderUp(item, function(){ $scope.openPage($scope.currPage); });
    }
  }
  $scope.orderDown = function(item){
    console.log(item);

    if(item.order == $scope.currPageItems.length - 1){ console.warn('item is already at bottom of the stack'); }
    else{   item.obj = [];
      Page.orderDown(item, function(){ $scope.openPage($scope.currPage);});
    }
  }

  const attachItem = function(selection){
    $scope.onPage.push(selection);
    Page.attachItem({
      page_id:  $scope.currPage.id,
      item_id: selection.target,
      type: getIntType(selection.type),
      order: $scope.currPageItems.length
    }, function(res){ $scope.openPage($scope.currPage)})
  }
  $scope.getNumber = function(num){
    let arr = []; let i = 0; while(i != num){
      arr.push(i); i++; }
    return arr;
  }

  /* POP SELECT WINDOW */
  const sSetup = Shared.setupSelect;

  $scope.openSelectArticle = function(){
    new Shared.directiveElement(
      'pop-select', sSetup.selectArticle, attachItem, $scope);
  }
  $scope.openSelectFolder = function(){
    new Shared.directiveElement(
      'pop-select', sSetup.selectFolder, attachItem, $scope);
  }
  $scope.openSelectForm = function(){
    new Shared.directiveElement(
      'pop-select', sSetup.selectForm, attachItem, $scope);
  }
});
