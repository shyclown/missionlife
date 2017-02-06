app.factory('uploadURIToGarant', ['dataURItoBlob','customAjax', function(dataURItoBlob, customAjax){
  return function(fileURL, progressFn, completeFn, garant_id)
  {
    const targetUrl = '/missionlife/system/ng/files.php';
    const oData = {
      action: 'upload',
      file_name: one_file.name,
      files: dataURItoBlob(fileURL),
      garant_id: garant_id };
    customAjax(targetUrl, oData, progressFn, completeFn);
  }
}]);
