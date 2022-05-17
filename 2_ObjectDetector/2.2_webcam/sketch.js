//let img
let video
let detector
let detections = []

function preload() {
    //img = loadImage('dog_cat.webp')
    detector = ml5.objectDetector('cocossd')
}

function gotDetections(error, results) {
    if (error) {
        console.error(error)
    }
    console.log(results)
    detections = results
}

function setup() {
    createCanvas(640, 480)
    video = createCapture(VIDEO) 
    video.size(640, 480)    
    video.hide()
}

function draw() {
    if (video.loadedmetadata) {
        detector.detect(video, gotDetections)
        image(video, 0, 0)

        for (let i = 0; i < detections.length; i++) {
            let object = detections[i];
            stroke(0, 255, 0);
            strokeWeight(4);
            noFill();
            rect(object.x, object.y, object.width, object.height);
            noStroke()
            fill(255)
            textSize(24)
            text(object.label, object.x + 10, object.y + 24)
        }
    }
}

