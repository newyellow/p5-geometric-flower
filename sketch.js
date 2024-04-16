let STROKE_DENSITY = 0.1;
let BRUSH_LENGTH = 4;
let BRUSH_THICKNESS = 2;

let NOW_STROKE_COLOR;
let LEAF_BASE_RATIO = 0.2;
let LEAF_NOISE_RATIO = 0.8;

let COLOR_SETTING;

async function setup() {
  createCanvas(1920, 1200);
  background(10);
  colorMode(HSB);

  COLOR_SETTING = getRandomColorSetting();

  let xCount = int(random(12, 60));
  let yCount = int(random(1, 3));

  let SIZE_RATIO_MIN = random(0.06, 0.12);
  let SIZE_RATIO_MAX = random(0.36, 0.66);

  let noiseScaleY = random(0.003, 0.01);
  let widthNoiseDiff = random(0.1, 0.2) * width;
  let heightNoiseDiff = 0.4 * height;

  let counter = 0;

  for (let y = 0; y < yCount; y++) {
    for (let x = 0; x < xCount; x++) {

      if (random() < 0.2)
        continue;

      let xt = x / (xCount - 1);
      let yt = y / (yCount - 1);

      let newX = lerp(0.05, 0.95, xt) * width + random(-60, 60);
      let newY = lerp(0.6, 0.6, xt) * height;

      let noiseValue = noise(newX * 0.01, newY * 0.24);
      noiseValue = (noiseValue - 0.5) * 2.0; // -1 ~ 1

      // newX += noiseValue * widthNoiseDiff;
      newY += noiseValue * heightNoiseDiff;
      newY += random(-0.2, 0.2) * height;

      let newZ = x + y * xCount;

      let newSize = random(SIZE_RATIO_MIN, SIZE_RATIO_MAX) * min(width, height);
      

      stroke('white');
      // point(newX, newY);
      randomFlower(newX, newY, newSize);

      if(counter++ % 3 == 0)
      {
        noStroke();
        fill(0, 0, 0, 0.03);
        rect(0, 0, width, height);
      }
      await sleep(1);
    }
  }
}

async function randomFlower(_x, _y, _size) {

  let hueA = processHue(COLOR_SETTING.mainColorA.hue + random(-20, 20));
  let satA = COLOR_SETTING.mainColorA.sat + random(-20, 20);
  let briA = COLOR_SETTING.mainColorA.bri + random(-20, 20);

  let hueB = processHue(COLOR_SETTING.mainColorB.hue + random(-20, 20));
  let satB = COLOR_SETTING.mainColorB.sat + random(-20, 20);
  let briB = COLOR_SETTING.mainColorB.bri + random(-20, 20);


  let subHueA = processHue(COLOR_SETTING.subColorA.hue + random(-20, 20));
  let subSatA = COLOR_SETTING.subColorA.sat + random(-20, 20);
  let subBriA = COLOR_SETTING.subColorA.bri + random(-20, 20);

  let subHueB = processHue(COLOR_SETTING.subColorB.hue + random(-20, 20));
  let subSatB = COLOR_SETTING.subColorB.sat + random(-20, 20);
  let subBriB = COLOR_SETTING.subColorB.bri + random(-20, 20);


  let stickHueA = processHue(COLOR_SETTING.stickColorA.hue + random(-20, 20));
  let stickSatA = COLOR_SETTING.stickColorA.sat + random(-20, 20);
  let stickBriA = COLOR_SETTING.stickColorA.bri + random(-20, 20);

  let stickHueB = processHue(COLOR_SETTING.stickColorB.hue + random(-20, 20));
  let stickSatB = COLOR_SETTING.stickColorB.sat + random(-20, 20);
  let stickBriB = COLOR_SETTING.stickColorB.bri + random(-20, 20);

  // let colorRandom = random();
  // if (colorRandom < 0.06) {
  //   satA = 0;
  //   satB = 0;

  //   subSatA = 0;
  //   subSatB = 0;

  //   stickSatA = 0;
  //   stickSatB = 0;

  //   briA = random(80, 100);
  //   briB = random(80, 100);

  //   subBriA = random(10, 60);
  //   subBriB = random(10, 60);

  //   stickBriA = random(10, 60);
  //   stickBriB = random(80, 100);
  // }
  // else if (colorRandom < 0.16) {
  //   satA = random(80, 100);
  //   satB = random(80, 100);

  //   subSatA = random(80, 100);
  //   subSatB = random(80, 100);

  //   stickSatA = random(80, 100);
  //   stickSatB = random(80, 100);

  //   briA = random(80, 100);
  //   briB = random(80, 100);

  //   subBriA = random(80, 100);
  //   subBriB = random(80, 100);

  //   stickBriA = random(80, 100);
  //   stickBriB = random(80, 100);
  // }

  let colorA = new NYColor(hueA, satA, briA);
  let colorB = new NYColor(hueB, satB, briB);

  let subColorA = new NYColor(subHueA, subSatA, subBriA);
  let subColorB = new NYColor(subHueB, subSatB, subBriB);

  let stickColorA = new NYColor(stickHueA, stickSatA, stickBriA);
  let stickColorB = new NYColor(stickHueB, stickSatB, stickBriB);

  let flowerColor = {
    colorA: colorA,
    colorB: colorB,
    subColorA: subColorA,
    subColorB: subColorB,
    stickColorA: stickColorA,
    stickColorB: stickColorB,
    normalColor: COLOR_SETTING.normalColor
  };


  let baseX = _x;
  let baseY = _y;

  let pointCount = int(random(80, 120));
  let pointDatas = [];

  let openAngle = random(20, 100);
  let nowEdgeRadius = _size * 0.5;

  // generate points first
  // a circle around Y axis
  for (let i = 0; i < pointCount; i++) {
    let t = i / pointCount;
    let nowCircularAngle = t * 360;

    let triangleTheta = 90 - (openAngle / 2);
    let sideLength = cos(radians(triangleTheta)) * nowEdgeRadius;
    let yLength = sin(radians(triangleTheta)) * nowEdgeRadius;

    let nowX = sin(radians(nowCircularAngle)) * sideLength;
    let nowY = yLength;
    let nowZ = -cos(radians(nowCircularAngle)) * sideLength;

    // calculate normal
    let rightDirVector = { x: -1.0, y: 0.0, z: 0.0 };
    rightDirVector = rotatePoint3D(rightDirVector, -nowCircularAngle, 0, 0);

    let toPointDir = normalizeVector({ x: nowX, y: nowY, z: nowZ });
    let normalDir = crossProduct(rightDirVector, toPointDir);

    let normalX = nowX + normalDir.x * 20;
    let normalY = nowY + normalDir.y * 20;
    let normalZ = nowZ + normalDir.z * 20;

    pointDatas.push({
      position: { x: nowX, y: nowY, z: nowZ },
      normalPoint: { x: normalX, y: normalY, z: normalZ },
      pointAngleT: t
    });
  }

  let rotX = random(-60, 60);
  let rotY = random(-30, 70);

  // rotate points and attach to base point
  for (let i = 0; i < pointDatas.length; i++) {
    let nowPoint = pointDatas[i];

    nowPoint.position = rotatePoint3D(nowPoint.position, rotX, rotY, 0);
    nowPoint.normalPoint = rotatePoint3D(nowPoint.normalPoint, rotX, rotY, 0);

    nowPoint.position.x = baseX + nowPoint.position.x;
    nowPoint.position.y = baseY - nowPoint.position.y;

    nowPoint.normalPoint.x = baseX + nowPoint.normalPoint.x;
    nowPoint.normalPoint.y = baseY - nowPoint.normalPoint.y;
  }

  await drawPoints({ x: baseX, y: baseY, z: 0 }, pointDatas, flowerColor);
}

async function drawPoints(_basePoint, _points, _flowerC) {

  let DoDrawNormal = random() < 0.5;

  // draw stick
  let stickLength = dist(_basePoint.x, _basePoint.y, _basePoint.x, height);
  let stickPoints = stickLength * random(0.2, 0.6);

  for (let i = 0; i < stickPoints; i++) {
    let t = i / (stickPoints - 1);
    let nowColor = NYColor.lerpRGB(_flowerC.stickColorA, _flowerC.stickColorB, t);

    nowColor.bri *= lerp(1.5, 0.2, t);

    let nowX = _basePoint.x;
    let nowY = lerp(_basePoint.y, height, t);

    noFill();
    stroke(nowColor.color());
    strokeWeight(1);

    circle(nowX, nowY, 3);
  }

  stroke('red');
  fill('yellow');
  circle(_basePoint.x, _basePoint.y, 6);

  // sort z
  _points.sort((a, b) => a.position.z - b.position.z);
  for (let i = 0; i < _points.length; i++) {
    let t = _points[i].pointAngleT;

    let pointPos = _points[i].position;
    let normalPos = _points[i].normalPoint;

    let pointNormalDir = { x: normalPos.x - pointPos.x, y: normalPos.y - pointPos.y, z: normalPos.z - pointPos.z };
    pointNormalDir = normalizeVector(pointNormalDir);

    let cameraVec = { x: 0, y: 0, z: -1 };

    let dotValue = dotProduct(pointNormalDir, cameraVec);
    // console.log(dotValue);

    // draw normal first if it's behind
    if (normalPos.z < pointPos.z && DoDrawNormal) {
      stroke(_flowerC.normalColor.color());
      strokeWeight(1);
      noFill();
      circle(normalPos.x, normalPos.y, 3);
    }

    if (dotValue < 0) {
      let nowColor = NYColor.lerpRGB(_flowerC.subColorA, _flowerC.subColorB, sin(t * PI));
      stroke(nowColor.color());
    }
    else {
      let nowColor = NYColor.lerpRGB(_flowerC.colorA, _flowerC.colorB, sin(t * PI));
      stroke(nowColor.color());
    }
    strokeWeight(1);
    noFill();

    line(_basePoint.x, _basePoint.y, pointPos.x, pointPos.y);

    let flowerEdgeHue = processHue(_flowerC.colorA.hue + lerp(-90, 90, sin(t * PI)));
    stroke(flowerEdgeHue, _flowerC.colorA.sat, _flowerC.colorA.bri);
    circle(pointPos.x, pointPos.y, 2);

    // draw normal point if it's in front
    if (normalPos.z > pointPos.z && DoDrawNormal) {
      stroke(_flowerC.normalColor.color());
      strokeWeight(1);
      noFill();
      circle(normalPos.x, normalPos.y, 3);
    }
  }
}

async function drawLeafSide(_x, _y, _radius, _startAngle, _angleRange, _colorA, _colorB) {
  let pointCount = int(random(12, 37));
  let strokeDensity = 0.2;

  let strokeLayerCount = _radius * strokeDensity;

  let leafRadiusNoise = new CircluarNoiseSystem();
  leafRadiusNoise.noiseScaleX = 0.003;
  leafRadiusNoise.noiseScaleY = 0.003;

  let leafPoints = [];

  noFill();
  stroke('yellow');
  circle(_x, _y, 10);

  let startSideAngle = 30;
  let sideAngleRange = 60;

  for (let i = 0; i < pointCount; i++) {
    let t = i / pointCount;
    let nowCircularAngle = t * 360;

    let nowBaseRadius = _radius;

    let circularNoiseValue = leafRadiusNoise.getNoise(nowCircularAngle, nowBaseRadius);

    let nowSideLength = _radius * LEAF_BASE_RATIO + _radius * LEAF_NOISE_RATIO * circularNoiseValue;


    leafPoints.push({ 'length': nowSideLength, 'angle': nowCircularAngle });
  }

  // for (let layerIndex = 0; layerIndex < strokeLayerCount; layerIndex++) {
  //   let layerT = layerIndex / (strokeLayerCount - 1);
  //   let nowLayerColor = NYColor.lerpRGB(_colorA, _colorB, layerT);

  //   leafPoints[layerIndex] = [];

  //   for (let i = 0; i < pointCount; i++) {
  //     let t = i / pointCount;

  //     let nowGrowDir = _startAngle + sin(radians(t * 360 - 90)) * 0.5 * _angleRange;
  //     let nowBaseRadius = _radius * layerT;

  //     let circularAngle = t * 360;
  //     let radiusNoiseValue = leafRadiusNoise.getNoise(circularAngle, nowBaseRadius);

  //     let nowRadius = nowBaseRadius * LEAF_BASE_RATIO + nowBaseRadius * LEAF_NOISE_RATIO * radiusNoiseValue;

  //     let nowX = _x + sin(radians(nowGrowDir)) * nowRadius;
  //     let nowY = _y - cos(radians(nowGrowDir)) * nowRadius;

  //     leafPoints[layerIndex].push({ x: nowX, y: nowY, angle: nowGrowDir, sideLength: nowRadius });
  //   }
  // }
}

async function drawLeafFront(_x, _y, _radius, _colorA, _colorB) {
  let pointCount = int(random(12, 37));
  let strokeDensity = 0.2;

  let strokeLayerCount = _radius * strokeDensity;

  let leafRadiusNoise = new CircluarNoiseSystem();
  leafRadiusNoise.noiseScaleX = 0.003;
  leafRadiusNoise.noiseScaleY = 0.003;

  for (let layerIndex = 0; layerIndex < strokeLayerCount; layerIndex++) {

    let layerT = layerIndex / (strokeLayerCount - 1);
    let nowLayerColor = NYColor.lerpRGB(_colorA, _colorB, layerT);

    let circlePoints = [];
    for (let i = 0; i < pointCount; i++) {
      let t = i / pointCount;

      let nowAngle = t * 360;
      let nowBaseRadius = _radius * layerT;

      let noiseValue = leafRadiusNoise.getNoise(nowAngle, nowBaseRadius);

      let nowRadius = (_radius * 0.2 + noiseValue * _radius * 0.8) * layerT;

      let nowX = _x + sin(radians(nowAngle)) * nowRadius;
      let nowY = _y - cos(radians(nowAngle)) * nowRadius;

      // stroke('red');
      // circle(nowX, nowY, 3);
      circlePoints.push({ x: nowX, y: nowY, angle: nowAngle });
    }

    for (let i = 0; i < circlePoints.length; i++) {
      let fromIndex = i;
      let toIndex = (i + 1) % circlePoints.length;

      let fromP = circlePoints[fromIndex];
      let toP = circlePoints[toIndex];

      NOW_STROKE_COLOR = nowLayerColor.copy();
      if (random() < 0.1) {
        NOW_STROKE_COLOR.hue = processHue(NOW_STROKE_COLOR.hue - 80);
      }

      if (random() < 0.03) {
        NOW_STROKE_COLOR.bri = 30;
      }
      NOW_STROKE_COLOR.slightRandomize(20, 20, 20);

      let nowBaseRadius = _radius * layerT;
      drawLeafEdge(_x, _y, fromP.angle, toP.angle, nowBaseRadius, leafRadiusNoise);
    }
    await sleep(1);
  }
}

async function drawLeafEdge(_centerX, _centerY, _fromAngle, _toAngle, _nowRadius, _noiseSystem) {
  let dotDensity = 0.4;
  let edgeLength = _nowRadius * 2 * PI * NYGetAngleDiff(_fromAngle, _toAngle) / 360;
  let dotCount = int(edgeLength * dotDensity);
  dotCount = max(dotCount, 10);

  for (let i = 0; i < dotCount; i++) {
    let t = i / (dotCount - 1);

    let nowAngle = NYLerpAngle(_fromAngle, _toAngle, t);

    let xDirAdd = sin(radians(nowAngle));
    let yDirAdd = -cos(radians(nowAngle));

    let baseX = _centerX + xDirAdd * _nowRadius;
    let baseY = _centerY - yDirAdd * _nowRadius;

    let noiseValue = _noiseSystem.getNoise(nowAngle, _nowRadius);

    let nowX = _centerX + xDirAdd * _nowRadius * LEAF_BASE_RATIO + xDirAdd * _nowRadius * LEAF_NOISE_RATIO * noiseValue;
    let nowY = _centerY + yDirAdd * _nowRadius * LEAF_BASE_RATIO + yDirAdd * _nowRadius * LEAF_NOISE_RATIO * noiseValue;
    // let nowX = baseX;
    // let nowY = baseY;
    stroke('blue');
    // point(nowX, nowY);
    strokeBrush(nowX, nowY, nowAngle);
  }
}

async function drawLeaf(_x, _y, _growAngle, _colorA, _colorB) {
  let walkers = [];
  let walkerCount = 36;

  let leafPointDensity = 0.3;

  let totalSteps = 100;

  // circular tings
  let leafRadiusNoise = new CircluarNoiseSystem();
  leafRadiusNoise.noiseScaleX = 0.012;
  leafRadiusNoise.noiseScaleY = 0.012;

  for (let i = 0; i < walkerCount; i++) {
    let t = i / (walkerCount - 1);

    let leafRadiusNoiseValue = leafRadiusNoise.getNoise(t * 360);
    // let nowLeafLength = 100 + 200 * leafRadiusNoiseValue;
    let nowLeafLength = 200;

    // make it feels perspective
    // let slopeMultiplier = 1.0 - (sin(radians(t * 180)) * 0.9);
    // nowLeafLength *= slopeMultiplier;

    // front facing
    let nowStartAngle = t * 360;

    // side facing
    // let nowStartAngle = _growAngle + sin(radians(t * 360)) * 80;

    let newWalker = new WalkPoint(_x, _y, nowStartAngle);
    newWalker.stepLength = nowLeafLength / totalSteps;
    walkers.push(newWalker);
  }


  // for (let s = 0; s < totalSteps; s++) {
  //   let stepT = s / (totalSteps - 1);

  //   // this returns the color
  //   let nowColor = NYLerpColorRGB(_colorA, _colorB, stepT);
  //   stroke(nowColor);

  //   for (let i = 0; i < walkerCount; i++) {
  //     walkers[i].step();
  //     walkers[i].draw();
  //   }

  //   // draw points
  //   // for(let i=0; i< walkerCount-1; i++)
  //   // {
  //   //   drawLineFromTwoAnglePoints(walkers[i].x, walkers[i].y, walkers[i].angle, walkers[i+1].x, walkers[i+1].y, walkers[i+1].angle);
  //   // }
  //   await sleep(1);
  // }
}

function drawLineFromTwoAnglePoints(_x1, _y1, _angle1, _x2, _y2, _angle2) {
  let strokeCount = int(dist(_x1, _y1, _x2, _y2) * STROKE_DENSITY);

  for (let i = 0; i < strokeCount; i++) {
    let t = i / (strokeCount - 1);

    let nowX = lerp(_x1, _x2, t);
    let nowY = lerp(_y1, _y2, t);
    let nowAngle = lerp(_angle1, _angle2, t);

    let stepLength = 1;
    nowX += sin(radians(nowAngle)) * stepLength;
    nowY -= cos(radians(nowAngle)) * stepLength;

    strokeBrush(nowX, nowY, nowAngle);
  }
}

function strokeBrush(_x, _y, _angle = 0) {
  push();
  translate(_x, _y);
  rotate(radians(_angle));

  let nowStrokeColor = NOW_STROKE_COLOR.copy();
  nowStrokeColor.slightRandomize();
  // if(random() < 0.06)
  // {
  //   nowStrokeColor.hue = processHue(nowStrokeColor.hue - 60);
  // }
  stroke(nowStrokeColor.color());
  strokeWeight(BRUSH_THICKNESS);
  line(0, -0.5 * BRUSH_LENGTH, 0, 0.5 * BRUSH_LENGTH);
  pop();
}

function keyPressed() {
  if (key == 's' || key == 'S') {
    saveCanvas('flowers', 'png');
  }
}

// async sleep
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}