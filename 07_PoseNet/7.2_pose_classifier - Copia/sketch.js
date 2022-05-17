let video
let poseNet
let pose
let skeleton

let brain

let state = 'waiting'
let targetColor

let rSlider, gSlider, bSlider

function delay(time) {
    return new Promise((resolve, reject) => {
        if (isNaN(time)) {
            reject(new Error('delay requires a valid number.'));
        } else {
            setTimeout(resolve, time);
        }
    });
}

async function keyPressed() {
    if (key == 's') {
        brain.saveData()
    } else if (key == 'd') {

        let r = rSlider.value()
        let g = gSlider.value()
        let b = bSlider.value()
        targetColor = [r, g, b]

        console.log(r, g, b)

        await delay(3000)
        console.log('collecting')
        state = 'collecting'

        await delay(3000)
        console.log('not collecting')
        state = 'waiting'
    }
}

function setup() {
    createCanvas(640, 480)
    rSlider = createSlider(0, 255, 255)
    gSlider = createSlider(0, 255, 0)
    bSlider = createSlider(0, 255, 0)

    video = createCapture(VIDEO)
    video.hide()
    poseNet = ml5.poseNet(video, modelLoaded)
    poseNet.on('pose', gotPoses)

    let options = {
        inputs: 34,
        outputs: 3,
        //outputs: ['red', 'green', 'blue'],
        task: 'regression',
        debug: true
    }

    brain = ml5.neuralNetwork(options)
    //brain.loadData('color_poses.json', dataReady);
    const modelInfo = {
        model: 'model/model.json',
        metadata: 'model/model_meta.json',
        weights: 'model/model.weights.bin'
    };
    brain.load(modelInfo, brainLoaded);
}

function brainLoaded() {
    console.log('pose predicting ready!');
    predictColor();
}

function predictColor() {
    if (pose) {
        let inputs = [];
        for (let i = 0; i < pose.keypoints.length; i++) {
            let x = pose.keypoints[i].position.x;
            let y = pose.keypoints[i].position.y;
            inputs.push(x);
            inputs.push(y);
        }
        brain.predict(inputs, gotResult);
    } else {
        setTimeout(predictColor, 100);
    }
}

function gotResult(error, results) {
    console.log(results);
    let r = results[0].value;
    let g = results[1].value;
    let b = results[2].value;
    rSlider.value(r);
    gSlider.value(g);
    bSlider.value(b);
    predictColor();
}

function dataReady() {
    brain.normalizeData();
    brain.train({ epochs: 50 }, finished);
}

function finished() {
    console.log('model trained');
    brain.save();
}

function gotPoses(poses) {
    //console.log(poses)
    if (poses.length > 0) {
        pose = poses[0].pose
        skeleton = poses[0].skeleton

        if (state == 'collecting') {
            let inputs = []

            for (let i = 0; i < pose.keypoints.length; i++) {
                let x = pose.keypoints[i].position.x
                let y = pose.keypoints[i].position.y
                inputs.push(x)
                inputs.push(y)
            }
            brain.addData(inputs, targetColor)
        }
    }
}

function modelLoaded() {
    console.log('poseNet ready')
}

function draw() {
    push()
    if (pose) {
        translate(video.width, 0)
        scale(-1, 1)
        image(video, 0, 0, video.width, video.height);

        let eyeR = pose.rightEye;
        let eyeL = pose.leftEye;
        let d = dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y);

        fill(255, 0, 0)
        ellipse(pose.nose.x, pose.nose.y, d)
        fill(0, 0, 255)
        ellipse(pose.rightWrist.x, pose.rightWrist.y, 32)
        ellipse(pose.leftWrist.x, pose.leftWrist.y, 32)

        for (let i = 0; i < skeleton.length; i++) {
            let a = skeleton[i][0]
            let b = skeleton[i][1]

            strokeWeight(2)
            stroke(255)
            line(a.position.x, a.position.y, b.position.x, b.position.y)

        }

        for (let i = 0; i < pose.keypoints.length; i++) {
            let x = pose.keypoints[i].position.x
            let y = pose.keypoints[i].position.y
            fill(0, 255, 0)
            ellipse(x, y, 16, 16)
        }
    }
    pop()

    let r = rSlider.value();
    let g = gSlider.value();
    let b = bSlider.value();
    background(r, g, b, 100);
}
