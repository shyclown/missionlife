var Editor = Editor || {};
/*
Functions needed for manipulating Images
*/
Editor.imageFigure = function(source, caption, root)
{
  let css = Editor.css.imagefigure;
  let figure = Editor.fn.el('figure',css.figure);
  figure.setAttribute('contenteditable', false);

  let figureImage = new Image();
  let figureCaption = Editor.fn.el('figcaption',css.figure_text);
  figureCaption.innerHTML = caption;
  figureImage.src = source;
  figure.className = css.image;
  figure.appendChild(figureImage);
  figure.appendChild(figureCaption);
//  root.appendChild(figure);

  const createButton = function(oClassBtn, oClassIcon)
  {
    let btn = Editor.fn.el('div',oClassBtn);
    let icon = Editor.fn.el('i',oClassIcon);
    btn.appendChild(icon);
    figure.appendChild(btn);
    return btn;
  }

  const moveBtn = createButton(css.moveBtn,css.moveIcon);
  const deleteBtn = createButton(css.deleteBtn,css.deleteIcon);

  let placeholder;

  const moveImg = function()
  {
    console.log('move');
    placeholder = Editor.imagePlaceholder(root);
    placeholder.follow();
    placeholder.el.appendChild(figure);
    moveBtn.removeEventListener('click',moveImg,false);
    placeholder.el.addEventListener('click',placeImg,false);
  }
  const placeImg = function()
  {
    placeholder.el.removeEventListener('click',placeImg,false);
    moveBtn.addEventListener('click',moveImg,false);
    root.insertBefore(figure, placeholder.el);
    placeholder.remove();
  }

  moveBtn.addEventListener('click',moveImg,false);
  deleteBtn.addEventListener('click',function(){
    removeElement(figure);
  },false);

  return {
    el: figure,
  }
}

Editor.imagePlaceholder = function(root)
{
  let placeholder = Editor.fn.el('div','placeholder');
  placeholder.innerHTML = Editor.texts.placeholder;
  let oldPosition = true;

  const followMouse = function(event)
  {
    if(event.target == root){ return false }
    const elementUnder = getParentInRoot(event.target,root);
    const startHeight = (elementUnder.scrollHeight)/3;
    const endHeight = (elementUnder.scrollHeight)*2/3;
    const bounds = elementUnder.getBoundingClientRect();
    const yPositionInElement = event.clientY - bounds.top;
    let newPosition = oldPosition;
    if(yPositionInElement < startHeight){ newPosition = true; }
    else if(yPositionInElement > endHeight){ newPosition = false; }
    if(newPosition != oldPosition){
      if(newPosition){ elementUnder.parentNode.insertBefore(placeholder,elementUnder); }
      if(!newPosition){ insertAfter(placeholder,elementUnder); }
      oldPosition = newPosition;
    }
    if(!placeholder.parentNode){
      elementUnder.parentNode.insertBefore(placeholder,elementUnder);
    }
  }

  return {
    el: placeholder,
    follow: function(){
      root.addEventListener('mousemove', followMouse, false);
      root.addEventListener('dragover',followMouse,false);
    },
    remove: function(){
      root.removeEventListener('mousemove', followMouse, false);
      root.removeEventListener('dragover',followMouse, false);
      removeElement(placeholder);
    }
  }
}

Editor.attachImageControls = function()
{
  const root = this.part.content_wrap;
  const images = root.getElementsByClassName('image');

  for (let i = 0, len = images.length; i < len; i++) {
    const image = images[i];
    const src = image.getElementsByTagName('img')[0].src;
    const caption = image.getElementsByTagName('figcaption')[0];
    let captionContent = '';
    if(caption){ captionContent = caption.innerHTML; }
    const newFigure = new Editor.imageFigure(src, captionContent, root);
    root.insertBefore(newFigure.el,image);
    removeElement(image);
  }
}

Editor.removeImageControls = function(){
  console.log('Remove Image Controls',this);
  var images = this.part.content_wrap.getElementsByClassName('image');
  for (var i = 0; i < images.length; i++) {
    var del = images[i].getElementsByClassName('deleteBtn')[0];
    var mov = images[i].getElementsByClassName('moveBtn')[0];
    removeElement(del);
    removeElement(mov);
  }
}
