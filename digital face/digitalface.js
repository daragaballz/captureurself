let video;
let canvas;
let pixelationLevel = 5; // Initial pixelation level
let lastCaptureTime;
let decayRate = 2000; // Time in ms before clarity is restored

function setup() {
    canvas = createCanvas(640, 480);
    pixelDensity(1); // Prevents automatic pixel scaling
    video = createCapture(VIDEO);
    video.size(width, height);
    video.hide();
    lastCaptureTime = millis(); // Track last capture time
}

function draw() {
    background(0);

    // Show video with pixelation
    video.loadPixels();
    let d = pixelDensity();
    let stepSize = max(pixelationLevel, 1); // Ensure at least 1px resolution

    for (let y = 0; y < height; y += stepSize) {
        for (let x = 0; x < width; x += stepSize) {
            let index = (x + y * width) * 4 * d; 
            let r = video.pixels[index];
            let g = video.pixels[index + 1];
            let b = video.pixels[index + 2];

            fill(r, g, b);
            noStroke();
            rect(x, y, stepSize, stepSize);
        }
    }

    // Restore clarity over time if no new capture
    if (millis() - lastCaptureTime > decayRate && pixelationLevel > 5) {
        pixelationLevel -= 0.1; // Gradual clarity restoration
    }
}

// Function to capture and pixelate image
function capturePhoto() {
    lastCaptureTime = millis(); // Reset decay timer
    pixelationLevel += 2; // Increase distortion
    saveCanvas(canvas, 'distorted_image', 'png'); // Save image
}

// Button to take a photo
function keyPressed() {
    if (key === ' ') { // Press SPACE to capture
        capturePhoto();
    }
}
