var Editor = Editor || {};
Editor.backspaceEvent = function (oSelection, oRoot)
{

  var oNode = oSelection.focusNode;
  var rootNode = getParentInRoot(oNode,oRoot);

  if(oNode == oRoot){
    event.preventDefault();
    console.log('error: selected node is root node'); return false;
  }

  if(!oSelection.isCollapsed){

    if(Editor.isCustom(rootNode)){
      console.log('delete range inside custom');
      // default
    }
    else{
      event.preventDefault();
      Editor.deleteRange(oRoot);
    }

  }
  else if( oSelection.isCollapsed && oSelection.focusOffset == 0 )
  {
    event.preventDefault();
    let oPrevText = getPreviousTextSibling(oNode, oRoot);
    let targetRoot = getParentInRoot(oPrevText, oRoot);
    let sourceRoot = getParentInRoot(oNode, oRoot);
    let oPosition = oPrevText.length;
    var emptyNode = !hasTextInside(oNode);
    var lastNodeInTree = oNode == oRoot.firstChild && oNode == oRoot.lastChild;
    var firstTextNode = oNode == getFirstTextNode(oRoot) || oNode == oRoot.firstChild;

    if(isOfTag(rootNode,'code') || isOfTag(rootNode,'figure'))
    {
      if(getFirstTextNode(rootNode) == oNode || isOfTag(oNode, 'figcaption')){
        return false; // nothing to delete
      }
      else{
        oPrevText.textContent += oNode.textContent;
        oNode.textContent = '';
        removeElement(getTopEmpty(oNode, oRoot));
        newCaretPosition(oSelection, oPrevText, oPosition);
      }
    }

    else if(Editor.isCustom(rootNode)){ return false; }
    else{
      if(!firstTextNode && !lastNodeInTree)
      {
        if(Editor.isCustom(targetRoot)){ return false; }

        if(isOfTag(oPrevText,'br')){
          removeElement(oPrevText, oRoot);
          oPosition = 0;
          oText = oNode;
        } else { oText = oPrevText; }

        let i = 0;
        while(oNode){
          if(isOfTag(oNode.parentNode, 'a')){ oNode = oNode.parentNode; }
          let nextNode = oNode.nextSibling;
          if(isTextNode(oPrevText) && isTextNode(oNode) && i == 0 && !isOfTag(oNode, 'a')){
            oPrevText.textContent += oNode.textContent;
          }
          else{ targetRoot.appendChild(oNode); }
          oNode = nextNode;
          i++;
        }
        newCaretPosition(oSelection, oText, oPosition);
        removeElement(  getTopEmpty(sourceRoot, oRoot)  );
      }
      else if(firstTextNode){
        if(lastNodeInTree || !emptyNode){ return false; }
        else if(!lastNodeInTree && emptyNode)
        {
          newCaretPosition(oSelection, getNextTextSibling(oNode, oRoot), 0);
          removeElement( getTopEmpty(oNode, oRoot) );
        }
      }
    }
  }
};
