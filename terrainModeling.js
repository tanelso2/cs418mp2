//-------------------------------------------------------------------------
function terrainFromIteration(n, minX,maxX,minY,maxY, vertexArray, faceArray, normalArray)
{
    var deltaX=(maxX-minX)/n;
    var deltaY=(maxY-minY)/n;
    for(var i=0;i<=n;i++)
       for(var j=0;j<=n;j++)
       {
           vertexArray.push(minX+deltaX*j);
           vertexArray.push(minY+deltaY*i);
           vertexArray.push(0);
           
           normalArray.push(0);
           normalArray.push(0);
           normalArray.push(1);
       }

    var numT=0;
    for(var i=0;i<n;i++)
       for(var j=0;j<n;j++)
       {
           var vid = i*(n+1) + j;
           faceArray.push(vid);
           faceArray.push(vid+1);
           faceArray.push(vid+n+1);
           
           faceArray.push(vid+1);
           faceArray.push(vid+1+n+1);
           faceArray.push(vid+n+1);
           numT+=2;
       }
    return numT;
}

/*
 * JS's % operator isn't true modulo and screws up when given negative numbers
 * So I made this function to combat this implementation
 */
function actualModuloBecauseJSisStupid(d, n) {
    if(d < 0) {
        while(d < 0) {
            d = n + d;
        }
        return d;
    } else {
        return d % n;
    }
}

/**
 * Generates a random terrain based on the diamond squares algorithm
 * This website helped me out in writing this: http://www.playfuljs.com/realistic-terrain-in-130-lines/
 */
function diamondSquaresTerrain(n, minX, maxX, minY, maxY, vertexArray, faceArray, normalArray) {
    var STARTING_HEIGHT = 100;
    var tempVertexArray = [];
    var tempNormalArray = [];
    var deltaX = (maxX-minX)/n;
    var deltaY = (maxY-minY)/n;
    //Create a temporary array that will store vertices as length 3 arrays
    //and another temporary array for storing normals as vec3s
    for(var i=0; i <= n; i++) {
        for(var j=0; j <= n; j++) {
            tempVertexArray.push([minX+deltaX*j, 0, minY+deltaY*i]);
            tempNormalArray.push(vec3.fromValues(0.0, 0.0, 0.0));
        }
    }
    
    //Functions are defined inside this function because they are useless
    //everywhere else and would pollute the global namespace
    
    //Sets the vertex at i,j to height val
    function set(i, j, val) {        
        if( i < 0 || i > n || j < 0 || j > n) {
            return;
        }
        tempVertexArray[i+j*(n+1)][1] = val;
    }
    
    
    //Gets the height of the vertex at i,j
    function get(i, j) {
        //If out of bounds, wrap around
        if( i < 0 || i > n || j < 0 || j > n) {
            i = actualModuloBecauseJSisStupid(i, n+1);
            j = actualModuloBecauseJSisStupid(j, n+1);
        }
        return tempVertexArray[i+j*(n+1)][1];
    }
    
    set(0, 0, STARTING_HEIGHT);
    set(n, 0, STARTING_HEIGHT);
    set(n, n, STARTING_HEIGHT);
    set(0, n, STARTING_HEIGHT);
    
    divide((n+1), 100);
    
    //Recursive function that does the diamond squares algorithm
    //on smaller and smaller sections
    function divide(size, randomness) {
        var x, y, half = size / 2;
        if (half < 1) return;
        
        for(y = half; y < (n+1); y += size) {
            for(x = half; x < (n+1); x += size) {
                square(x, y, half, Math.random() * randomness);
            }
        }
        
        for(y = 0; y < (n+1); y += half) {
            for(x = (y + half) % size; x < (n+1); x += size) {
                diamond(x, y, half, Math.random() * randomness);
            }
        }
        
        //smoothing factor. Higher values make the terrain more jagged
        var alpha = 0.5;
        divide(size / 2, alpha * randomness);
    }
    
    /*
     * Takes the average of an array
     */
    function average(lst) {
        var sum = 0;
        lst.forEach(function(d) {
            sum += d;
        });
        return sum / lst.length;
    }
    
    /*
     * Does the square part of the diamond square
     */
    function square(x, y, size, offset) {
        var otherVals = [
            get(x - size, y - size),
            get(x + size, y - size),
            get(x + size, y + size),
            get(x - size, y + size)
        ];
        var avg = average(otherVals);
        set(x, y, avg + offset);
    }
    
    /*
     * Does the diamond part of the diamond square
     */
    function diamond(x, y, size, offset) {
        var otherVals = [
            get(x, y - size),
            get(x + size, y),
            get(x - size, y),
            get(x, y + size)
        ];
        var avg = average(otherVals);
        set(x, y, avg + offset);
    }

    /*
     * Calculates the normal of a triangle given the three points
     */
    function calculateNormal(p1, p2, p3) {
        var w = vec3.fromValues(p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]);
        var v = vec3.fromValues(p3[0] - p1[0], p3[1] - p1[1], p3[2] - p1[2]);
        vec3.cross(v, w, v);
        vec3.normalize(v, v);
        return v;
    }
    
    var numT = 0;
    //Calculate the faces and the normals
    for(var i=0;i<n;i++) {
       for(var j=0;j<n;j++)
       {
           var vid = i*(n+1) + j;
           //push this triangle onto the faceArray
           faceArray.push(vid);
           faceArray.push(vid+1);
           faceArray.push(vid+n+1);
           
           //calculate this triangle's normal and add it to the normals for the incident vertices
           var normal1 = calculateNormal(tempVertexArray[vid], tempVertexArray[vid+1], tempVertexArray[vid+n+1]);
           vec3.add(tempNormalArray[vid], tempNormalArray[vid], normal1);
           vec3.add(tempNormalArray[vid+1], tempNormalArray[vid+1], normal1);
           vec3.add(tempNormalArray[vid+n+1], tempNormalArray[vid+n+1], normal1);

           //same as before but with a different triangle
           faceArray.push(vid+1);
           faceArray.push(vid+1+n+1);
           faceArray.push(vid+n+1);
           
           var normal2 = calculateNormal(tempVertexArray[vid+1], tempVertexArray[vid+1+n+1], tempVertexArray[vid+n+1]);
           vec3.add(tempNormalArray[vid+1], tempNormalArray[vid+1], normal1);
           vec3.add(tempNormalArray[vid+1+n+1], tempNormalArray[vid+1+n+1], normal1);
           vec3.add(tempNormalArray[vid+n+1], tempNormalArray[vid+n+1], normal1);
           
           //count the number of triangles in the array
           numT += 2;

       }
    }
    
    /*
     * Flattens the array of arrays
     */
    for(var i = 0; i < tempVertexArray.length; i++) {
        vertexArray.push(tempVertexArray[i][0]);
        vertexArray.push(tempVertexArray[i][1]);
        vertexArray.push(tempVertexArray[i][2]);
    }
    
    /*
     * Normalizes the vertex vectors and flattens the array of arrays
     */ 
    var tempVec = vec3.create();
    for(var i = 0; i < tempNormalArray.length; i++) {
        vec3.normalize(tempVec, tempNormalArray[i]);
        normalArray.push(tempVec[0]);
        normalArray.push(tempVec[1]);
        normalArray.push(tempVec[2]);
    }
    
    return numT;
}

//-------------------------------------------------------------------------
