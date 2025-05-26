let video;
let canvas;
let pixelationLevel = 0;
let lastCaptureTime;
let decayRate = 1000;
let captureSound;

function preload() {
    captureSound = loadSound('capture-sound.mp3');
}

function setup() {
    canvas = createCanvas(640, 480);
    canvas.parent("canvas-container");
    pixelDensity(1);

    video = createCapture(VIDEO);
    video.size(width, height);
    video.hide();

    lastCaptureTime = millis();

    // Add event listener to capture when video is clicked
    let captureVideo = document.getElementById("capture-video");
    captureVideo.addEventListener("click", capturePhoto);

    document.body.style.cursor = "url('cursor.png'), auto";
}

function draw() {
    background(255);
    video.loadPixels();
    let stepSize = max(pixelationLevel, 1);

    for (let y = 0; y < height; y += stepSize) {
        for (let x = 0; x < width; x += stepSize) {
            let index = (x + y * width) * 4;
            let r = video.pixels[index];
            let g = video.pixels[index + 1];
            let b = video.pixels[index + 2];

            fill(r, g, b);
            noStroke();
            rect(x, y, stepSize, stepSize);
        }
    }

    if (millis() - lastCaptureTime > decayRate && pixelationLevel > 0) {
        pixelationLevel = max(pixelationLevel - 2, 0);
        lastCaptureTime = millis();
    }

    fill(255, 204, 0);
    textSize(24);
    textAlign(CENTER, CENTER);
    let timestamp = new Date().toLocaleString();
    text(timestamp, width / 2, height / 2);
}

function capturePhoto() {
    lastCaptureTime = millis();
    pixelationLevel += 5;

    if (captureSound.isLoaded()) {
        captureSound.play();
    }

    let photo = canvas.elt.toDataURL("image/png");
    let a = document.createElement("a");
    a.href = photo;
    a.download = "digital_face.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
