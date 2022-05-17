let mobilenet;
let classifier;
let video;
let label = 'model loading...';
let walletButton;
let cupButton;
let trainButton;
let saveButton;

function modelReady() {
    console.log('Model is ready!!!')
    classifier.load('model.json', customModelReady)
}

function customModelReady(){
    console.log('Custom Model is ready!!!')
    label = 'model ready!'
    classifier.classify(gotResults)
}

function videoReady() {
    console.log('Video is ready!!!')
}

// function whileTraining(loss){
//     if(loss == null){
//         console.log('Training Complete')
//         classifier.classify(gotResults)
//     }else{
//         console.log(loss)
//     }
// }

function gotResults(error, result) {
    if (error) {
        console.error(error)
    } else {
        //console.log(result)
        label = result[0].label
        classifier.classify(gotResults)
    }
}

function imageReady(){
    image(puffin, 0, 0, width, height)
}

function setup() {
    createCanvas(320, 270);
    video = createCapture(VIDEO)
    video.hide()
    background(0);
    mobilenet = ml5.featureExtractor('MobileNet', modelReady)
    classifier = mobilenet.classification(video, videoReady)

    // walletButton = createButton('happy')
    // walletButton.mousePressed(function(){
    //     classifier.addImage('happy')
    // })

    // cupButton = createButton('sad')
    // cupButton.mousePressed(function(){
    //     classifier.addImage('sad')
    // })

    // trainButton = createButton('train')
    // trainButton.mousePressed(function(){
    //     classifier.train(whileTraining)
    // })

    // saveButton = createButton('save')
    // saveButton.mousePressed(function(){
    //     classifier.save()
    // })
}

function draw() {
    background(0);
    image(video, 0, 0, 320, 240)
    fill(255)
    textSize(16)
    text(label, 10, height - 20)
}