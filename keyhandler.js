upKeyPressed = false;
downKeyPressed = false;
leftKeyPressed = false;
rightKeyPressed = false;
spacePressed = false;

/*
 * Registers whether a key is being pressed and changes the proper boolean value
 */
document.onkeydown = function(e) {
    e = e || window.event;
    e.preventDefault();
    switch(e.keyCode) {
        case 32:
            spacePressed = true;
            break;
        case 37:
            leftKeyPressed = true;
            break;
        case 38:
            upKeyPressed = true;
            break;
        case 39:
            rightKeyPressed = true;
            break;
        case 40:
            downKeyPressed = true;
            break;
    }
};

/*
 * Changes the proper boolean value when a key is released.
 */
document.onkeyup = function(e) {
    e = e || window.event;
    e.preventDefault();
    switch(e.keyCode) {
        case 32:
            spacePressed = false;
            break;
        case 37:
            leftKeyPressed = false;
            break;
        case 38:
            upKeyPressed = false;
            break;
        case 39:
            rightKeyPressed = false;
            break;
        case 40:
            downKeyPressed = false;
            break;
    }
};
