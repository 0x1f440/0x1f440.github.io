var clickCount = 4;

// kynd.info 2014

function Ball(r, p, v) {
	this.radius = r;
	this.point = p;
	this.vector = v;
	this.maxVec = 15;
	this.numSegment = Math.floor(r / 3 + 2);
	this.boundOffset = [];
	this.boundOffsetBuff = [];
	this.sidePoints = [];
	this.path = new Path({
		fillColor: {
			//hue: Math.random() * 360,
			hue: 1,
			saturation: 0,
			brightness: 1
		},
		blendMode: 'color-dodge'
	});

	for (var i = 0; i < this.numSegment; i ++) {
		this.boundOffset.push(this.radius);
		this.boundOffsetBuff.push(this.radius);
		this.path.add(new Point());
		this.sidePoints.push(new Point({
			angle: 360 / this.numSegment * i,
			length: 1
		}));
	}
}

Ball.prototype = {
	iterate: function() {
		this.checkBorders();//경계를 확인해서 넘어가면 반대쪽으로 오도록 함
		if (this.vector.length > this.maxVec)
			this.vector.length = this.maxVec;
		this.point += this.vector;
		this.updateShape();
	},

	checkBorders: function() {
		var size = view.size;
		if (this.point.x < -this.radius)
			this.point.x = size.width + this.radius;
		if (this.point.x > size.width + this.radius)
			this.point.x = -this.radius;
		if (this.point.y < -this.radius)
			this.point.y = size.height + this.radius;
		if (this.point.y > size.height + this.radius)
			this.point.y = -this.radius;
	},

	updateShape: function() {
		var segments = this.path.segments;
		for (var i = 0; i < this.numSegment; i ++)
			segments[i].point = this.getSidePoint(i);

		this.path.smooth();
		for (var i = 0; i < this.numSegment; i ++) {
			if (this.boundOffset[i] < this.radius / 4)
				this.boundOffset[i] = this.radius / 4;
			var next = (i + 1) % this.numSegment;
			var prev = (i > 0) ? i - 1 : this.numSegment - 1;
			var offset = this.boundOffset[i];
			offset += (this.radius - offset) / 15;
			offset += ((this.boundOffset[next] + this.boundOffset[prev]) / 2 - offset) / 3;
			this.boundOffsetBuff[i] = this.boundOffset[i] = offset;
		}
	},

	react: function(b) {
		var dist = this.point.getDistance(b.point);
		if (dist < this.radius + b.radius && dist != 0) {
			var overlap = this.radius + b.radius - dist;
			var direc = (this.point - b.point).normalize(overlap * 0.015);
			this.vector += direc;
			b.vector -= direc;

			this.calcBounds(b);
			b.calcBounds(this);
			this.updateBounds();
			b.updateBounds();
		}
	},

	getBoundOffset: function(b) {
		var diff = this.point - b;
		var angle = (diff.angle + 180) % 360;
		return this.boundOffset[Math.floor(angle / 360 * this.boundOffset.length)];
	},

	calcBounds: function(b) {
		for (var i = 0; i < this.numSegment; i ++) {
			var tp = this.getSidePoint(i);
			var bLen = b.getBoundOffset(tp);
			var td = tp.getDistance(b.point);
			if (td < bLen) {
				this.boundOffsetBuff[i] -= (bLen  - td) / 2;
			}
		}
	},

	getSidePoint: function(index) {
		return this.point + this.sidePoints[index] * this.boundOffset[index];
	},

	updateBounds: function() {
		for (var i = 0; i < this.numSegment; i ++)
			this.boundOffset[i] = this.boundOffsetBuff[i];
	}
};


//--------------------- main ---------------------

var balls = [];


var scale = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
var rasters = [];

function setType(){
	if(points[0].x > (width/2)){
		if(points[0].y > (height/2)){
			typecounter = 0;
		}else{
			typecounter = 1;
		}
	}else{
		if(points[0].y > (height/2)){
			typecounter = 2;
		}else{
			typecounter = 3;
		}
	}
}

function map(value, low1, high1, low2, high2) {
		return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

//클릭 팩터
function onMouseDown(event){
		if(!started){
			rasters[rasters.length] = new Raster({
					source: 'img/note.svg',
					position: event.point
			});

			count = points.length;


			points[count] = new Point(event.point);

			switch (count) {
				case 0:
					setType();
					document.getElementById("factor").innerHTML += "<div>" + types[typecounter] + "</div>"
					break;

				case 1:
					bpmMade = map(event.point.x+event.point.y, 0, width+height, 60, 200);
					bpmMade = Math.round(bpmMade);
					console.log(bpmMade);
					document.getElementById("factor").innerHTML += "<div>" + bpmMade + " bpm</div>"
					break;

				case 2:
				// get randomly generated key and mode
					_root = _roots[Math.floor(Math.random() * _roots.length)];

					if(event.point.x < width/2){
						_mode = _modes[0];//major
					}
					else {
						_mode = _modes[1];
					}
					document.getElementById("factor").innerHTML += "<div>" + _root.replace(/b$/g, "♭") +" "+ _mode + "</div>"
					console.log(_mode);
					break;

				case 3:
					seed = seed + event.point.x.toString() + event.point.y.toString();
					seed = seed.replace(".","");
					started = true;
					document.getElementById("factor").innerHTML += "<div>" + seed + "</div>"
					break;

				default:
					break;
			}

			var octave = scale[Math.floor(Math.random() * scale.length)]+'3';



			var end = clickCount - count - 1;


			if(end > 0){
				document.getElementById("load").innerHTML = "아무 곳이나 "+end +"번 클릭해서 작곡";
			}
			else {
				document.getElementById("load").innerHTML ="작곡하기";
				document.getElementById("load").disabled = false;
				document.getElementById("load").style.backgroundColor = '#444';
			}

			var clickSynth = new Tone.PolySynth(6, Tone.SimpleSynth).toMaster();

			clickSynth.set({ //클릭할 때 소리가 나옴
			  oscillator: {
			    type: types[typecounter]
			  },
			  envelope: {
			    attack: 0.05,
			    decay: 0.1,
			    sustain: 0.3,
			    release: 1
			  }
			});

			clickSynth.triggerAttackRelease(octave, undefined, 0.2);
	}



}


document.getElementById("load").addEventListener("click", function(e) {
		for(i = 0; i < points.length; i++){
			console.log(points[i]);
			var position = points[i];
			var vector = new Point({
				angle: 360 * Math.random(),
				length: Math.random() * 10
			});
			var radius = Math.random() * 60 + 60;

			balls.push(new Ball(radius, position, vector));
  	}
});




function onFrame() {
	for (var i = 0; i < balls.length - 1; i++) {
		for (var j = i + 1; j < balls.length; j++) {
			balls[i].react(balls[j]);
		}
	}
	for (var i = 0, l = balls.length; i < l; i++) {
		balls[i].iterate();
	}
}



function onResize(){
  var canvasWrapper = document.getElementsByTagName("BODY")[0];
  var canvas = document.getElementById("myCanvas");
  canvas.style.width = canvasWrapper.style.width;
}
