app.directive('folderItem',['$http','customAjax','uploadDroppedToArticle', function($http, customAjax, uploadDroppedToArticle) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs)
    {
      const targetUrl = '/missionlife/system/ng/upload_file.php';
      const onDragEnd = scope.$eval(attrs.folderItem);

      const stopDefault = function(){ event.stopPropagation(); event.preventDefault();}
      const dragOver = function(folder, el){
        scope.dragTarget.folder = folder;
        scope.dragTarget.el = el;
      }
      const dragItem = function(folder, el){
        scope.dragItem.folder = folder;
        scope.dragItem.el = el;
      }

      element.bind('dragstart', function(event){ dragItem(scope.folder, element); });
      element.bind('dragend', stopDefault );
      element.bind('dragover', stopDefault );
      element.bind('dragenter', function(event){
        stopDefault(event);
        dragOver(scope.folder, element);
      } );
      element.bind('dragleave', stopDefault );
      element.bind('drop', function(event)
      {
        dragOver(scope.folder, element);
        onDragEnd();
        stopDefault(event);
      });
    }
  };
}]);
app.directive('fileItem',['$http','customAjax','uploadDroppedToArticle', function($http, customAjax, uploadDroppedToArticle) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs)
    {
      const targetUrl = '/missionlife/system/ng/upload_file.php';
      const onDragEnd = scope.$eval(attrs.folderItem);
      const stopDefault = function(){
        event.stopPropagation();
        event.preventDefault();
      }

      element[0].addEventListener('click', function(event)
      {
        let el = element[0];
        let form = document.getElementById('articleForm');
        base_offset = {
          x:  el.offsetLeft - event.pageX,
          y:  el.offsetTop - event.pageY - form.scrollTop
        };
        let followMouse = function(event){
          let pos = {
            x: event.pageX + base_offset.x,
            y: event.pageY + base_offset.y
          }
          el.style.pointerEvents = 'none';
          el.style.position = 'absolute';
          el.style.top = pos.y+'px';
          el.style.left = pos.x+'px';
        }

        scope.area.placeholder = scope.area.imagePlaceholder(scope.area.root);
        scope.area.root.appendChild(scope.area.placeholder.el);
        scope.area.placeholder.follow();

        let clafter = function(event){
          scope.area.placeholder.remove();
          console.log('move',getParentInRoot(event.target,scope.area.root));
        }
        window.addEventListener('mousemove',followMouse, true);
        scope.area.root.addEventListener('click',clafter, true);
      },
      false); // click

      element.bind('dragstart', stopDefault);
      element.bind('dragend', stopDefault );
      element.bind('dragover', stopDefault );
      element.bind('dragenter', stopDefault );
      element.bind('dragleave', stopDefault );
      element.bind('drop', stopDefault );
    }
  };
}]);
