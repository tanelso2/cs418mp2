/*
 * Camera constructor
 */
function Camera() {
    this.location = vec3.fromValues(0.0, 100.0, 0.0);
    this.viewDir = vec3.fromValues(0.0, 0.0, 1.0);
    this.upVec = vec3.fromValues(0.0, -1.0, 0.0);
    this.viewPt = vec3.fromValues(0.0, 0.0, 0.0);
    this.cameraRot = quat.fromValues(0,0,0,1.0);
    this.rollAxis = vec3.fromValues(0.0, 0.0, 1.0);
    this.pitchAxis = vec3.fromValues(-1.0, 0.0, 0.0);
    //the "new" vectors store the transformed values
    this.newUp = vec3.create();
    this.newViewDir = vec3.create();
    this.mvMatrix = mat4.create();
    this.rollRot = quat.create();
    this.pitchRot = quat.create();
}

/*
 * Creates the MVMatrix that corresponds to the current camera location and rotation
 */
Camera.prototype.calculateMVMatrix = function() {
    vec3.transformQuat(this.newUp, this.upVec, this.cameraRot);
    vec3.transformQuat(this.newViewDir, this.viewDir, this.cameraRot);
    vec3.add(this.viewPt, this.location, this.newViewDir);
    mat4.lookAt(this.mvMatrix, this.location, this.viewPt, this.newUp);
    return this.mvMatrix;
};

/*
 * Pitches the camera by rad radians
 */
Camera.prototype.pitch = function(rad) {
    quat.setAxisAngle(this.pitchRot, this.pitchAxis, rad);
    quat.mul(this.cameraRot, this.cameraRot, this.pitchRot);
    quat.normalize(this.cameraRot, this.cameraRot);
};

/*
 * Rolls the camera by rad radians
 */
Camera.prototype.roll = function(rad) {
    quat.setAxisAngle(this.rollRot, this.rollAxis, rad);
    quat.mul(this.cameraRot, this.cameraRot, this.rollRot);
    quat.normalize(this.cameraRot, this.cameraRot);
};

/*
 * Moves the camera in the direction that it is pointing
 */
Camera.prototype.moveForward = function(amount) {
    vec3.normalize(this.newViewDir, this.newViewDir);
    vec3.scaleAndAdd(this.location, this.location, this.newViewDir, amount);
};

/*
 * Returns the direction the camera is currently facing
 */
Camera.prototype.getViewDirection = function() {
    return this.newViewDir;
}
