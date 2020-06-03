var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");
const FPS = 30;
const SHIP_SIZE = 30;
const TURN_SPEED = 360;
const SHIP_THRUST = 5;  // acceleration base number in pixels

var ship = {
    x: canvas.width/2,
    y: canvas.height/2,
    radius: SHIP_SIZE/2,
    angle: 90/180 * Math.PI,
    rot: 0,
    thrusting: false,
    thrust: {
        x: 0,
        y: 0
    }
}

// Events Listeners
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

function keyDown(e) {

    console.log('KeyDown', e.keyCode)
    switch(e.keyCode){
        // Left arrow key -> rotate left
        case 37:
            ship.rot = (TURN_SPEED/180)*Math.PI/FPS;
        break;

        // Up arrow key -> propulsion forward
        case 38:
            ship.thrusting = true;
        break;

        // Right arrow key -> rotate left
        case 39:
            ship.rot = -(TURN_SPEED/180)*Math.PI/FPS;
        break;
    }
}

function keyUp(e){
    switch(e.keyCode){
        // Left arrow key -> rotate left
        case 37:
            ship.rot = 0;
        break;

        // Up arrow key -> propulsion forward
        case 38:
            ship.thrusting = false;
        break;

        // Right arrow key -> rotate left
        case 39:
            ship.rot = 0;
        break;
    }
}

setInterval( update, 1000 / FPS);

function update() {
    // Draw Space
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.clientWidth, canvas.height);

    // Draw Triangular Spaceship
    context.strokeStyle = "white";
    context.lineWidth = SHIP_SIZE/20;
    context.beginPath();
    // Nose of the Spaceship
    context.moveTo( 
        ship.x + 4/3*ship.radius*Math.cos(ship.angle),
        ship.y - 4/3*ship.radius*Math.sin(ship.angle)
        );
    // Left side
    context.lineTo(
        ship.x - ship.radius*(2/3*Math.cos(ship.angle) + Math.sin(ship.angle)),
        ship.y + ship.radius*(Math.sin(ship.angle) - Math.cos(ship.angle))
    );
    // Right side
    context.lineTo(
        ship.x - ship.radius*(2/3*Math.cos(ship.angle) - Math.sin(ship.angle)),
        ship.y + ship.radius*(Math.sin(ship.angle) + Math.cos(ship.angle))
    );
    context.closePath();
    context.stroke();
    
    // Center Dot
    context.fillStyle = "red";
    context.fillRect(ship.x, ship.y, 1, 1);

    // Rotate Spaceship
    ship.angle += ship.rot;

    // Thrusting
    if(ship.thrusting){
        ship.thrust.x += SHIP_THRUST*Math.cos(ship.angle) / FPS;
        ship.thrust.y -= SHIP_THRUST*Math.sin(ship.angle) / FPS;
    }
    else{
        ship.thrust.x = 0;
        ship.thrust.y = 0;
    }

    // Move SpaceShip
    ship.x += ship.thrust.x;
    ship.y += ship.thrust.y;
}