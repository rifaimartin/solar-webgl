var sun;
var myWorldBackground; 

function initWorldObjects() {
    myWorldBackground = new sphere(null, 1);
    myWorldBackground.texture = worldTexture;
    
    var sun = new sphere(null, -1);
    sun.texture = sunTexture;
    sun.lightSource = true;
    sun.selfRotationSpeed = 0.0001;
    
    var earth = new sphere(sun);
    earth.texture = earthTexture;
    earth.rotationDirection = 1;
    earth.rotationSpeed = 0.001;
    earth.selfRotationSpeed = 0.0005;
    earth.translate([ 0, 0, 15 ]);
    earth.scale([ 0.35, 0.35, 0.35 ]);
    
    var moon = new sphere(earth);
    moon.texture = moonTexture;
    moon.rotationDirection = 1;
    moon.selfRotationSpeed = 0.0005;
    moon.rotationSpeed = 0.0005;
    moon.translate([ 0, 0, 11 ]);
    moon.scale([ 0.15, 0.15, 0.15 ]);
    
 
    
    return sun;
}