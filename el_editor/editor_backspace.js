var Editor = Editor || {};
Editor.backspaceEvent = function (oSelection, oRoot)
{
  if(!oSelection.isCollapsed){
    event.preventDefault();
    var oNode = oSelection.focusNode;
    var rootNode = getParentInRoot(oNode,oRoot);
    console.log(Editor.isCustom(rootNode));
    /*
    If selection is not colapsed we use custom function which handles
    custom tags as expected.
    */
    Editor.deleteRange(oRoot);
  }
  else if( oSelection.isCollapsed && oSelection.focusOffset == 0 )
  {
    event.preventDefault();
    /*
    If selection is collapsed we check if cusor is next to tags
    and we use custom actions
    */

    // focus node is node in which is carret of selection, since its collapsed
    // focus and anchor node should be the same
    var oNode = oSelection.focusNode;

    var rootNode = getParentInRoot(oNode,oRoot);
    // sometimes happens that selection node is root node,
    // this happens when tag around is missing for some reason
    if(oNode == oRoot){
      console.log('error: selected node is root node'); return false;
    }

    // if we are inside CODE node

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
    if(Editor.isCustom(rootNode)){
      console.log('custom node', rootNode.tagName);
      return false;
    }
    // in other types of nodes
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
