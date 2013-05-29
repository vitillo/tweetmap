Framework = function(){
  function initializeWebGL(canvas) {
    var gl = null;
    canvas = typeof canvas == "string" ? document.getElementById(canvas) : canvas;
    
    try {
      gl = canvas.getContext("experimental-webgl", {antialias: true, depth: false, preserveDrawingBuffer: true});
    }
    catch(e) {
    }
    
    if (!gl) {
      alert("Unable to initialize WebGL. Your browser may not support it.");
    }

    ext = gl.getExtension("OES_vertex_array_object");
    if (!ext) {
      console.log("Vertex Array Objects not supported. You need a browser that supports this extension");
    }else{
      gl.ext = ext;
    }

    return gl;
  }

  function loadShader(gl, id){
    var shaderScript;
    var theSource;
    var currentChild;
    var shader;

    shaderScript = document.getElementById(id);

    if(!shaderScript){
      return null;
    }

    theSource = "";
    currentChild = shaderScript.firstChild;

    while(currentChild){
      if(currentChild.nodeType == currentChild.TEXT_NODE){
        theSource += currentChild.textContent;
      }

      currentChild = currentChild.nextSibling;
    }

    if(shaderScript.type == "x-shader/x-fragment"){
      shader = gl.createShader(gl.FRAGMENT_SHADER);
    }else if(shaderScript.type == "x-shader/x-vertex"){
      shader = gl.createShader(gl.VERTEX_SHADER);
    }else{
      return null;
    }

    gl.shaderSource(shader, theSource);
    gl.compileShader(shader);

    if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
      alert("Compile failure in " + id + " shader: " + gl.getShaderInfoLog(shader));
      return null;
    }

    return shader;
  }

  function createProgram(list){
    var prog = gl.createProgram();

    for(var i = 0; i < list.length; i++){
      gl.attachShader(prog, list[i]);
    }

    gl.linkProgram(prog);

    if(!gl.getProgramParameter(prog, gl.LINK_STATUS)){
      alert("Shader linker failure: " + gl.getProgramInfoLog(prog));
    }

    /* Firefox bug, see: https://bugzilla.mozilla.org/show_bug.cgi?id=869703
     * for(var i = 0; i < list.length; i++){
      gl.detachShader(prog, list[i]);
    }*/
    
    return prog;
  }

  window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
           window.webkitRequestAnimationFrame ||
           window.mozRequestAnimationFrame ||
           window.oRequestAnimationFrame ||
           window.msRequestAnimationFrame ||
           function(callback){
             return window.setTimeout(callback, 1000/60);
           };
  })();

  window.cancelAnimFrame = (function() {
    return window.cancelAnimationFrame ||
           window.webkitCancelAnimationFrame ||
           window.mozCancelAnimationFrame ||
           window.oCancelAnimationFrame ||
           window.msCancelAnimationFrame ||
           window.clearTimeout;
  })();

  return {
    initializeWebGL: initializeWebGL,
    loadShader : loadShader,
    createProgram : createProgram
  };
}()
