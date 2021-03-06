app.controller('pagesController',function($scope, $sce, $sanitize, Shared, Page, Article, Form){

  $scope.php = '';
  $scope.pages = [];
  $scope.onPage = [];
  $scope.currPage = false;
  $scope.currPageItems = [];
  $scope.columns = 2;

  const loadPages = function(){
    Page.select(function(response){
      $scope.pages = response.data;
      $scope.$apply(); // we need to apply scope after new ajax is used
      });
  }
  loadPages();

  $scope.$watch(
    function() { return $scope.currPage; },
    function() { console.log($scope.currPage.id);},
    true
  );

  const Placeholder = function(){
    const self = this;
    this.el = document.createElement('div');
    this.el.className = 'orderPlaceholder';
    this.remove = function(){
      self.shrink();
      setTimeout( function(){ removeElement(self.el); }, 400);
    }
    this.shrink = function(){
      this.el.style.height = '0px';
      this.el.style.marginTop = '0px';
    }
    this.grow = function(){
      self.el.style.height = '40px';
      self.el.style.marginTop = '8px';
    }
  }

  const pageOBJ = function(el){
    var self = this;
    this.el = el;
    this.addEv = self.el.addEventListener('mousemove',oMouseOver, false);
    this.removeEv = self.el.removeEventListener('mousemove', oMouseOver, false);
  }

  // Reordering pages
  let draggedItem;
  let targetOrder;

  let last = { item : false, position : '',  placeholder : ''}
  let target = '';
  let dragin = false;

  const unFocus = function () {
    if (document.selection) {
      document.selection.empty()
    } else {
      window.getSelection().removeAllRanges()
    }
  }

  $scope.oMouseOver = function(event){
    unFocus(); // prevent focusing text while dragging over it
    const item = event.currentTarget;
    const label = item.dataset.label;

    const movePlaceholder = function(){
      const getPosition = function(){
        console.log(item.clientHeight);

        // Firefox - offsetY Polyfill

        let rect = item.getBoundingClientRect();
        let offsetX = event.clientX - rect.left;
        let offsetY = event.clientY - rect.top;


        if(offsetY > item.clientHeight - 18){ return 'bottom'; }
        if(offsetY < 18){ return 'top'; } else { return false; }
      }
      const oMove = function(){
        if(last.placeholder){ last.placeholder.remove(); }
        const newPlaceholder = new Placeholder();
        if(oPosition == 'top' && !label){ insertBefore(newPlaceholder.el, item); }
        // if its label we always insertAfter
        else if(oPosition == 'bottom' || label){ insertAfter(newPlaceholder.el, item); }
        setTimeout(function(){ newPlaceholder.grow(); },0);
        last.placeholder = newPlaceholder;
        last.item = item;
        last.position = oPosition;
      }
      const oPosition = getPosition();

      if(oPosition){ if(last.item != item || last.position != oPosition){
        if((oPosition == 'top' && item.previousElementSibling != last.placeholder.el) ||
          (oPosition == 'bottom' && item.nextElementSibling != last.placeholder.el)){
          oMove();
      }}}
    }
    if(dragin){
      let target = item;
      setTimeout(function(){ if(target == item) { movePlaceholder(); } },150);
    }
  }

  $scope.oMouseDown = function(event){
    const item = event.currentTarget;

    let stillDown = true;
    let isMoving = false;
    let mouseOff = event.offsetY; // offset in element

    const followMouse = function(event){
      if(event.currentTarget == item);
      if(stillDown){
        isMoving = true;
        dragin = true;
        item.style.position = 'absolute';
        item.style.pointerEvents = 'none';
        item.style.top = event.pageY- mouseOff - 64 +'px';
      }
    }

    const placeItem = function(){
      stillDown = false;
      if(isMoving){
        let dataReorder;

        if(last.item.dataset.label){
          dataReorder = {
            id: draggedItem.dataset.id,
            old_order: draggedItem.dataset.order || 0,
            new_order: 0,
            new_state: last.item.dataset.label
          }
        }
        else{
          if(last.item.dataset.order < draggedItem.dataset.order){
            if(last.position == 'top'){ targetOrder = last.item.dataset.order }
            if(last.position == 'bottom'){ targetOrder = last.item.dataset.order+1; }
          }
          if(last.item.dataset.order > draggedItem.dataset.order){
            if(last.position == 'top'){ targetOrder = last.item.dataset.order-1; }
            if(last.position == 'bottom'){ targetOrder = last.item.dataset.order; }
          }
          dataReorder = {
            id: draggedItem.dataset.id,
            old_order: draggedItem.dataset.order,
            new_order: targetOrder,
            new_state: last.item.dataset.state
          }
        }
        dragin = false;
        // remove placeholder
        removeElement(last.placeholder.el);
        Page.reorder( dataReorder, function(res){ console.log(res.data);   loadPages(); });
      }

      item.removeAttribute('style');
      item.classList.remove('shadow');
      window.removeEventListener('mousemove', followMouse, false);
      window.removeEventListener('mouseup', placeItem, false )
    }
    window.addEventListener('mouseup', placeItem, false );

    setTimeout(function (){
      if(stillDown){
        draggedItem = item;
        item.classList.add('shadow');
        window.addEventListener('mousemove', followMouse, false );
      }
    }, 250);
  }


  $scope.openPage = function(page){
    $scope.currPageItems = [];
    $scope.currPage = page;

    Page.loadItems(
      {page_id: $scope.currPage.id},
      function(response){
        response.data.forEach(function(item){
          if(item.type === 1){
            Article.select_by_id({id: item.item_id},function(res){
              let article = res.data[0];
              if(article.content){
              article.content = $sce.trustAsHtml(decodeURIComponent(article.content));
              }
              $scope.$apply();
          });}
          if(item.type === 2){
            Article.selectByFolder({folder_id: item.item_id},function(res){
              res.data.result.forEach(function(article){
                if(article.content){
                  article.content = decodeURIComponent(article.content);
                }
              });
              item.obj = res.data.result;
              $scope.$apply();
          });}
          if(item.type === 3){
            Form.select_by_id({id: item.item_id},function(res){
                item.obj = res.data[0];
                item.obj.data = JSON.parse(item.obj.data);
                $scope.$apply();
          });}
        $scope.currPageItems.push(item);
        $scope.$apply();
      });
    });
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
    Page.removeItem({ id:item.id },function(){ $scope.openPage($scope.currPage); $scope.$apply();})
  }

  /* REORDER */
  $scope.orderUp = function(item){

    if(item.order == 0){ console.warn('item is on top of stack');; }
    else{   item.obj = [];
      console.log(item);
      Page.orderUp(item, function(){ $scope.openPage($scope.currPage); $scope.$apply(); });
    }
  }
  $scope.orderDown = function(item){
    console.log(item);

    if(item.order == $scope.currPageItems.length - 1){ console.warn('item is already at bottom of the stack'); }
    else{   item.obj = [];
      Page.orderDown(item, function(){ $scope.openPage($scope.currPage); $scope.$apply();});
    }
  }

  const attachItem = function(selection){
    $scope.onPage.push(selection);
    Page.attachItem({
      page_id:  $scope.currPage.id,
      item_id: selection.target,
      type: getIntType(selection.type),
      order: $scope.currPageItems.length
    }, function(res){ $scope.openPage($scope.currPage); $scope.$apply();})
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
