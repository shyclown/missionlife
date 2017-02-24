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
    // custom node
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
        let oPrevText = getPreviousTextSibling(oNode, oRoot);
        let targetRoot = getParentInRoot(oPrevText, oRoot);
        let sourceRoot = getParentInRoot(oNode, oRoot);
        let oPosition = oPrevText.length;

        if(Editor.isCustom(targetRoot)){ return false; }

        if(isOfTag(oPrevText,'br')){
          removeElement(oPrevText, oRoot);
          oPosition = 0;
          oText = oNode;
        } else { oText = oPrevText; }

        let i = 0;
        while(oNode){
          let nextNode = oNode.nextSibling;
          if(isOfTag(oNode.parentNode, 'a')){ oNode = oNode.parentNode; }
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
