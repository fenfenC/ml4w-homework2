// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
PoseNet example using p5.js
=== */

let video;
let poseNet;
let poses = [];
let isPlaying = false;
//let song1;
let song2;
let img;
const squareSize = 50;


function preload() {
  song2 = loadSound('dog.mp3')
  //img = loadImage('assets/dog.png');
}

function setup() {
  createCanvas(640, 480);

  video = createCapture(VIDEO);
  video.size(width, height);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, 'single', modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function(results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  video.hide();
}

function modelReady() {
  select('#status').html('Model Loaded');
}

function draw() {
  // Flip the video from left to right, mirror the video
  translate(width, 0)
  scale(-1, 1);
  image(video, 0, 0, width, height);
}

function draw(){
 if (isPlaying) {
    fill(255, 0, 0);
    // .isPlaying() returns a boolean
    // If the song is not playing, play the song
    if (!song2.isPlaying()) {
      song2.play();
    }
  } else {
    fill(255, 215, 0);
    // .isPaused()() returns a boolean
    // If the song is not paused, pause the song
    if (!song2.isPaused()) {
      song2.pause();
    }
  }
  noStroke();
  rect(width/2, height/2 - squareSize/2, squareSize, squareSize);
  drawKeypoints2();
  drawSkeleton();
  loadImage('dog.png', img => {
  image(img, width/2, height/2 - squareSize/2, 50,50);
  });
}


function drawKeypoints2()  {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        fill(144, 238, 144);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
      // keypoint[0] is the nose point
      // Only check the first pose
      if (i === 0 && j === 0) {
        ellipse(keypoint.position.x, keypoint.position.y, 30, 30);
        checkIfPlay2(keypoint.position);
      }
    }
  }
}

function checkIfPlay2(position) {
  const halfSize = squareSize / 2;
  if (position.x >= width/2 - halfSize && position.x <= width /2  + halfSize &&
  position.y >= height / 2 - halfSize && position.y <= height / 2 + halfSize
  ) {
    isPlaying = true;
  } else {
    isPlaying = false;
  }
}


// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      stroke(255, 225, 255);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}
