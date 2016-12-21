var Editor = Editor || { };

Editor.css = {
  parts:{
      editor_main: 'editor_wrap',
      buttons: {
        wrap: 'ctrl_btns',
        icon_wrap: 'intLink'
      },
      content: {
        wrap: 'content_wrap'
      },
      html_switch:{
        wrap: 'switch_wrap',
        el: 'switch_el',
        label: 'switch_label'
      }
  },
  imagefigure:{
    figure: 'figure',
    moveBtn: 'icon_btn moveBtn',
    moveIcon:'icon fa fa-arrows',
    deleteBtn:'icon_btn deleteBtn',
    deleteIcon:'icon fa fa-times',
    image: 'image',
    figure_text: 'figure_text'
  }
}
Editor.texts = {
  htmlSwitch_label: 'Show HTML',
  figure_defText: 'figure description',
  placeholder: 'placeholder',
}
Editor.disalovedTags = ['IMG','FIGURE'];
