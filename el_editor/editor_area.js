var Editor = Editor || { };
// functions
/**
 * @constructor
 */
Editor.area = function( data )
{
  // be able to attach callback events
  this.drop_file_callback = data.drop_file_callback || false;
  this.image_url = data.image_url || '';
  this.upload_file = 'system/php/upload_image.php';
  // Editor.area
  this.input_id = data.input_id,
  this.form_id = data.form_id
  this.input_el = document.getElementById(this.input_id);
  this.form_el = document.getElementById(this.form_id);

  this.part = this.createParts();
  this.root = this.part.content_wrap;
  this.buttons = this.createAllButtons();
  this.event = this.createEvents();
  this.attachEvents();

  this.placehoderAbove = true;
  this.movingImage = false;
  this.input_el.type = 'hidden';
  this.root.normalize();
  Editor.attachImageControls.bind(this)();
}

Editor.area.prototype.attachEvents = function()
{
  this.root.addEventListener('keydown',this.event.keydown,false);
  this.root.addEventListener('copy',this.event.copy,false);
  this.root.addEventListener('paste',this.event.paste,false);
  this.root.addEventListener('cut',this.event.cut,false);
  // Change Mode
  this.part.htmlSwitch.addEventListener('change',this.event.changeMode,false);
  // Mouse Events
  this.root.addEventListener('contextmenu', function(){},false);
  this.root.addEventListener('dragenter', this.event.dragenter, false);
  this.root.addEventListener('dragleave', Editor.fn.removeDefault, false);// def
  this.root.addEventListener('dragstart', Editor.fn.removeDefault, false);// def
  this.root.addEventListener('dragend', Editor.fn.removeDefault, false);// def
  this.root.addEventListener('dragover', Editor.fn.removeDefault, false);// def
  this.root.addEventListener('drag', Editor.fn.removeDefault, false);// def
  this.root.addEventListener('drop', this.event.drop, false);
  // Submit
  this.form_el.addEventListener('submit',this.oSubmit.bind(this),false);
}

Editor.area.prototype.createEvents = function()
{
  var area = this;
  var oSelection = window.getSelection();
  var oRoot = this.root;

  return {
    keydown: function(event){
      if(event.keyCode == 46){ Editor.deleteEvent(oSelection, oRoot);} // delete
      if(event.keyCode == 8){ Editor.backspaceEvent(oSelection, oRoot);} // backspace
      if(event.keyCode == 13){ Editor.enterEvent(oSelection, oRoot, event);} // enter
    },
    copy: function(event){
      console.log('copy',event);
    },
    paste: function(event){
      Editor.pasteEvent(oSelection, oRoot, event);
    },
    cut: function(event){
      console.log('cut',event);
    },
    changeMode: function(event){
      const oContentWrap = area.part.content_wrap;
      let htmlContent = '';
      if (event.target.checked){
        htmlContent = document.createTextNode(oContentWrap.innerHTML);
        oContentWrap.innerHTML = "";
        oContentWrap.contentEditable = false;
        const oPre = document.createElement("pre");
        oPre.id = "sourceText";
        oPre.contentEditable = true;
        oPre.appendChild(htmlContent);
        oContentWrap.appendChild(oPre);
      } else {
        if (document.all) {
          oContentWrap.innerHTML = oContentWrap.innerText;
        } else {
          htmlContent = document.createRange();
          htmlContent.selectNodeContents(oContentWrap.firstChild);
          oContentWrap.innerHTML = htmlContent.toString();
        }
        oContentWrap.contentEditable = true;
      }
    },
    dragenter: function(event){
      if(!area.placeholder){
        area.placeholder = area.imagePlaceholder(area.part.content_wrap);
        console.log(area.placeholder);
        area.placeholder.follow();
      }
    },
    drop: function(event){
      Editor.fn.removeDefault(event);
      // if provided upload function
      if(area.drop_file_callback){
        area.drop_file_callback();
      }
      else{
        // default upload function if enabled
        const data = event.dataTransfer.files;
        const reader = new FileReader();
        reader.onload = function(readerEvent){
          const dataUrl = Editor.resizeDropped(readerEvent, callback); // TODO
          function callback(resultUrl){
            const oData = { action : 'upload', image : resultUrl };
            const uploadProgress = function(percent){ console.log(percent*100); };
            const callbackAjax = function(response){ area.afterImageUpload(response, true); };
            new Editor.ajax(area.upload_file, oData, uploadProgress, callbackAjax);
          }
        }
        reader.onprogress = function(ev){ console.log(ev.loaded / (ev.total / 100));}
        reader.readAsDataURL(data[0]);
      }
    }
  }
}
// factory
Editor.area.prototype.imagePlaceholder = function(root){
  return Editor.imagePlaceholder(root);
}

Editor.area.prototype.insertAfterSelection = function(oElement){
  // inser after base node
  const oRoot = this.root;
  const oSelection = document.getSelection();
  const oRange = oSelection.getRangeAt(0);
  if(Editor.isDescendant(oRange.endContainer, oRoot)){
    // if carret is in a node
    console.dir(oRange);
    if(oRange.endContainer.parentNode.tagName == 'A'){
      insertAfter(oElement, oRange.endContainer.parentNode);
    }
    else if(oRange.endContainer.parentNode.tagName == 'P'){
      oRange.deleteContents();
      oRange.insertNode(oElement);
    }
    else{
      const oTarget = getParentInRoot(oRange.endContainer, oRoot);
      let p = document.createElement('p');
      insertAfter(p, oTarget);
      p.appendChild(oElement);
      oElement.addEventListener('click',function(){console.log('click');}, false);
    }
  }
  else { console.log('nothing selected'); }
}
Editor.fn.removeDefault = function(event){
  event.preventDefault();
  event.stopPropagation();
}

Editor.area.prototype.afterImageUpload = function (response) {
  /* Edited resposne : it is like default angular : respose.data and already parsed JSON */
  response = response.data;
  let figure = new Editor.imageFigure( this.image_url+response.file_src, 'new item', this.root );
  this.root.insertBefore( figure.el, this.placeholder.el );
}

Editor.area.prototype.removePlaceholder = function(){
  this.placeholder.remove();
  this.placeholder = void 0;
}

Editor.area.prototype.update_content = function(newContent){
  this.root.innerHTML = newContent;
}
// TODO submit
Editor.area.prototype.oSubmit = function()
{
  if(this.inEditMode()){
    //this.area_el.value = this.root.innerHTML;
    return true;
  }
  return false;
}
/*
* If showing HTML disable BUTTONS and ALERT
*/
Editor.area.prototype.inEditMode = function( runFunction ){
    if (!this.part.htmlSwitch.checked) {
      if(runFunction){ runFunction(); }
      return true ;
    }
    alert("Uncheck \"Show HTML\".");
    this.root.focus();
    return false;
}
/*
* HTML Creation: PARTS and BUTTONS
*/
Editor.area.prototype.createParts = function()
{
  const oInput = this.input_el;
  let part = {};
  part.editor_wrap = Editor.fn.el('div', Editor.css.parts.editor_main);
  part.buttons_wrap = Editor.fn.el('div', Editor.css.parts.buttons.wrap);
  part.content_wrap = Editor.fn.el('div', Editor.css.parts.content.wrap);
  part.htmlSwitch_wrap = Editor.fn.el('div', Editor.css.parts.html_switch.wrap);
  part.htmlSwitch = Editor.fn.el('input', Editor.css.parts.html_switch.el);
  part.htmlSwitch_label = Editor.fn.el('label', Editor.css.parts.html_switch.label);

  part.content_wrap.contentEditable = true;
  part.htmlSwitch.type = 'checkbox';
  part.htmlSwitch.name = 'switchMode';
  part.htmlSwitch_label.setAttribute('for','switchMode');
  part.htmlSwitch_label.textContent = Editor.texts.htmlSwitch_label;

  part.editor_wrap.appendChild(part.buttons_wrap);
  part.editor_wrap.appendChild(part.content_wrap);
  part.editor_wrap.appendChild(part.htmlSwitch_wrap);
  part.htmlSwitch_wrap.appendChild(part.htmlSwitch);
  part.htmlSwitch_wrap.appendChild(part.htmlSwitch_label);
  // insert
  part.content_wrap.innerHTML = oInput.value;
  oInput.parentNode.insertBefore( part.editor_wrap, oInput );
  return part;
}
Editor.area.prototype.createAllButtons = function()
{
  let buttons = {};
  for (var item in Editor.buttons){
    const oButton = Editor.buttons[item];
    const el = Editor.fn.el('button', Editor.css.parts.buttons.icon_wrap);
    const iconCss = 'fa fa-'+oButton.fname+' fa-fw';
    const icon = Editor.fn.el('i', iconCss);

    el.type = 'button';
    el.title = oButton.nicename;
    const fn = function(){
      this.inEditMode(oButton.btn_event.bind(this));
    }
    el.addEventListener('click',fn.bind(this),false);
    el.appendChild(icon);
    this.part.buttons_wrap.appendChild(el);
    buttons[item] = el;
  }
  return buttons;
}
