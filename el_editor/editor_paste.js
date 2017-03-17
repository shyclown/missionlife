var Editor = Editor || {};
Editor.pasteEvent = function (oSelection, oRoot, event)
{
  const replaceInserted = function(items, callback){
    console.log(items);
    for (var i = 0; i < items.length; i++) {
      item = items[i];
      let newP = document.createElement('p');
      let nodes = getAllTextNodes(item);
      let str = '';
      nodes.forEach(function(node){
        if(node.textContent!='' || node.textContent!='&nbsp;'){
          str += node.textContent;
        }
      });
      if(str != '' && str != '&nbsp;'){
        if(str != false){
          newP.innerHTML = str;
          newP.innerHTML = newP.innerHTML.replace(/&nbsp;/g,' ');
          insertAfter(newP,item);
        }
      }
      removeElement(item);
    }
  }
  setTimeout(function(){
    let fromWordStyle = oRoot.querySelectorAll('[style*=mso]');
    replaceInserted(fromWordStyle);
    let fromWordClass = oRoot.querySelectorAll('[class*=Mso]');
    replaceInserted(fromWordClass);
  },200);

};
