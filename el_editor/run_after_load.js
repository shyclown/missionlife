window.addEventListener('load',function load(){
  window.removeEventListener("load", load, false); //remove listener, no longer needed
  runAfterLoad.run();
},false);
var runAfterLoad = {
  list : [],
  add : function(oFunction, oArgumentsInArray){
    let toList = {
      fn: oFunction,
      arg: oArgumentsInArray
    };
    runAfterLoad.list.push(toList);
  },
  run : function(){
    var i = 0;
    var len = runAfterLoad.list.length;
    while( i < len )
    {
      runAfterLoad.list[i].fn.apply(this, runAfterLoad.list[i].arg);
      console.log( 'RUN AFTER LOAD: '+ runAfterLoad.list[i].fn.name + '()');
      i++;
    }
  }
}
