function worldObject(parent) {
    this.rotationTransformation = mat4.create();
    this.translationTransformation = mat4.create();
    this.selfRotationTransofmation = mat4.create();
    mat4.identity(this.rotationTransformation);
    mat4.identity(this.translationTransformation);
    mat4.identity(this.selfRotationTransofmation);
    
    this.children = [];
    
    this.vertexPositionBuffer = null;
    this.vertexTextureCoordBuffer = null;
    this.vertexIndexBuffer = null;
    this.vertexNormalBuffer = null;
    
    this.show = true; 
    
    this.lightSource = false;
    this.rotationSpeed = 0.001;
    this.selfRotationSpeed = 0.005;
    this.rotationDirection = 0;
    this.texture = null;
    
    if ( parent != null ) {
        parent.addChild(this);
    }
}

worldObject.prototype.addChild = function (child) {
    this.children.push(child);
};

worldObject.prototype.translate = function (translation) {
    mat4.translate(this.translationTransformation, translation);
};

worldObject.prototype.orbitRotation = function (rotation, axis) {
    mat4.rotate(this.rotationTransformation, rotation, axis);
};

worldObject.prototype.selfRotate = function (rotation, axis) {
    mat4.rotate(this.selfRotationTransofmation, rotation, axis);
};

worldObject.prototype.scale = function (scale) {
    mat4.scale(this.rotationTransformation, scale);
};

worldObject.prototype.draw = function () {
    if ( this.show ) {
        if ( this.texture != null ) {
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.uniform1i(shaderProgram.samplerUniform, this.texture.bindNumber);
        }
        
        mvPushMatrix();
        mat4.multiply(mvMatrix, this.rotationTransformation);
        mat4.multiply(mvMatrix, this.translationTransformation);
        
        mvPushMatrix();
        
        mat4.multiply(mvMatrix, this.selfRotationTransofmation);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTextureCoordBuffer);
        gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.vertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexNormalBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, this.vertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
        
        gl.uniform1i(shaderProgram.useLightingUniform, lightingOn);
        var lightingOn = true;
        var ambiantLightOn = true;
        if ( lightingOn && this.lightSource ) {
            if ( ambiantLightOn ) {
                gl.uniform3f(
                    shaderProgram.ambientColorUniform,
                    0.5,
                    0.5,
                    0.5
                );
            } else {
                gl.uniform3f(
                    shaderProgram.ambientColorUniform,
                    0,
                    0,
                    0
                );
            }
            
            gl.uniform3f(
                shaderProgram.pointLightingLocationUniform,
                mvMatrix[ 12 ],
                mvMatrix[ 13 ],
                mvMatrix[ 14 ]
            );
            
            gl.uniform3f(
                shaderProgram.pointLightingColorUniform,
                1,
                1,
                1
            );
        }
        
        setMatrixUniforms();
        
        if ( this.vertexIndexBuffer == null ) {
            gl.drawArrays(drawStyle, 0, this.vertexPositionBuffer.numItems);
        }
        else {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
            gl.drawElements(drawStyle, this.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
        }
        
        mvPopMatrix();
        
        // Draws children
        for ( var i = 0 ; i < this.children.length ; i++ ) {
            if ( this.children[ i ].show ) {
                this.children[ i ].draw();
            }
        }
        mvPopMatrix();
    }
}
;

worldObject.prototype.animate = function (elapsedTime) {
    //animate children
    for ( var i = 0 ; i < this.children.length ; i++ ) {
        this.children[ i ].animate(elapsedTime);
    }
    this.orbitRotation(this.rotationSpeed * elapsedTime, [ 0, this.rotationDirection, 0 ]);
    this.selfRotate(this.selfRotationSpeed * elapsedTime, [ 0, 1, 0 ]);
};