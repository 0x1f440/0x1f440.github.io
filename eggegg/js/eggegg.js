var faceR;
var faceG;
var faceB;
var faceColor;

/* 몸통 */
var albumen = new Path({
    segments: [[30,40], [150,0], [220,0], [300,70], [320,120], [300,180], [280,240], [200,300], [60,290], [30,250], [-20,180], [0,130]],
    closed: true
});

albumen.style = {
  fillColor: '#fcfcfc',
  strokeColor: '#efefef',
  strokeWidth: 5
};

albumen.smooth({
  type: 'catmull-rom',
  factor: 0.4
});

var vitellus = new Shape.Circle([150,150], 76);
vitellus.style = {
  fillColor: '#ffd500',
  strokeColor: '#ffcc00',
  strokeWidth: 5
};

var egg_body = new Group ([albumen, vitellus]);

/* 눈 */
var sclera = new Shape.Ellipse({
  center: [0, 0],
  radius: [30, 38],
  fillColor: 'white',
  strokeColor: '#efe3e8',
  strokeWidth: 4
});

var iris = new Shape.Circle({
  center: [10, 0],
  radius: 15,
  fillColor: '#661fb4',
  strokeColor: '#220a3c',
  strokeWidth: 4
});

var pupil = new Shape.Circle({
  center: [10, 0],
  radius: 9,
  fillColor: '#220a3c',
});

var highlight = new Shape.Circle({
  center: [15, -8],
  radius: 3,
  fillColor: 'white'
});

var eye = new Group([sclera, iris, pupil, highlight]);
eye.position = [143,150];

var eye_l = eye.clone();
eye.position.x += 50;

var eyes = new Group([eye, eye_l]);


/* 팔 */
var arm_origin = new Point(15, 0);
var arm_joint = new Point(25, 70);
var arm_end = new Point(0, 140);

var arm_path = new Path({
    segments: [arm_origin, arm_joint, arm_end],
    closed: false,
    strokeColor: '#222',
    strokeWidth: 20,
});

arm_path.smooth({
  type: 'continuous'
});
arm_path.strokeCap = 'round';

var arm = new Group([arm_path]);
arm.position.y =+ 250;
var arm_l = arm.clone();
arm_l.position.x -= 20;
arm_l.children[0].pivot = arm_l.children[0].segments[0].point;
arm_l.rotate(20);

var arm_r = arm.clone();
arm_r.position.x += 310;
arm_r.position.y -= 80;
arm_r.children[0].pivot = arm_r.children[0].segments[0].point;
arm_r.rotate(50);

arm.visible = false;

var arms = new Group([arm_l, arm_r]);


/* 다리 */
var leg_origin = new Point(0, 0);
var leg_joint = new Point(10, 40);
var leg_end = new Point(0, 80);
var leg_path = new Path(leg_origin, leg_joint, leg_end);

var socksColor = new Gradient({
    stops: [['#222', 0.15], ['white', 0.15], ['white', 0.25], ['#661fb4', 0.25],
    ['#661fb4', 0.35], ['white', 0.35], ['white', 0.4], ['#661fb4', 0.4], ['#661fb4', 0.5],['white', 0.5]],
    origin: leg_joint,
    destination: leg_end
});
var socks = new Color(socksColor, leg_joint, leg_end);

leg_path.strokeColor = socks;
leg_path.strokeWidth = 25;
leg_path.smooth({
  type: 'continuous'
});

var shoes = new Path({
  segments : [[0,5], [30,5], [25,17], [50,17], [55,35], [0,35]],
  closed: true,

  fillColor: '#692c21',
  strokeColor: '#56241b',
  strokeWidth: 3
});

shoes.smooth({
    type: 'continuous',
    from: 2,
    to: 4
});
shoes.rotate(20);
shoes.position.x -= 15;
shoes.position.y += 70;

var leg = new Group([leg_path, shoes]);
leg.position.x =+ 150;
leg.position.y =+ 350;

var leg_l = leg.clone();
leg_l.position.x -= 40;
leg_l.position.y -= 5;

var leg_r = leg.clone();
leg_r.position.x += 60;
leg_r.rotate(-20);

leg.visible = false;

var legs = new Group([leg_l, leg_r]);

var egg = new Group([legs, arms, egg_body, eyes]);
egg.applyMatrix = false;
egg.scale(0.5);


egg.position = view.center;


egg.children[2].children[0].style = {
  fillColor: 'white',
  strokeColor: '#ffcc00',
  strokeWidth: 5
};


var egg0 = egg.clone();
egg0.children[1].visible = false;
egg0.children[0].visible = false;
egg0.scale(0.3);

var egg1 = egg.clone();
egg1.position.x += 220;
egg1.children[1].children[1].position.x -= 10;
egg1.children[0].position.y -= 20;
egg1.children[1].children[1].rotate(-70);
egg1.children[1].children[1].position.y += 10;
egg1.children[1].children[0].rotate(180);
egg1.children[1].children[0].position.y -= 70;

//arms
egg1.children[1].children[0].strokeColor = '#ffd500';
egg1.children[1].children[1].strokeColor = '#ffd500';
egg1.children[1].children[0].rotate(50);

//legs
egg1.children[0].children[0].children[0].strokeColor = '#ffd500';
egg1.children[0].children[1].children[0].strokeColor = '#ffd500';

//shoes
egg1.children[0].children[0].children[1].style = {
  strokeColor : "blue",
  fillColor : "blue"
};
egg1.children[0].children[1].children[1].style = {
  strokeColor : "blue",
  fillColor : "blue"
};

//face
egg1.children[2].children[1].style = {
  strokeColor : "blue",
  fillColor : "blue"
};

//eyes
egg1.children[3].children[0].children[1].style = {
  strokeColor : "blue",
  strokeWidth : 3,
  fillColor : "blue"
};

egg1.children[3].children[1].children[1].style = {
  strokeColor : "blue",
  strokeWidth : 3,
  fillColor : "blue"
};

var egg2 = egg.clone();
egg2.position.x -= 220;

//eyes
egg2.children[3].children[0].children[1].style = {
  strokeColor : "black",
  strokeWidth : 3,
  fillColor : "black"
};

//shoes
egg2.children[0].children[0].children[1].style = {
  strokeColor : "black",
  fillColor : "black"
};
egg2.children[0].children[1].children[1].style = {
  strokeColor : "black",
  fillColor : "black"
};

//face
egg2.children[2].children[1].style = {
  strokeColor : "black",
  fillColor : "black"
};

//arms
egg2.children[1].children[0].rotate(-70);
egg2.children[1].children[0].position.y -= 60;

//legs
egg2.children[0].children[0].rotate(20);
egg2.children[0].children[1].rotate(-10);
egg2.children[0].children[1].position.y -= 10;


egg2.children[2].children[0].rotate(-30);

egg2.children[3].children[0].position.x -= 30;
egg2.children[3].children[1].position.x -= 36;
egg2.children[3].children[0].rotate(180);
egg2.children[3].children[1].rotate(180);

egg2.children[3].children[1].children[1].style = {
  strokeColor : "black",
  strokeWidth : 3,
  fillColor : "black"
};

var egg3 = egg.clone();
egg3.position.x -= 220;
egg3.position.y += 220;

egg3.children[0].children[0].rotate(50);
egg3.children[0].children[0].position.x -= 150;
egg3.children[0].children[0].position.y -= 100;

egg3.children[0].children[1].rotate(-10);
egg3.children[0].children[1].position.x += 50;
egg3.children[0].children[1].position.y -= 10;
//arms
egg3.children[1].children[0].position.x += 30;
egg3.children[1].children[0].position.y += 60;
var egg4 = egg.clone();
egg4.position.y += 220;

//face
egg4.children[2].children[1].style = {
  strokeColor : "#ffd500",
  fillColor : "blue"
};
egg4.children[2].children[0].rotate(50);

var egg5 = egg.clone();
egg5.position.x += 220;
egg5.position.y += 220;
//face
egg5.children[2].children[1].scale(1.4);
egg5.children[2].children[1].style = {
  strokeColor : "#802bdb",
  fillColor : "#802bdb"
};
egg5.rotate(-10);

//eyes
egg5.children[3].children[0].children[1].position.x -= 5;
egg5.children[3].children[1].children[1].position.x -= 5;

egg5.children[2].children[0].rotate(20);

var egg6 = egg.clone();
egg6.position.x -= 220;
egg6.position.y -= 220;

//arms
egg6.children[1].children[1].rotate(-70);
egg6.children[1].children[1].position.y += 10;
egg6.children[1].children[0].rotate(180);
egg6.children[1].children[0].position.y -= 70;

//face
egg6.children[2].children[1].opacity = 0;
egg6.children[2].children[0].style = {
  fillColor: '#ffd500',
  strokeColor: '#ffcc00',
  strokeWidth: 5
};
egg6.children[2].children[0].rotate(-70);

var egg7 = egg.clone();
egg7.position.y -= 220;

//legs
egg7.children[0].children[0].rotate(20);
egg7.children[0].children[1].rotate(-10);
egg7.children[0].children[1].position.y -= 10;


egg7.children[3].children[0].position.x -= 30;
egg7.children[3].children[1].position.x -= 36;
egg7.children[3].children[0].rotate(180);
egg7.children[3].children[1].rotate(180);
egg7.children[2].children[0].rotate(-20);
egg7.rotate(-10);

egg7.children[2].style = {
  fillColor: 'magenta',
  strokeColor: 'magenta',
  strokeWidth: 5
};

egg7.children[1].style = {
  strokeColor: 'magenta',
  strokeWidth: 35
};
egg7.children[0].style = {
  strokeColor: 'magenta',
  strokeWidth: 35
};
var egg8 = egg.clone();
egg8.position.x += 220;
egg8.position.y -= 220;


egg8.children[0].children[0].rotate(50);
egg8.children[0].children[0].position.x -= 50;
egg8.children[0].children[0].position.y -= 10;

egg8.children[0].children[1].rotate(-10);
egg8.children[0].children[1].position.x += 50;
egg8.children[0].children[1].position.y -= 10;
function onMouseDown(event) {
  var eggs = egg0.clone();
}
/*
[legs, arms, egg_body, eyes]

 egg6   egg7   egg8
(0,0)  (0,1)  (0,2)

 egg2   egg    egg1
(1,0)  (1,1)  (1,2)

 egg3   egg4   egg5
(2,0)  (2,1)  (2,2)
*/

function onMouseMove(event){
faceColor = new Color(faceR, faceG, faceB);
faceR = map(event.point.x, 0, view.viewSize.width -20, 1, 1);
faceG = map(event.point.x, 0, view.viewSize.width -20, 1, 0.9);
faceB = map(event.point.x, 0, view.viewSize.width -20, 1, 0.2);

egg.children[3].children[1].children[1].position.x = map(event.point.x, 0, 1150, 135, 150);
egg.children[3].children[1].children[2].position.x = map(event.point.x, 0, 1150, 135, 150);
egg.children[3].children[1].children[3].position.x = map(event.point.x, 0, 1150, 135, 150);
egg.children[3].children[0].children[1].position.x = map(event.point.x, 0, 1150, 185, 200);
egg.children[3].children[0].children[2].position.x = map(event.point.x, 0, 1150, 185, 200);
egg.children[3].children[0].children[3].position.x = map(event.point.x, 0, 1150, 185, 200);

egg0.children[2].children[0].style.fillColor = faceColor;


egg0.position = event.point;
egg1.scaling = map(event.point.x, 0, 1150, 0.2, 0.5);

egg0.children[2].children[0].rotate(
    map(event.point.x, 0, 1150, 0, 5));

egg8.children[2].children[0].style.fillColor = faceColor;

egg3.opacity = Math.random();

egg5.rotate(2);
}

function onKeyDown(event){
    randomColor = new Color(Math.random(),Math.random(),Math.random());
    console.log(event);

    if(event.key =='d'){
        egg.position.x += 10;
        egg7.rotate(5);
    }

    if(event.key =='a'){
        egg.position.x -= 10;
        egg7.rotate(-5);
    }

    if(event.key =='w'){
        egg.position.y -= 10;
        egg7.rotate(-5);
        egg2.scale(1.01);
        egg3.opacity += 0.05;

        egg7.children[2].style = {
          fillColor: randomColor,
          strokeColor: randomColor,
          strokeWidth: 5
        };

        egg7.children[1].style = {
          strokeColor: randomColor,
          strokeWidth: 35
        };

        egg7.children[0].style = {
          strokeColor: randomColor,
          strokeWidth: 35
        };
    }

    if(event.key =='s'){
        egg.position.y += 10;
        egg7.rotate(-5);
        egg2.scale(0.99);
        egg3.opacity -= 0.05;
    }
}

function onFrame(){
  randomColor = new Color(Math.random(),Math.random(),Math.random());
  egg4.children[2].children[1].style.fillColor = randomColor;

  egg6.children[2].children[0].rotate(1);
}

function map(value, start1, stop1, start2, stop2) {
    return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}
