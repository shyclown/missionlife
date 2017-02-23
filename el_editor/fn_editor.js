/*
* Text Editor
* v. 0.01
*/
var Editor = Editor || {};

Editor.node = function(node, root){

  let inEditor = false;

  while(node.parentNode != null){
    if(node == root){ inEditor = true }

  }




}

function callbackEditor(data){
  console.log(data);
}



function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
function insertBefore(newNode, referenceNode){
  referenceNode.parentNode.insertBefore(newNode, referenceNode);
}
var removeElement = function(oElement){
  oElement.parentNode.removeChild(oElement);
}

var removeNextSibling = function(oElement){
  oElement.parentNode.removeChild(oElement.nextSibling);
}

var getFirstTextNode = function(oElement){
  while(oElement.firstChild != null){  oElement = oElement.firstChild; }
  return oElement;
}

var getLastTextNode = function(oElement){
  while(oElement.lastChild != null){ oElement = oElement.lastChild; }
  return oElement;
}

var deleteAnchorRange = function(oElement, oOffset){
  deleteRange( oElement, oOffset , oElement , oElement.length );
}

var deleteFocusRange = function(oElement, oOffset){
  deleteRange( oElement, 0 , oElement , oOffset );
}

var deleteRange = function(oStart, oEnd, oStartOffset, oEndOffset){
  var range = document.createRange();
  range.setStart(oStart, oStartOffset);
  range.setEnd(oEnd, oEndOffset);
  range.deleteContents();
}

var isTextNode = function(oElement){
  return (oElement.nodeType == 3);
}

var hasTextInside = function(oElement)
{
  var oFound = false;
  if(!oElement){
    return false;
  }

  var isEmpty = function(oElement)
  {
    if(!oFound)
    {
      if( isTextNode(oElement) )
      {
        if(oElement.textContent != ''){
          oFound = true;
          return;
        }
        return;
      }
      else if(!isTextNode(oElement))
      {
        var oChildren = oElement.childNodes;
        var nrChildren = oChildren.length;
        for( let i = 0; i < nrChildren; i++)
        {
          isEmpty(oChildren[i]);
        }
      }
    }
  }
  isEmpty(oElement);
  return oFound;
}

var getPreviousTextSibling = function(oElement,oRoot)
{
  var oElement = oElement;
  // BR
  while(oElement.previousSibling != null && isOfTag(oElement.previousSibling,'br')){
    oElement = oElement.previousSibling;
  }
  // FIRST
  while(oElement.previousSibling == null && oRoot.firstChild != oElement){
    oElement = oElement.parentNode;
  }
  if(oRoot.firstChild == oElement){ return false; }
  //if( isOfTag(oElement, 'br') ){ oElement = getPreviousTextSibling(oElement,oRoot); }
  return getLastTextNode(oElement.previousSibling);
}

var getNextTextSibling = function(oElement, oRoot)
{
    var oElement = oElement;
    while(oElement.nextSibling == null && oRoot.lastChild != oElement){
      oElement = oElement.parentNode;
    }
    if(oRoot.lastChild == oElement){ return false; }
    // Avoid Custom elements!!!
    while(Editor.isCustom(getParentInRoot(oElement.nextSibling, oRoot))){ oElement = oElement.nextSibling; }

    return getFirstTextNode(oElement.nextSibling);
}

var hasDirectSiblingOfTag= function(oElement, oTagName){
  if( oElement.nextSibling != null && isOfTag( oElement.nextSibling, oTagName ))
  { return true; }
  else
  { return false; }
}
var isOfTag = function(oElement , oTagName){
  if( !isTextNode(oElement) &&
      oElement.tagName.toUpperCase() == oTagName.toUpperCase())
  { return true; }
  else
  { return false; }
}


var newCaretPosition = function(oSelection, oElement, oOffset)
{
  var range = document.createRange();
  range.setStart(oElement, oOffset);
  range.collapse(true);
  oSelection.removeAllRanges();
  oSelection.addRange(range);
}
//

var getTopEmpty = function(oElement,oRoot)
{
  if(!Editor.isDescendant(oElement, oRoot)){
    console.log('error: getTopEmpty - element is not inside root');
    return false;
  }
  else
  {
    let found = false;
    let currentNode = oElement;
    let returnNode = oElement;
    while(!found && currentNode != oRoot){
      if(hasTextInside(currentNode.parentNode)){ found = true; }
      else{ currentNode = currentNode.parentNode; }
    }

    if(found){ return currentNode; }
    else{ return false };
  }
}
const hasCustomParent = function(oElement, oRoot){
  while(oElement.parentNode != oRoot){
    if(Editor.isCustom(oElement.parentNode)){ return true; }
    if(!oElement.parentNode){ return false; } // has not parent in root
    oElement = oElement.parentNode;
  }
  return false;
}

var getParentInRoot = function(oElement,oRoot){
  while(oElement.parentNode != oRoot )
  {
    if(!oElement.parentNode){ return false; } // has not parent in root
    oElement = oElement.parentNode;
  }
  return oElement;
}

var inArrayString = function(oArray,oString)
{
  return oArray.indexOf(oString) > -1;
}

var getAllTextNodes = function(oElement)
{
  var oArray = [];

  function findText(oElement)
  {
    if(isTextNode(oElement))
    {
        oArray.push(oElement);
    }
    else if(oElement.hasChildNodes)
    {
      var oChildren = oElement.childNodes;
      var i = 0;
      for( var i = 0; i < oChildren.length; i++)
      {
        findText(oChildren[i]);
      }
    }
  }
  findText(oElement);
  return oArray;
}


var getTextNodesInSelection = function(oSelection){

  var oRange = oSelection.getRangeAt(0);
  var oCommonParent = oRange.commonAncestorContainer;

  var oNodes = getAllTextNodes(oCommonParent);
  var storeNode = false;
  var nodeArray = [];
  var i = 0;

  while(i < oNodes.length)
  {
    var oneNode = oNodes[i];
    if(oneNode == oRange.startContainer){
      storeNode = true;
      nodeArray.push(oneNode);
    }
    else if(oneNode == oRange.endContainer){
      storeNode = false;
      nodeArray.push(oneNode);
    }
    else if(storeNode){
      nodeArray.push(oneNode);
    }
    i++;
  }
  return nodeArray;
}

var getElementsInSelection = function(range, set_root){

  var root = range.commonAncestorContainer;
  if(set_root){ root = set_root; }

  var start = getParentInRoot(range.startContainer, root);
  var end = getParentInRoot(range.endContainer, root);

  var rootNodes = root.children;
  var storeNode = false;
  var nodeArray = [];

  for( var i = 0, len = rootNodes.length; i < len ; i++)
  {
    var oNode = rootNodes[i];

    if( oNode == start ){
      storeNode = true;
      nodeArray.push(oNode);
    }
    else if( oNode == end ){
      storeNode = false;
      nodeArray.push(oNode);
    }
    else if( storeNode ){
      nodeArray.push(oNode);
    }
  }
  return nodeArray;
};

var deleteRangeElements = function(oSelection,oRoot)
{
  var oRange = oSelection.getRangeAt(0);

  if(oRange.startContainer == oRange.endContainer){
    oRange.deleteContents();
  }
  else
  {
    var oElements = getElementsInSelection(oRange,oRoot);

    for( var i = 0, len = oElements.length; i < len ; i++ )
    {
      var oElement = oElements[i];
      if( oElement.className && oElement.className == 'code'){ }
      else
      {
        if( i == 0 ){
          deleteAnchorRange(oRange.startContainer, oRange.startOffset);
        }
        else if( i == oElements.length - 1 ){
          deleteFocusRange(oRange.endContainer, oRange.endOffset);
        }
        else{
          // remove whole element
          oRoot.removeChild(oElement);
        }
      }
    }
  }
}
