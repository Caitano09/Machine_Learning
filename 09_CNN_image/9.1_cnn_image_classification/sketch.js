let video
let videoSize = 64
let ready = false

let pixelBrain
let label = ''

function setup() {
    createCanvas(700, 700)
    video = createCapture(VIDEO, videoReady)
    video.size(videoSize, videoSize)
    video.hide() 

    let customLayers = layers = [
        {
          type: 'conv2d',
          filters: 8,
          kernelSize: 5,
          strides: 1,
          activation: 'relu',
          kernelInitializer: 'varianceScaling',
        },
        {
          type: 'maxPooling2d',
          poolSize: [2, 2],
          strides: [2, 2],
        },
        {
          type: 'conv2d',
          filters: 16,
          kernelSize: 5,
          strides: 1,
          activation: 'relu',
          kernelInitializer: 'varianceScaling',
        },
        {
          type: 'maxPooling2d',
          poolSize: [2, 2],
          strides: [2, 2],
        },
        {
          type: 'flatten',
        },
        {
          type: 'dense',
          kernelInitializer: 'varianceScaling',
          activation: 'softmax',
        },
      ];

    let options = {
        inputs: [64, 64, 4],
        task: 'imageClassification',
        layers: customLayers,
        debug: true
    }
    pixelBrain = ml5.neuralNetwork(options)
    //pixelBrain.loadData('data.json', loaded)
}

function loaded() {
    pixelBrain.train({ epochs: 50 }, finishedTraining)
}

function finishedTraining() {
    console.log('training complete')
    classifyVideo()
}

function classifyVideo() {
    let inputImage = { image: video }
    pixelBrain.classify(inputImage, gotResults)
}

function gotResults(error, results) {
    if (error) {
        return;
    }
    label = results[0].label
    classifyVideo()
}

function keyPressed() {
    if (key == 't') {
        pixelBrain.normalizeData()
        pixelBrain.train({ epochs: 50 }, finishedTraining)
    } else if (key == 's') {
        pixelBrain.saveData()
    } else if (key == 'm') {
        addExample('Nice mask!')
    } else if (key == 'n') {
        addExample('Keep others safe! Wear your mask!')
    } else {
        addExample(key)
    }
}

function addExample(label) {
    let inputImage = { image: video }
    let target = { label }
    console.log("Add example: " + label)
    pixelBrain.addData(inputImage, target)
}

function videoReady() {
    ready = true
}

function draw() {
    background(0)
    if (ready) {
        image(video, 0, 0, width, height)
    }

    textSize(64)
    textAlign(CENTER, CENTER)
    fill(255)
    text(label, width / 2, height / 2)

}