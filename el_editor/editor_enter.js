var Editor = Editor || {};

Editor.enterEvent = function(oSelection, oRoot, oEvent)
{
  const replaceDivIfCreated = function(){
    sel = document.getSelection();
    node = sel.focusNode;
    console.log(node);
    rootnode = getParentInRoot(node, oRoot);
    if(isOfTag(rootnode,'div')){
      let p = document.createElement('p');
      insertBefore(p, rootnode);
      p.innerHTML = rootnode.innerHTML;
      removeElement(rootnode);
      newCaretPosition(sel, p, 0);
    }
  }


  var oNode = oSelection.focusNode;
  var oRootNode = getParentInRoot(oNode, oRoot);
  let lastInRootNode = oNode == oRootNode.lastChild;

  console.log(oNode);
  console.log(oRootNode);
  console.log(oSelection.focusOffset);
  console.log(oNode.length);

  if(isOfTag(oRootNode, 'h2')
  || isOfTag(oRootNode, 'ol')
  || isOfTag(oRootNode, 'ul')
  ){
    if(!oNode.length || oSelection.focusOffset == oNode.length){
      setTimeout(function(){ replaceDivIfCreated(); },0);
    }
  }


}
