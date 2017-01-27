var Editor = Editor || {};
Editor.splitSelection = function(oRoot)
{
  const oSelection = document.getSelection();
  const oRange = oSelection.getRangeAt(0);
  let startOffset = oRange.startOffset;
  let endOffset = oRange.endOffset;

  let startNode = oRange.startContainer;
  let endNode = oRange.endContainer;

  let changeStartNode;
  let changeEndNode;

  if(!isTextNode(startNode)){
    if(startNode == oRoot){
        startNode = oRoot.children[startOffset - 1];
    }
    if(this.isCustom(startNode)){
      startNode = getNextTextSibling(startNode, oRoot);
      startOffset = 0;
    }
  }

  if(!isTextNode(endNode)){
    if(endNode == oRoot){
      endNode = oRoot.children[endOffset - 1];
    }
    if(this.isCustom(endNode)){
      endNode = getPreviousTextSibling(startNode, oRoot);
      endOffset = endNode.textContent.length;
    }
  }

  let sameTextNode = startNode == endNode;
  let wholeStart = startOffset == 0;
  let wholeEnd = endOffset == endNode.textContent.length;
  let wholeContent = wholeStart && wholeEnd;

  if(wholeContent)
  {
    changeStartNode = startNode;
    changeEndNode = endNode;
  }
  if(!wholeContent && sameTextNode){
      endNode = startNode.cloneNode('deep');
      insertAfter(endNode,startNode);
      changeStartNode = startNode.cloneNode('deep');
      insertAfter(changeStartNode,startNode);
      changeStartNode.textContent = changeStartNode.textContent.substr(startOffset, (endOffset - startOffset));
      changeEndNode = changeStartNode;
      startNode.textContent = startNode.textContent.substr(0,startOffset);
      endNode.textContent = endNode.textContent.substr(endOffset);
  }
  if(!wholeContent && !sameTextNode)
  {
    if(wholeStart){
      changeStartNode = startNode;
    }
    else{
      changeStartNode = startNode.cloneNode('deep');
      insertAfter(changeStartNode,startNode);
      changeStartNode.textContent = changeStartNode.textContent.substr(startOffset);
      startNode.textContent = startNode.textContent.substr(0,startOffset);
    }
    if(wholeEnd){
      changeEndNode = endNode;
    }
    else{
      changeEndNode = endNode.cloneNode('deep');
      insertBefore(changeEndNode, endNode);
      changeEndNode.textContent = changeEndNode.textContent.substr(0, endOffset);
      endNode.textContent = endNode.textContent.substr(endOffset);
    }
  }
  oRange.detach();
  return {
    'startNode': startNode,
    'endNode': endNode,
    'changeStartNode': changeStartNode,
    'changeEndNode': changeEndNode,
    'startOffset': startOffset,
    'endOffset': endOffset
  }
}

Editor.changeSelectionTag = function(oTag, oRoot)
{
    const xSelection = Editor.splitSelection(oRoot);
    let changeStartNode = xSelection.changeStartNode;
    let changeEndNode = xSelection.changeEndNode;
    console.log(oRoot);
    var rootStart = getParentInRoot(changeStartNode,oRoot);
    var rootEnd = getParentInRoot(changeEndNode,oRoot);

    var placeNodes = [];
    var placeAfter = rootStart;
    var currentNode = rootStart;
    var controlElement = true;

    while(controlElement) {
      console.log('current node',currentNode);
      nextElement = currentNode.nextSibling;
      if(!Editor.isCustom(currentNode)){
        var nodes = getAllTextNodes(currentNode);


        if(currentNode == rootStart || currentNode == rootEnd){
          for (var i = 0; i < nodes.length; i++){

              if(nodes[i] == changeStartNode){
                if(placeNodes.length > 0){
                  var oElement = this.createNewTagElement(placeNodes,rootStart.tagName,placeAfter);
                  placeAfter = oElement;
                }
                placeNodes = [];
                placeNodes.push(nodes[i]);
              }
              if(nodes[i] == changeEndNode){
                if(changeEndNode != changeStartNode){
                placeNodes.push(nodes[i]);
                }
                var oElement = this.createNewTagElement(placeNodes,oTag,placeAfter);
                placeAfter = oElement;
                placeNodes = [];
              }
              if(nodes[i] != changeStartNode && nodes[i] != changeEndNode){
                placeNodes.push(nodes[i]);
              }
          }
          if(currentNode == rootEnd){
              if(placeNodes.length > 0){
                var oElement = this.createNewTagElement(placeNodes,rootEnd.tagName,placeAfter);
                placeNodes = [];
              }
              controlElement = false;
          }
      }
      else{
        var newArray = placeNodes.concat(nodes);
        placeNodes = newArray;
          console.log('nodes', nodes);
          console.log('placeNodes', placeNodes);
      }

    }

    if(Editor.isCustom(currentNode)){
        if(placeNodes.length > 0){
        this.createNewTagElement(placeNodes,oTag,placeAfter);
        placeNodes = [];
        }
        if(currentNode == rootEnd){
          controlElement = false;
        }
        placeAfter = nextElement;
    }
    currentNode = nextElement;

}

  if( rootStart != rootEnd){
  removeElement(rootEnd);
  }
  removeElement(rootStart);
}

Editor.createNewTagElement = function(oNodes,oTag,oPlacementAfter)
{
  var oElement = document.createElement(oTag);
  insertAfter(oElement,oPlacementAfter);
  for (var i = 0; i < oNodes.length; i++) {
    this.createInnerLine(oNodes[i], oTag, oElement);
  }
  return oElement;
}

Editor.createInnerLine = function(oText,oTag, oPlacement)
{
  var oTag = oTag.toLowerCase();
  var fnInnerLine = this.innerLine[oTag];
  fnInnerLine.bind(this, oText, oPlacement)();
}
Editor.innerLine = {
  p: function(oText, oPlacement){ ;oPlacement.appendChild(oText); var br = document.createElement('br'); oPlacement.appendChild(br);},
  h2:function(oText, oPlacement){ oPlacement.appendChild(oText); var br = document.createElement('br'); oPlacement.appendChild(br);},
  ul:function(oText, oPlacement){  var li = document.createElement('li'); li.appendChild(oText); oPlacement.appendChild(li);  },
  ol:function(oText, oPlacement){  var li = document.createElement('li'); li.appendChild(oText); oPlacement.appendChild(li);  },
  code:function(oText, oPlacement){ var line = this.createCodeline(oText); oPlacement.appendChild(line);}
}

Editor.notCustom = function(oNode){
  return Editor.disalovedTags.indexOf(oNode.tagName.toUpperCase()) == -1;
}
Editor.isCustom = function(oNode){
  console.log('check if custom element', oNode);
  var result = Editor.disalovedTags.indexOf(oNode.tagName.toUpperCase()) == -1;
  return !result;
}

Editor.createCodeline = function(oText)
{
  var el =  document.createElement('div');
  el.appendChild(oText);
  el.className = 'code_line';
  return el;
}
