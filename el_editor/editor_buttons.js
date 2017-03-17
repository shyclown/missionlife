var Editor = Editor || { };

Editor.btnEvent = function(type,value){
  document.execCommand(type,false,value);
}
// TODO
/*
redo undo,
print
*/
Editor.buttons = {
  Remove_formating: {
    nicename:'Remove_formating',
    fname:'paragraph',
    btn_event: function(){
        Editor.changeSelectionTag('p',this.root);
    }
  },
  Header_H2: {
    nicename:'Header_H2',
    fname:'header',
    btn_event: function(){Editor.changeSelectionTag('h2',this.root);}
  },
  Bold: {
    nicename:'Bold',
    fname:'bold',
    btn_event: function(){Editor.btnEvent('bold');}
  },
  Italic: {
    nicename:'Italic',
    fname:'italic',
    btn_event: function(){Editor.btnEvent('italic');}
  },
  Underline: {
    nicename:'Underline',
    fname:'underline',
    btn_event: function(){Editor.btnEvent('underline');}
  },
  Align_left: {
    nicename:'Align left',
    fname:'align-left',
    btn_event: function(){Editor.btnEvent('justifyleft');}
  },
  Align_center: {
    nicename:'Align center',
    fname:'align-center',
    btn_event: function(){Editor.btnEvent('justifycenter');}
  },
  Align_right: {
    nicename:'Align right',
    fname:'align-right',
    btn_event:function(){Editor.btnEvent('justifyright');}
  },
  Align_full: {
    nicename:'Align full',
    fname:'align-justify',
    btn_event: function(){Editor.btnEvent('justifyFull');}
  },
  Numbered_list: {
    nicename:'Numbered list',
    fname:'list-ol',
    btn_event: function(){Editor.changeSelectionTag('ol',this.root)}
  },
  Dotted_list: {
    nicename:'Dotted list',
    fname:'list-ul',
    btn_event: function(){Editor.changeSelectionTag('ul',this.root)}
  },
  Quote:{
    nicename:'Quote',
    fname:'quote-right',
    btn_event: function(){Editor.btnEvent('formatblock','BLOCKQUOTE')}
  },
  Hyperlink:{
    nicename:'Hyperlink',
    fname:'link',
    btn_event:function(){
        let sLnk=prompt('Write the URL here','http:\/\/');if(sLnk&&sLnk!=''&&sLnk!='http://'){
        Editor.btnEvent('createlink',sLnk);
      }
    }
  },
  Code: {
    nicename:'Code',
    fname:'code',
    btn_event: function(){ Editor.changeSelectionTag('code', this.root); }
  }
}
