var drawStyle;

var userRotationMatrix = mat4.create();
mat4.identity(userRotationMatrix);

var camera; 
var camera1;
var camera2;
var camera3;

function drawScene() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.clear(gl.DEPTH_BUFFER_BIT);
    
    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
    mat4.identity(mvMatrix);
    
    camera.update();
    
    sun.draw(); 
}

var lastTime = 0;
function animate() {
    var timeNow = new Date().getTime();
    var elapsed = 0;
    var isTurning = true
    if ( isTurning ) { 
        elapsed = 1.5 * (timeNow - lastTime);
    }
    sun.animate(elapsed);
    lastTime = timeNow;
}

function tick() {
    requestAnimFrame(tick);
    drawScene();
    animate();
}

function webGLStart() {
    var canvas = document.getElementById("solarsystem-canvas");
    
    camera = initCameras();
    initGL(canvas);
    initShaders();
    initTextures();
    sun = initWorldObjects();
    
   
    
    drawStyle = gl.TRIANGLES;
    tick(); 
}

function initCameras() {
    camera1 = new camera(null, 0, 0, -30, 0, 0);
    camera2 = new camera(null, 0, 0, +30, 180, 0);
    camera3 = new camera(null, 0, 30, 0, 0, -90);
    
    return camera1;
}

