const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");
const FPS = 30;

setInterval( update, 1000 / FPS);

function update() {
    // Draw Space
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.clientWidth, canvas.height);
    // Draw Spaceship

    // Rotate Spaceship

    // Move SpaceShip
}