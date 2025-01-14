function NYLerpHue(_hueA, _hueB, _t) {
  let hueA = _hueA;
  let hueB = _hueB;

  let hueDiff = abs(hueB - hueA);

  if (abs((hueB - 360) - hueA) < hueDiff) {
    hueB -= 360;
  }
  else if (abs((hueB + 360) - hueA) < hueDiff) {
    hueB += 360;
  }
  else {
    return lerp(_hueA, _hueB, _t);
  }

  let resultHue = lerp(hueA, hueB, _t);

  if (resultHue < 0) {
    resultHue += 360;
  }
  else if (resultHue > 360) {
    resultHue -= 360;
  }

  return resultHue;
}

function NYLerpColor(_colorA, _colorB, _t) {
  let _hue = NYLerpHue(_colorA.h, _colorB.h, _t);
  let _sat = lerp(_colorA.s, _colorB.s, _t);
  let _bri = lerp(_colorA.b, _colorB.b, _t);
  let _alpha = lerp(_colorA.a, _colorB.a, _t);

  return new NYColor(_hue, _sat, _bri, _alpha);
}

function NYLerpColorRGB(_colorA, _colorB, _t) {
  push();
  colorMode(HSB);
  let colorA = _colorA.color();
  let colorB = _colorB.color();
  colorMode(RGB);
  let resultColor = lerpColor(colorA, colorB, _t);
  colorMode(HSB);
  pop();

  return resultColor;
}

function NYLerpP5Color(_colorA, _colorB, _t) {
  let hueA = hue(_colorA);
  let hueB = hue(_colorB);

  let hueDiff = abs(hueB - hueA);

  if (abs((hueB - 360) - hueA) < hueDiff) {
    hueB -= 360;
  }
  else if (abs((hueB + 360) - hueA) < hueDiff) {
    hueB += 360;
  }
  else {
    return lerpColor(_colorA, _colorB, _t);
  }

  let satA = saturation(_colorA);
  let briA = brightness(_colorA);
  let alphaA = alpha(_colorA);

  let satB = saturation(_colorB);
  let briB = brightness(_colorB);
  let alphaB = alpha(_colorB);

  let resultHue = lerp(hueA, hueB, _t);
  let resultSat = lerp(satA, satB, _t);
  let resultBri = lerp(briA, briB, _t);
  let resultAlpha = lerp(alphaA, alphaB, _t);

  if (resultHue < 0) {
    resultHue += 360;
  }
  else if (resultHue > 360) {
    resultHue -= 360;
  }

  return color(resultHue, resultSat, resultBri, resultAlpha);
}

function hsbToRgb(_hue, _sat, _bri) {

  // Ensure that the input values are within the valid range
  let inputHue = processHue(_hue);
  let inputSat = Math.max(0, Math.min(100, _sat));
  let inputBri = Math.max(0, Math.min(100, _bri));

  // Convert saturation and brightness to values between 0 and 1
  inputSat /= 100;
  inputBri /= 100;

  // Calculate the chroma (color intensity)
  const chroma = inputSat * inputBri;

  // Calculate the hue sector
  const hueSector = inputHue / 60;

  // Calculate intermediate values
  const x = chroma * (1 - Math.abs((hueSector % 2) - 1));
  const m = inputBri - chroma;

  let r, g, b;

  // Determine the RGB values based on the hue sector
  if (0 <= hueSector && hueSector < 1) {
    r = chroma;
    g = x;
    b = 0;
  } else if (1 <= hueSector && hueSector < 2) {
    r = x;
    g = chroma;
    b = 0;
  } else if (2 <= hueSector && hueSector < 3) {
    r = 0;
    g = chroma;
    b = x;
  } else if (3 <= hueSector && hueSector < 4) {
    r = 0;
    g = x;
    b = chroma;
  } else if (4 <= hueSector && hueSector < 5) {
    r = x;
    g = 0;
    b = chroma;
  } else {
    r = chroma;
    g = 0;
    b = x;
  }

  // Adjust the RGB values by adding the m (brightness minus chroma)
  r = (r + m) * 255;
  g = (g + m) * 255;
  b = (b + m) * 255;

  // Ensure the RGB values are within the valid range (0 - 255)
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));

  return {
    r: Math.round(r),
    g: Math.round(g),
    b: Math.round(b),
  };
}

function rgbToHsb(_r, _g, _b) {
  // Ensure that the input values are within the valid range
  let r = Math.max(0, Math.min(255, _r));
  let g = Math.max(0, Math.min(255, _g));
  let b = Math.max(0, Math.min(255, _b));

  // Convert the RGB values to values between 0 and 1
  r /= 255;
  g /= 255;
  b /= 255;

  // Determine the maximum and minimum values of the RGB values
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  // Calculate the chroma (color intensity)
  const chroma = max - min;

  // Calculate the hue
  let hue;
  if (chroma === 0) {
    hue = 0;
  } else if (max === r) {
    hue = 60 * (((g - b) / chroma) % 6);
  } else if (max === g) {
    hue = 60 * (((b - r) / chroma) + 2);
  } else {
    hue = 60 * (((r - g) / chroma) + 4);
  }

  // Ensure the hue is within the valid range (0 - 359)
  hue = (hue + 360) % 360;

  // Calculate the brightness
  const brightness = max;

  // Calculate the saturation
  const saturation = brightness === 0 ? 0 : chroma / brightness;

  return {
    h: hue,
    s: saturation * 100,
    b: brightness * 100,
  };
}

function lchToRgb(lightness, chroma, hue) {
  // Ensure that the input values are within the valid range
  lightness = Math.max(0, Math.min(100, lightness));
  chroma = Math.max(0, Math.min(132, chroma));
  hue = (hue % 360 + 360) % 360; // Ensure hue is within the range 0-359

  // Convert chroma and lightness to values between 0 and 1
  chroma /= 132;
  lightness /= 100;

  // Calculate the angle in radians for the hue
  const hueRadians = (hue / 360) * (2 * Math.PI);

  // Calculate the intermediate values
  const x = chroma * Math.cos(hueRadians);
  const y = chroma * Math.sin(hueRadians);

  // Calculate the temporary values
  const temp1 = lightness * 2 - 1;
  const temp2 = chroma * (1 - Math.abs(2 * lightness - 1));

  // Calculate the RGB values
  let r, g, b;

  if (hue >= 0 && hue < 120) {
    r = temp2;
    g = temp1;
    b = 0;
  } else if (hue >= 120 && hue < 240) {
    r = 0;
    g = temp2;
    b = temp1;
  } else {
    r = temp1;
    g = 0;
    b = temp2;
  }

  // Adjust the RGB values
  r = (r + chroma) * 255;
  g = (g + chroma) * 255;
  b = (b + chroma) * 255;

  // Ensure the RGB values are within the valid range (0 - 255)
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));

  return {
    r: Math.round(r),
    g: Math.round(g),
    b: Math.round(b),
  };
}

function processHue(_hue) {
  let result = (_hue % 360 + 360) % 360;
  return result;
}

function processAngle(_angle) {
  let result = (_angle % 360 + 360) % 360;
  return result;
}

// get angle between two points and return in degrees
function getAngle(_x1, _y1, _x2, _y2) {
  let xDiff = _x2 - _x1;
  let yDiff = _y2 - _y1;
  return atan2(yDiff, xDiff) * 180 / PI + 90;
}

function NYGetAngleDiff(_from, _to) {
  let angleA = _from;
  let angleB = _to;

  let angleDiff = abs(_to - _from);

  if (abs((_to - 360) - _from) < angleDiff) {
    angleB -= 360;
  }
  else if (abs((_to + 360) - _from) < angleDiff) {
    angleB += 360;
  }

  return abs(angleB - angleA);
}

function NYLerpAngle(_from, _to, _t) {
  let angleA = _from;
  let angleB = _to;

  let angleDiff = abs(_to - _from);

  if (abs((_to - 360) - _from) < angleDiff) {
    angleB -= 360;
  }
  else if (abs((_to + 360) - _from) < angleDiff) {
    angleB += 360;
  }
  else {
    return lerp(_from, _to, _t);
  }

  let resultAngle = lerp(angleA, angleB, _t);
  return processAngle(resultAngle);
}

function rotatePoint(_x, _y, _centerX, _centerY, _angle) {
  let fromAngle = getAngle(_centerX, _centerY, _x, _y);
  let distance = dist(_centerX, _centerY, _x, _y);

  let newAngle = fromAngle + _angle;

  let newX = _centerX + sin(radians(newAngle)) * distance;
  let newY = _centerY - cos(radians(newAngle)) * distance;

  return { x: newX, y: newY };
}

function rotatePoint3D(_point, pitch, roll, yaw) {
  let cosa = cos(radians(yaw));
  let sina = sin(radians(yaw));

  let cosb = cos(radians(pitch));
  let sinb = sin(radians(pitch));

  let cosc = cos(radians(roll));
  let sinc = sin(radians(roll));

  let Axx = cosa * cosb;
  let Axy = cosa * sinb * sinc - sina * cosc;
  let Axz = cosa * sinb * cosc + sina * sinc;

  let Ayx = sina * cosb;
  let Ayy = sina * sinb * sinc + cosa * cosc;
  let Ayz = sina * sinb * cosc - cosa * sinc;

  let Azx = -sinb;
  let Azy = cosb * sinc;
  let Azz = cosb * cosc;

  let px = _point.x;
  let py = _point.y;
  let pz = _point.z;

  let newX = Axx * px + Axy * py + Axz * pz;
  let newY = Ayx * px + Ayy * py + Ayz * pz;
  let newZ = Azx * px + Azy * py + Azz * pz;

  return { x: newX, y: newY, z: newZ };
}

function crossProduct(vectorA, vectorB) {
  return {
      x: vectorA.y * vectorB.z - vectorA.z * vectorB.y,
      y: vectorA.z * vectorB.x - vectorA.x * vectorB.z,
      z: vectorA.x * vectorB.y - vectorA.y * vectorB.x
  };
}

function dotProduct(vectorA, vectorB) {
  return (vectorA.x * vectorB.x + vectorA.y * vectorB.y + vectorA.z * vectorB.z);
}

function vectorMagnitude(vectorPoint) {
  return Math.sqrt(vectorPoint.x * vectorPoint.x + vectorPoint.y * vectorPoint.y + vectorPoint.z * vectorPoint.z);
}

function normalizeVector(vectorPoint) {
  let vecLength = vectorMagnitude(vectorPoint);
  
  // prevent division by zero error
  if (vecLength === 0) {
      throw new Error('Zero-length vector cannot be normalized');
  }

  return {
      x: vectorPoint.x / vecLength,
      y: vectorPoint.y / vecLength,
      z: vectorPoint.z / vecLength
  }
}

function optionOverride(_default, _override) {
  let result = _default;
  let keys = Object.keys(_override);

  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    result[key] = _override[key];
  }
}

function checkIsMobile() {
  let check = false;
  (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
}