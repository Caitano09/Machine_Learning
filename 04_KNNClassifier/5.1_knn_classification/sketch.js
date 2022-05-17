let x, y
let video;
let features;
let knn;
let labelP
let ready = false
let label = ''

function setup() {
    createCanvas(320, 240);
    video = createCapture(VIDEO)
    video.size(320, 240);
    video.style('transform', 'scale(-1,1)') //reverter o efeito espelho(direita vai para direita  e esquerda vai para esquerda)
    //video.hide()
    features = ml5.featureExtractor('MobileNet', modelReady)
    labelP = createP('need training data')
    labelP.style('font-size', '32pt')

    x = width / 2
    y = height / 2
}

function goClassify() {
    try {
        if (video.loadedmetadata) {

            const logits = features.infer(video)
            knn.classify(logits, function (error, result) {
                if (error) {
                    console.error(error)
                } else {
                    switch (result.label) {
                        case '0':
                            label = 'left'
                            break;
                        case '1':
                            label = 'right'
                            break;
                        case '2':
                            label = 'up'
                            break;
                        case '3':
                            label = 'down'
                            break;
                        default:
                            break;
                    }
                    //label = result.label
                    labelP.html(label)
                    //goClassify()
                }
            })
        }
    } catch (error) {
        console.log(error)
    }
}

function keyPressed() {
    const logits = features.infer(video)

    if (key == 'l') {
        knn.addExample(logits, 'left')
        console.log('left')

    } else if (key == 'r') {
        knn.addExample(logits, 'right')
        console.log('right')
    } else if (key == 'u') {
        knn.addExample(logits, 'up')
        console.log('up')
    } else if (key == 'd') {
        knn.addExample(logits, 'down')
        console.log('down')
    } else if (key == ' ') {
        knn.addExample(logits, 'stay')
        console.log('stay')
    } else if (key == 's') {
        knn.save(knn, 'model.json')
        //knn.save('model.json')
    }
}

function modelReady() {
    console.log('MobileNet is loaded!!!')
    knn = ml5.KNNClassifier()
    knn.load('model.json', function () {
        console.log('KNN Data Loaded!!!')
        //goClassify()
    })
}

function draw() {
    background(0)
    fill(255)
    ellipse(x, y, 36)
    if (label == 'up') {
        y--
    } else if (label == 'down') {
        y++
    } else if (label == 'left') {
        x--
    } else if (label == 'right') {
        x++
    }
    x = constrain(x, 0, width)
    y = constrain(y, 0, height)
    //image(video, 0, 0)
    // if(!ready && knn.getNumLabels() > 0){
    if (video.loadedmetadata) {
        goClassify()
    }
    //ready = true
    // }
}

