app.directive('popFolderExplorer',['$http','Form','Shared', 'Folder', 'Article', 'Garant','FileService','uploadDropped',
function($http, Form, Shared, Folder, Article, Garant, FileService, uploadDropped) {
  return {
    restrict: 'E',
    scope:{ },
    templateUrl: '/_backend/app/template/explorer/pop_explorer.html',
    link: function (scope, element, attrs)
    {
      let Explorer = Shared.explorer;
      // reset it
      Shared.explorer.current_folder = 0;
      scope.currentFolder = 0;
      scope.folders = [];
      scope.articles = [];
      scope.files = [];
      scope.currentParents = [];
      scope.openFoldersInTree = [];

      // Article and File can be changed updated in outside directive

      scope.$watch(
        function(){ return Folder.allFolders; },
        function(){ scope.folders = Folder.allFolders; },
      true);
      // Load Folders
      let updateScope = function(){ scope.$apply(); }
      Folder.select_all(updateScope);

      const explorer = Shared.explorer;
      scope.$watch( function(){ return explorer.articles; }, function(){ scope.articles = explorer.articles; }, true );
      scope.$watch( function(){ return explorer.garants; }, function(){ scope.garants = explorer.garants; }, true );
      scope.$watch( function(){ return explorer.files; }, function(){ scope.files = explorer.files; }, true );
      scope.$watch( function(){ return explorer.forms; }, function(){ scope.forms = explorer.forms; }, true );

      scope.new_folder = {};
      scope.saveNewFolder = function(){
        let data = scope.new_folder;
        data.parent = scope.currentFolder;
        Folder.insert( data, function(response){ scope.new_folder.name = ""; });
      }
/*
      let fil = {
      $$hashKey: "object:69",
      date_created: "2017-12-08 11:46:24",
      date_edited: "2017-12-08 11:46:24",
      file_name: "SLOVENIA-88.jpg",
      file_size: 1504470,
      file_src:"5a2a6d8059c07.png",
      file_type:"png",
      folder_id: 1,
      id: 86,
      item_id: 67,
      type: 4
    };
    new Shared.directiveElement('edit-file-window', fil, function(){
      //callback
    }, scope);
*/
/* Test */
new Shared.directiveElement('edit-article-window', {
action:"load_files",
content:'<p>V ten deň mi pomaľovali tvár v jaslách. Nepamätám si či som to neznášal. Ani si nepamätám ako mi to robili, iba sa pamätam ako tam sedím s tym pocitom na tvári. Sedel som v zadnej miestnosti kde boli hračky a skladal som si najúžasnejsiu helikoptéru môjho života. Nikdy som ju však nedokončil lebo po mňa prišli rodičia. Väčšina vecí čo si pamätám z toho obdobia sú tie momenty keď som odchádzal a ešte sa mi nechcelo. Nechutné kakao a potom nás nahnali na záchod. Vždy som si natrhal do zásoby kúsky wc-papiera a prepašoval si ich do postele. Málokedy sa mi chcelo spať. Papier som tajne zožmolil do tvarov postavičiek s ktorými som sa potom hral najrôznejžie príbehy. Niekedy vtedy som aj spoznal chuť recyklovaného papiera. Pomerne často som ale nebol jediný komu sa nechcelo spať. A kedže po chvíli zvykli učitelky odísť, hlavy detí sa začínali zdvýhať. Všetci boli pripravení na expedíciu po škôlke. Dostať sa z triedy bolo pomerne jednoduché no na chodbe pod kobercom sa nachádzal kanalizačny poklop ktorý vždy hlasno zaklepal ked na neho niekto šlapol. No a aj ked sme na tejto missii neboli prvý krát tak  sa vzdy našiel v mase nás hlupych detí niekto kto na tom kanáli skončil a spôsobil, že všetci vystrašení utekajú hlučne naspäť do postelí. Potom som stal v rohu. Neviem či táto metóda trestu funguje, lebo celkom určite som nerozmýšlal nad tým čo som urobil a ani ma nenapadlo, že by som mal dačo urobiť čo by mi skrátilo tento trest. Myslím že také male deti ako som ja si aj v takejto nudnej cinnosti dokazu najst nieco s cim sa da hrať. Niekedy je to nejaka špinka z vačku, inokedy si vystačíme s holímy rukami. Trest sa skončil bez poučenia tým, že nás vyhnali na dvor.  Na dvore bola celkom zabava. Sme sa schovavali za kríky mysliac si že tam nás nevidno. No myslím väčšinou sme ani nerozmýšlali nad tým či sa niekto pozerá. Niektorí odvaznejsí jedli trávu iní zas bobule z kríku. Ja s kamarátom sme občas postávali pri plote, kde okolo náz chodili a robili si z nás srandu troska väčšie deti čo idúce o tom čase zo školy domov. Často sme im podávali veci ktoré nechceli. Ako deti sme si ani neuvedomovali že existuje nejaky svet mimo toho konkrétneho momentu ktorý práve preživame do okruhu pár metrov a v časovom horizonte jedného dňa. Aj preto nás neurážalo ked si z nás niekto robil srandu. Ako deti sme to ignorovali. Vtedy vždy bolo dôležite iba to čo si ja myslím.</p>'
,
date_created:"2017-12-09 13:40:10",
date_edited:"2017-12-09 13:40:10",
header:"New Article",
id:21,
state:0
}, function(){
  //callback
  Article.updateExplorer();
}, scope);

      // Create Windows
      scope.openFileWindow = function(file){
        new Shared.directiveElement('edit-file-window', file, function(){
          //callback
        }, scope);
      }
      scope.openFormWindow = function(form){
        new Shared.directiveElement('edit-form-window', form, function(){
          //callback
          Form.updateExplorer();
        }, scope);
      }
      scope.openFolderWindow = function(folder){
        new Shared.directiveElement('edit-folder-window', folder, function(){
          //callback
        }, scope);
      }
      scope.openGarantWindow = function(garant){
        new Shared.directiveElement('edit-garant-window', garant, function(image){
          //callback
          if(image){ FileService.updateExplorer(); };
          Garant.updateExplorer();
        }, scope);
      }
      scope.openArticleWindow = function(article){
        new Shared.directiveElement('edit-article-window', article, function(){
          //callback
          Article.updateExplorer();
        }, scope);
      }


      scope.prompted = function(message, description, cancelBtn, acceptBtn, callback){
        const promptObj = new Shared.prompt({
          message: message,
          description: description,
          cancelBtn: cancelBtn,
          acceptBtn: acceptBtn
        }, callback, scope);
      }

      /* File Upload On Drop */
      scope.uploadFile = function(){ FileService.uploadFile(scope.currentFolder); }

      scope.isOpenFolder = function(){ return scope.currentFolder != 0; }

      scope.openFolder = function(folder){
        // prompted action
        const inFolderArray = function(id){
          let pos = scope.openFoldersInTree.indexOf(id);
          return {
            open: pos >= 0, position: pos
          };
        }

        if(folder == 0){
          scope.currentFolder = folder;
          Shared.explorer.current_folder = folder;
        }
        else{
          const folderInArray = inFolderArray(folder.id);
          const folderIsCurrent = folder == scope.currentFolder;

          if(!folderIsCurrent){
            Shared.explorer.current_folder = folder;
            scope.currentFolder = folder;
            scope.currentParents = Folder.listParents(folder);
          }
          if(folderInArray.open && folderIsCurrent){
            scope.openFoldersInTree.splice(folderInArray.position, 1);
          }
          if(!folderInArray.open){
            scope.openFoldersInTree.push(folder.id);
          }
        }

      }
      scope.isOpen = function(folder){ return folder.id == scope.currentFolder.id; }

      // CSS Style

      scope.currentOpen = function(folder){ return (folder.id == scope.openFolder.id) ? 'currentFolder' : ''; }
      scope.fileTypeClass = function(type){
        let str = '';
        switch (type) {
          case 'pdf' :
            str = 'fa fa-file-pdf-o';
            break;
          case 'doc' :
            str = 'fa fa-file-word-o';
            break;
          case 'png' :
            str = 'fa fa-file-image-o';
            break;
          case 'txt' :
            str = 'fa fa-file-text-o';
            break;
          default:
            str = 'fa fa-file-o'
        }
        return str;
      }
    }
  };
}]);
