const FPS = 30;
const SHIP_SIZE = 30;
const TURN_SPEED = 360;
const SHIP_THRUST = 5;  // acceleration base number in pixels
const FRICTION = 0.7; // when not accelerating anymore

/** @type {HTMLCanvasElement} */
var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

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

// Loop
setInterval( update, 1000 / FPS);

// When pressing a key
function keyDown( /** @type {KeyboardEvent} */ e) {

    //console.log('KeyDown', e.keyCode)
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

// After releasing a key
function keyUp( /** @type {KeyboardEvent} */ e){
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

function update() {
    // Draw Space
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);

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

    // Thrusting
    if(ship.thrusting){
        ship.thrust.x += SHIP_THRUST*Math.cos(ship.angle) / FPS;
        ship.thrust.y -= SHIP_THRUST*Math.sin(ship.angle) / FPS;

        // Little flame behing the ship when thrusting
        // Draw Triangular Spaceship
        context.strokeStyle = "yellow";
        context.fillStyle = "red"
        context.lineWidth = SHIP_SIZE/20;
        context.beginPath();
        // Nose of the Spaceship
        context.moveTo( 
            ship.x - ship.radius*(2/3*Math.cos(ship.angle) + 0.5*Math.sin(ship.angle)),
            ship.y + ship.radius*(Math.sin(ship.angle) - 0.5*Math.cos(ship.angle))
            );
        // Left side
        context.lineTo(
            ship.x - 6/3*ship.radius*Math.cos(ship.angle),
            ship.y + 6/3*ship.radius*Math.sin(ship.angle)
        );
        // Right side
        context.lineTo(
            ship.x - ship.radius*(2/3*Math.cos(ship.angle) - 0.5*Math.sin(ship.angle)),
            ship.y + ship.radius*(Math.sin(ship.angle) + 0.5*Math.cos(ship.angle))
        );
        context.closePath();
        context.fill();
        context.stroke();
        
        // Center Dot
        context.fillStyle = "red";
        context.fillRect(ship.x, ship.y, 1, 1);
    }
    else{
        ship.thrust.x -= FRICTION*ship.thrust.x / FPS;
        ship.thrust.y -= FRICTION*ship.thrust.y / FPS;
    }

    // Rotate Spaceship
    ship.angle += ship.rot;

    // Move SpaceShip
    ship.x += ship.thrust.x;
    ship.y += ship.thrust.y;

    // Handle Edge of the Screen
    if( ship.x < 0 - ship.radius){
        ship.x = canvas.width + ship.radius;
    }
    else if( ship.x > canvas.width + ship.radius){
        ship.x = -ship.radius;
    }

    if( ship.y < 0 - ship.radius){
        ship.y = canvas.height + ship.radius;
    }
    else if( ship.y > canvas.width + ship.radius){
        ship.y = -ship.radius;
    }
}