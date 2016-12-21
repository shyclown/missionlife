var Editor = Editor || {};
Editor.backspaceEvent = function (oSelection, oRoot)
{
  if(!oSelection.isCollapsed){
    event.preventDefault();
    Editor.deleteRange(oRoot);
  }
  else if( oSelection.isCollapsed && oSelection.focusOffset == 0 )
  {
    event.preventDefault();


    var oNode = oSelection.focusNode;
    var rootNode = getParentInRoot(oNode,oRoot);
    if(oNode == oRoot){  console.log('error: selected node is root node'); return false; }

    // if operating in code
    if(isOfTag(rootNode,'code'))
    {
      if(getFirstTextNode(rootNode) == oNode){
        return false;
      }
      else{
        var oPrevText = getPreviousTextSibling(oNode,oRoot);
        var oPosition = oPrevText.length;
        oPrevText.textContent += oNode.textContent;
        oNode.textContent = '';
        removeElement(getTopEmpty(oNode, oRoot));
        newCaretPosition(oSelection, oPrevText, oPosition);
      }
    }
    else{
      var emptyNode = !hasTextInside(oNode);
      var lastNodeInTree = oNode == oRoot.firstChild && oNode == oRoot.lastChild;
      var firstTextNode = oNode == getFirstTextNode(oRoot) || oNode == oRoot.firstChild;

      if(!firstTextNode && !lastNodeInTree)
      {
        var oPrevText = getPreviousTextSibling(oNode,oRoot);
        var oPosition = oPrevText.length;
        console.log(oNode.textContent);
        oPrevText.textContent += oNode.textContent;
        oNode.textContent = '';
        newCaretPosition(oSelection, oPrevText, oPosition);
        // if node has previousSibling
        while(oNode.previousSibling && isOfTag(oNode.previousSibling, 'br') ){
        removeElement(oNode.previousSibling);
        }
        removeElement(  getTopEmpty(oNode, oRoot)  );
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
