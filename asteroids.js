const FPS = 30;
const SHIP_SIZE = 30;
const TURN_SPEED = 360;
const SHIP_THRUST = 5;  // acceleration base number in pixels
const SHIP_EXPLODE_DUR = 1;  // explosion duration explosion
const SHIP_BLINK_DUR = 0.1;  // explosion duration explosion
const SHIP_INVICIBLE_DUR = 1;  // explosion duration explosion
const FRICTION = 0.7; // when not accelerating anymore
const ASTEROIDS_NUM = 3; // initial asteroids numbers
const ASTEROID_SPD = 20; // starting speed in pixels/s
const ASTEROID_SIZE = 100; // in pixels
const ASTEROID_SIDES = 10; // number of side of each asteroid created
const ASTEROIDS_IMPERFECTION = 0.4; // 0 none, 1 really
const SHOW_BOUNDING = false; // show or hide collison bounding
const LASER_MAX = 3; // max num of laser at once
const LASER_SPEED = 500; // speed of the laser in pixels/sec

/** @type {HTMLCanvasElement} */
let canvas = document.getElementById("gameCanvas");
let context = canvas.getContext("2d");
let ship = {
    x: canvas.width/2,
    y: canvas.height/2,
    radius: SHIP_SIZE/2,
    angle: 90/180 * Math.PI,
    blinkNum: Math.ceil(SHIP_INVICIBLE_DUR * FPS),
    blinkTime: Math.ceil(SHIP_BLINK_DUR * FPS),
    rot: 0,
    explodeTime: 0,
    thrusting: false,
    thrust: {
        x: 0,
        y: 0
    },
    offset: [],
    lasers: [],
    canShoot: true,
}

function shootLaser() {
    // Create laser object
    if( ship.canShoot && ship.lasers.length < LASER_MAX ){
        ship.lasers.push({
            x: ship.x + 4/3*ship.radius*Math.cos(ship.angle),
            y: ship.y - 4/3*ship.radius*Math.sin(ship.angle),
            xv: LASER_SPEED * Math.cos(ship.angle) / FPS,
            yv:  -LASER_SPEED * Math.sin(ship.angle) / FPS,
        })
    }

    // Prevent further shooting
    ship.canShoot = false;
}

let asteroids = [];
createAsteroidBelt();

function createAsteroidBelt() {
    asteroids = [];
    let x, y;

    for( let i = 0; i < ASTEROIDS_NUM; i++){
        do{
            x = Math.floor(Math.random()*canvas.width);
            y = Math.floor(Math.random()*canvas.height);
        }while(distBetweenPoints( ship.x, ship.y, x, y ) < (ASTEROID_SIZE*2 + ship.radius));
        asteroids.push(newAsteroid( x, y, Math.ceil(ASTEROID_SIZE / 2)));
    }
}

function distBetweenPoints( shipX, shipY, x, y){
    return Math.sqrt(Math.pow(shipX - x, 2) + Math.pow(shipY - y, 2));
}

function newAsteroid( x, y, radius) {
    let asteroid = {
        x: x,
        y: y,
        xv: Math.random() * ASTEROID_SPD / FPS * (Math.random() < 0.5 ? 1: -1),
        yv: Math.random() * ASTEROID_SPD / FPS * (Math.random() < 0.5 ? 1: -1),
        radius: radius,
        angle: Math.random() * Math.PI * 2,
        side: Math.floor(Math.random() * (ASTEROID_SIDES + 1) + ASTEROID_SIDES / 2),
        offset: []
    }

    for( let i = 0; i < asteroid.side; i++){
        asteroid.offset.push( Math.random() * ASTEROIDS_IMPERFECTION*2 + 1 - ASTEROIDS_IMPERFECTION);
    }

    return asteroid;
}

function destroyAsteroid(index ){

    let x = asteroids[index].x;
    let y = asteroids[index].y;
    let radius = asteroids[index].radius;
    
    if( radius > ASTEROID_SIZE/6){
        asteroids.push(newAsteroid( x, y, radius / 2));
        asteroids.push(newAsteroid( x, y, radius / 2));
    }
    asteroids.splice(index, 1);
}

function newShip(){
    return {
    x: canvas.width/2,
    y: canvas.height/2,
    radius: SHIP_SIZE/2,
    angle: 90/180 * Math.PI,
    rot: 0,
    explodeTime: 0,
    blinkNum: Math.ceil(SHIP_INVICIBLE_DUR * FPS),
    blinkTime: Math.ceil(SHIP_BLINK_DUR * FPS),
    thrusting: false,
    thrust: {
        x: 0,
        y: 0
    },
    offset: [],
    lasers: [],
    canShoot: true,
}
    
}

function explodeShip() {
    //console.log("Explode!");
    ship.explodeTime = Math.ceil(SHIP_EXPLODE_DUR * FPS);
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

        case 32: // space bar (shoot laser)
            shootLaser();
            break;

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

        case 32: // cna shoot laser
        ship.canShoot = true;
        break;

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
    let exploding = ship.explodeTime > 0;
    let blinkOn = (ship.blinkNum%2 === 0);

    // Draw Space
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Triangular Spaceship
    if(!exploding){
        if(blinkOn){
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

            if(SHOW_BOUNDING){
                context.strokeStyle = "lime";
                context.beginPath();
                context.arc(ship.x, ship.y, ship.radius, 0, Math.PI*2, false);
                context.stroke();
            }
        }

        //Handle blinking
        if(ship.blinkNum > 0){
            // Reduce blink time
            ship.blinkTime--;

            // Reduce Blink Num
            if(ship.blinkTime === 0){
                ship.blinkTime = Math.ceil(SHIP_BLINK_DUR * FPS);
                ship.blinkNum--;
                //console.log(ship.blinkNum);
            }
        }
    } else{
        // Draw the explosion
        context.fillStyle = "yellow";
        context.beginPath();
        context.arc(ship.x + 1.5*Math.random()*ship.radius, ship.y - Math.random()*ship.radius, ship.radius*0.6, 0, Math.PI*2, false);
        context.closePath();
        context.fill();
        context.stroke();
        context.fillStyle = "red";
        context.beginPath();
        context.arc(ship.x + Math.random()*ship.radius, ship.y + Math.random()*ship.radius, ship.radius*0.4, 0, Math.PI*2, false);
        context.closePath();
        context.fill();
        context.stroke();
        context.fillStyle = "white";
        context.beginPath();
        context.arc(ship.x - Math.random()*ship.radius, ship.y + 2*Math.random()*ship.radius, ship.radius*0.3, 0, Math.PI*2, false);
        context.closePath();
        context.fill();
        context.stroke();
        context.fillStyle = "lime";
        context.beginPath();
        context.arc(ship.x + 2*Math.random()*ship.radius, ship.y - Math.random()*ship.radius, ship.radius*0.4, 0, Math.PI*2, false);
        context.closePath();
        context.fill();
        context.stroke();
    }

    // Draw the lasers
    for( let i = 0; i < ship.lasers.length; i++){
        context.fillStyle = "salmon";
        context.beginPath();
        context.arc(ship.lasers[i].x, ship.lasers[i].y, SHIP_SIZE/ 15, 0, Math.PI * 2, false);
        context.fill();
    }

    // Detect Laser shoots on asteroids
    let ax, ay, ar, lx, ly;

    for( let i = asteroids.length -1; i >= 0; i--){
        // get asteroids
        ax = asteroids[i].x;
        ay = asteroids[i].y;
        ar = asteroids[i].radius;
        
        // Loop over lasers
        for( let j = ship.lasers.length -1; j >= 0; j--){
            // get lasers positions
            lx = ship.lasers[j].x;
            ly = ship.lasers[j].y;

            // Detect hit
            if( distBetweenPoints( ax, ay, lx, ly) < ar){

                // remove laser
                ship.lasers.splice(j,1);

                // destroy asteroid
                destroyAsteroid(i);

                break;
            }
        }
    }

    // Draw the asteroids
    context.strokeStyle = "slategrey";
    context.lineWidth = SHIP_SIZE / 20;

    let x, y, radius, angle, sides, offset = [];

    for( let i = 0; i < asteroids.length; i++){
        // Asteroid props
        x = asteroids[i].x;
        y = asteroids[i].y;
        angle = asteroids[i].angle;
        radius = asteroids[i].radius;
        sides = asteroids[i].side;
        offset = asteroids[i].offset;

        //console.log( x, y, angle, radius, sides);

        // Draw a path
        context.beginPath();
        context.moveTo(
            x + radius*offset[0]*Math.cos(angle),
            y + radius*offset[0]*Math.sin(angle)
        )
        // Draw a polygon
        for( var side_poly = 1; side_poly < sides; side_poly++){
            context.lineTo(
                x + radius*offset[side_poly]*Math.cos( angle + side_poly*Math.PI* 2 / sides),
                y + radius*offset[side_poly]*Math.sin( angle + side_poly*Math.PI* 2 / sides),
            )
        }
        context.closePath();
        context.stroke();
        
        if(SHOW_BOUNDING){
            context.strokeStyle = "lime";
            context.beginPath();
            context.arc(x, y, radius, 0, Math.PI*2, false);
            context.closePath();
            context.stroke();
        }

        // Move the asteroid
        asteroids[i].x += asteroids[i].xv;
        asteroids[i].y += asteroids[i].yv;

        // Handle edge of screen
        if( asteroids[i].x < 0 - asteroids[i].radius){
            asteroids[i].x = canvas.width + asteroids[i].radius;
        }else if( asteroids[i].x > canvas.width + asteroids[i].radius){
            asteroids[i].x = -asteroids[i].radius;
        }

        if( asteroids[i].y < 0 - asteroids[i].radius){
            asteroids[i].y = canvas.height + asteroids[i].radius;
        }else if( asteroids[i].y > canvas.height + asteroids[i].radius){
            asteroids[i].y = -asteroids[i].radius;
        }
    }

    // Check for an asteroid collision
    if(!exploding && ship.blinkNum === 0 ){
        for( let roid = 0; roid < asteroids.length; roid++){
            if(distBetweenPoints( ship.x, ship.y, asteroids[roid].x, asteroids[roid].y) < ship.radius + asteroids[roid].radius){
                explodeShip();

                // destroy asteroid
                destroyAsteroid(roid);

                // Avoid destruction of multiple asteroids
                break;
            }
        }
    }

    // Thrusting
    if(ship.thrusting && !exploding){
        if(blinkOn){
            ship.thrust.x += SHIP_THRUST*Math.cos(ship.angle) / FPS;
            ship.thrust.y -= SHIP_THRUST*Math.sin(ship.angle) / FPS;

            // Little flame behing the ship when thrusting
            // Draw Triangular Spaceship
            context.strokeStyle = "yellow";
            context.fillStyle = "red";
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
        }
    }
    else{
        ship.thrust.x -= FRICTION*ship.thrust.x / FPS;
        ship.thrust.y -= FRICTION*ship.thrust.y / FPS;
    }

    if(!exploding){
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
    else{
        ship.explodeTime--;
        if(ship.explodeTime == 0){
            ship = newShip();
        }
    }

    // Move the lasers
    for( let i = ship.lasers.length -1; i >= 0 ; i--){
        ship.lasers[i].x += ship.lasers[i].xv;
        ship.lasers[i].y += ship.lasers[i].yv;

        // Handle edge of screen
        if( (ship.lasers[i].x > (canvas.width + ship.radius)) || (ship.lasers[i].x < 0 - ship.radius)
            || (ship.lasers[i].y > (canvas.height + ship.radius)) || (ship.lasers[i].y < 0 - ship.radius) ){
                ship.lasers.splice(i, 1);
                continue;
        }
    }
}