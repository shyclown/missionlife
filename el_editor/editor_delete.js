var Editor = Editor || {};

Editor.deleteEvent = function(oSelection, oRoot)
{
  if(!oSelection.isCollapsed)
  {
    event.preventDefault();
    Editor.deleteRange(oRoot);
  }
  // cursor at end of text element
  else if( oSelection.focusOffset == oSelection.focusNode.length )
  {
    event.preventDefault();
    var oNode = oSelection.focusNode;

    if(oNode == oRoot){
      console.log('error: selected node is root node');
      return false;
    }
    let firstNotCustomChild = function(){
      let oElement = oRoot.firstChild;
      while(Editor.isCustom(oElement)){
        oElement = oElement.nextSibling;
      }
      return oElement;
    }
    let lastNotCustomChild = function(){
      let oElement = oRoot.lastChild;
      while(Editor.isCustom(oElement)){
        oElement = oElement.previousSibling;
      }
      return oElement
    }
    var emptyNode = !hasTextInside(oNode);
    var lastNodeInEditor = oNode == firstNotCustomChild() && oNode == lastNotCustomChild();
    var firstTextNode = oNode == getFirstTextNode(oRoot) || oNode == oRoot.firstChild;

    if(lastNodeInEditor && emptyNode){
      console.log('cant delete last tag');
      return false;
    }
    // grab next node text content and move to same line
    if(oNode.nextSibling != null && isOfTag(oNode.nextSibling, 'br'))
    {
      removeElement(oNode.nextSibling);
      mergeTextnodes();
    }

    else
    {
      var nextTextNode = getNextTextSibling( oNode, oRoot);
      if( nextTextNode )
      {
        mergeTextnodes();
      }
    }

    function mergeTextnodes()
    {
      var oPosition = oNode.length;
      var nextTextNode = getNextTextSibling( oNode, oRoot);
      oNode.textContent += nextTextNode.textContent;
      nextTextNode.textContent = '';
      newCaretPosition(oSelection , oNode , oPosition);
      removeElement(getTopEmpty(nextTextNode,oRoot));
    }
  }

}




/* Editor.deleteRange
- deltes content of selection excluding custom elements
- does not care about position of custom elements
- @requires Editor.splitSelection(root);
*/
Editor.deleteRange = function(oRoot)
{
  const xSelection = Editor.splitSelection(oRoot);
  const changeStartNode = xSelection.changeStartNode;
  const changeEndNode = xSelection.changeEndNode;
  const startElement = getParentInRoot(changeStartNode, oRoot);
  const endElement = getParentInRoot(changeEndNode, oRoot);

  const sameRootParent = startElement == endElement;

  let deleteElement = true;
  let removeNode = false;
  let currentElement = startElement;

  const clearNode = function(oNode, oRoot){
    oNode.textContent = '';
    let node = getTopEmpty(oNode,oRoot);
    if(node){ removeElement(node) }
  }

  while(deleteElement)
  {
    let nextElement = currentElement.nextSibling;

    if(currentElement == startElement || currentElement == endElement)
    {
      let nodes = getAllTextNodes(currentElement);
      for (let i = 0; i < nodes.length; i++) {
        if(nodes[i] == changeStartNode){
          removeNode = true;
          clearNode(nodes[i], oRoot);
          if(nodes[i] == changeEndNode){
            removeNode = false;
            deleteElement = false;
          }
        }
        else if(nodes[i] == changeEndNode){
          clearNode(nodes[i], oRoot);
          removeNode = false;
          deleteElement = false;
        }
        else if(removeNode){
          clearNode(nodes[i], oRoot);
        }
      }
      if(!hasTextInside(currentElement) && Editor.isDescendant(currentElement, oRoot)){
        removeElement(currentElement); }
    }
    else {
      if(!Editor.isCustom(currentElement) && Editor.isDescendant(currentElement, oRoot)){
      removeElement(currentElement);
      }
    }
    currentElement = nextElement;
  }
  if(sameRootParent && changeStartNode != changeEndNode){
    const xEndNode = xSelection.endNode;
    xSelection.startNode.textContent += xEndNode.textContent;
    clearNode(xEndNode,oRoot);
  }
  // join nodes if same type
  if(!sameRootParent && startElement.tagName == endElement.tagName){
    xSelection.startNode.textContent += xSelection.endNode.textContent;
    clearNode(xSelection.endNode, oRoot);
    Editor.newCaretPosition(xSelection);
  }
}

Editor.newCaretPosition = function(xSelection){
  range = document.createRange();
  selection = window.getSelection();
  range.setStart(xSelection.startNode, xSelection.startOffset);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
}

Editor.isDescendant = function(oElement, oRoot){
  let node = oElement.parentNode;
  while(node != null){
    if(node == oRoot){ return true; }
    node = node.parentNode;
  }
  return false;
}
