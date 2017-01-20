app.controller('filesController',function($scope, $compile, $http, Ajax){

  $scope.files = [];
  $scope.folder = 'article';
  $scope.page = 1;
  $scope.allFiles = 0;


  let onePageSize = 5;
  let sortByData = 'name';
  let sortOrder = true;

  $scope.details = {
    show: false,
    file: false,
    open: function(){ this.show = true; this.clear },
    close: function(){ this.show = false; this.clear },
    clear: function(){ this.data = {}; },
    data:{}
  }

  $scope.sizeMB = function(byte){ return Math.round(byte/(1024*1024)*100)/100; }
  // pageControl

  // folder Function
  $scope.openFolder = function(folder){ $scope.folder = folder; loadSelected(); }
  $scope.closeFolder = function(folder){ $scope.folder = false; }
  $scope.folderSelected = function(folder){ if($scope.folder == folder){ return "selected"; } }

  $scope.allPages = function(){ return Math.ceil($scope.allFiles / onePageSize);}

  // sortBy
  $scope.sortBy = function(value){ sortByData = value; if(sortByData == value){ sortOrder = !sortOrder; }; loadSelected(); }
  $scope.sortBySelected = function(name){ if(sortByData == name){ return "selected"; } }

  // Page
  $scope.perPage = function(size){ onePageSize = size; $scope.page = 1; loadSelected(); }
  $scope.perPageSelected = function(size){ if(onePageSize == size){ return "selected"; } }
  $scope.nextPage = function(){ $scope.page++; loadSelected();  }
  $scope.prevPage = function(){ $scope.page--; loadSelected();  }
  $scope.nextPageShow = function(){ return $scope.page < $scope.allPages()}
  $scope.prevPageShow = function(){ return $scope.page > 1; }
  // Ajax
  const url = '/missionlife/system/ng/files.php';
  // Default ajax responses
  const defSuccess = function(response){ $scope.files = response.data.result; $scope.allFiles = response.data.all_rows[0]['FOUND_ROWS()'] }
  const defError = function(response){ console.log(response.data);}

  // Ajax Actions

  // TODO : function sends name of folder but there is no folder name in table_name
  /* plan is remove table garants and add column to the article table make is possible create new folders easy on run
  *  [ ] - add column 'folder' to articles - rename articles to text-content <- do not implement
  *  [ ] - delete functionality
  */
  const loadSelected = function()
  {
    Ajax.call({
    action: 'load_selected',
    sort_by: sortByData,
    folder: $scope.folder,
    order: sortOrder,
    limit_min:($scope.page-1)*onePageSize,
    limit_max: onePageSize
    },
    url,
    defSuccess,
    defError);
  };
  const deleteFile = function(file){
    Ajax.call({ action: 'delete_file', id: file.id }, url, defSuccess, defError);
  }

  $scope.loadDetails = function(file){
    Ajax.call({ action: 'details', file_id: file.file_id}, url,
    function(response){
      $scope.details.file = file;
      $scope.details.data = response.data;
      $scope.details.open();
      console.log(response.data);
    }, defError);
  }

  loadSelected();
  // search - not implemented
  // not implemented ->
  //const filter = function(fn){ console.log('find'); $scope.files = $scope.files.filter(fn); console.log($scope.files);}



});
