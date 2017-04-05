/**
 * Get a random floating point number between `min` and `max`.
 */
function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}
/**
 * Get a random integer between `min` and `max`.
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

var preload = $('#preload');
var count = 7; // number of images

for(var i = 1; i <= count; i++) {
    preload.append('<img src="img/cat (' + i + ').png" style="width:1px; height:1px;">');
}

function onMouseDown(event) {
  var cat = 'img/cat (' + getRandomInt(1, 7) + ').png';
  var raster = new Raster(cat, event.point);
  raster
  raster.scale(getRandom(0.3, 0.8));
}

var paw = new Raster('img/meow.gif');
paw.scale(0.05);
function onMouseMove(event){
  paw.position = event.point;
}
