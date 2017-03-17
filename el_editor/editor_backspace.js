var Editor = Editor || {};
Editor.backspaceEvent = function (oSelection, oRoot)
{

  var oNode = oSelection.focusNode;
  var rootNode = getParentInRoot(oNode,oRoot);
  if(oNode == oRoot){
    event.preventDefault();
    console.log('error: selected node is root node'); return false;
  }
  //-----------------------------------------------------
  // Selection NOT Colapsed
  //-----------------------------------------------------
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
  //-----------------------------------------------------
  // Selection Colapsed
  //-----------------------------------------------------
  else if( oSelection.isCollapsed && oSelection.focusOffset == 0 )
  {
    console.log('backspace - selection is Colapsed');
    event.preventDefault();
    let oPrevText = getPreviousTextSibling(oNode, oRoot);
    let targetRoot = getParentInRoot(oPrevText, oRoot); console.log('targetRoot', targetRoot);
    let sourceRoot = getParentInRoot(oNode, oRoot);
    let sameRoot = targetRoot == sourceRoot;
    let oPosition = oPrevText.length;
    var emptyNode = !hasTextInside(oNode); //
    var lastNodeInTree = oNode == oRoot.firstChild && oNode == oRoot.lastChild;
    var firstTextNode = oNode == getFirstTextNode(oRoot) || oNode == oRoot.firstChild;

    if( isOfTag(rootNode,'code')
    || isOfTag(rootNode,'figure')
    || isOfTag(rootNode, 'ul')
    || isOfTag(rootNode, 'ol'))
    {
      console.log('inside - Custom Root Node');
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
    //-----------------------------------------------------
    // Default Function when not Custom Elements - Not First or Last Node
    //-----------------------------------------------------
    else{
      if(!hasTextInside(sourceRoot)){
        console.log('Source is Empty');
        removeElement(sourceRoot);
        newCaretPosition(oSelection, oPrevText, oPrevText.length);
        return false;
      }
      if(!hasTextInside(targetRoot)){
        console.log('is Empty');
        removeElement(targetRoot);
        return false;
      }

      console.log('inside - Normal Root Node');
      if(!firstTextNode)
      {
        /* Do not move to custom elements */
        if(Editor.isCustom(targetRoot)){ return false; }

        /* Remove previous BR */
        oPrevious = oNode.previousSibling;
        console.log('previousSibling', oPrevious);
        if(oPrevious && isOfTag(oPrevious,'br')){ removeElement(oPrevious, oRoot); oPosition = oPrevText.textContent.length; }

        /* Move A TAG as a Element not just text */
        if(isOfTag(oNode.parentNode, 'a')){ oNode = oNode.parentNode; }

        //-----------------------------------------------------
        // Same Root Element
        //-----------------------------------------------------
        if(sameRoot){
          console.log('In Same Root');
          if(isTextNode(oPrevText) && isTextNode(oNode)){
            oPrevText.textContent += oNode.textContent;
            removeElement( oNode );
          }
        }
        //-----------------------------------------------------
        // Different root Element
        //-----------------------------------------------------
        else{
          console.log('Different Roots');
          if(oNode == sourceRoot){ oNode = sourceRoot.firstChild; }
          let prevNode = oPrevText;
          while(oNode){
            let nextNode = oNode.nextSibling;
            if(isTextNode(oNode) && isTextNode(prevNode)){ prevNode.textContent += oNode.textContent; removeElement( oNode ); }
            else if(!isTextNode(oNode) || !isTextNode(prevNode)){ targetRoot.appendChild(oNode); prevNode = oNode; }
            oNode = nextNode;
          }
          removeElement(getTopEmpty(sourceRoot, oRoot));
        }
        newCaretPosition(oSelection, oPrevText, oPosition);
      }
      //-----------------------------------------------------
      // First Text Node in Root
      //-----------------------------------------------------
      else if(firstTextNode){
        // if its last node altogether
        if(lastNodeInTree || !emptyNode){ return false; }
        // if its not the last we remove it if empty and move to next
        else if(!lastNodeInTree && emptyNode)
        {
          newCaretPosition(oSelection, getNextTextSibling(oNode, oRoot), 0);
          removeElement( getTopEmpty(oNode, oRoot) );
        }
      }
    } /* end of - Default */
  } /* end of - Selection Collapsed */
};
