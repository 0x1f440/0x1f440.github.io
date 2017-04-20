var keycount = 0;
var clickcount = 0;
var mouse_clone_group = new Group();
var mouse_clone;
var faceR;
var faceG;
var faceB;
var faceColor;
var bgR;
var bgG;
var bgB;
var bgColor;

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
egg.scale(0.4);


egg.position = view.center;


egg.children[2].children[0].style = {
  fillColor: 'white',
  strokeColor: '#ffcc00',
  strokeWidth: 5
};


var egg_mouse = egg.clone();
egg_mouse.children[1].visible = false;
egg_mouse.children[0].visible = false;
egg_mouse.scale(0.3);

var egg_gloomy = egg.clone();
egg_gloomy.children[1].children[1].position.x -= 10;
egg_gloomy.children[0].position.y -= 20;
egg_gloomy.children[1].children[1].rotate(-70);
egg_gloomy.children[1].children[1].position.y += 10;
egg_gloomy.children[1].children[0].rotate(180);
egg_gloomy.children[1].children[0].position.y -= 70;

//arms
egg_gloomy.children[1].children[0].strokeColor = '#ffd500';
egg_gloomy.children[1].children[1].strokeColor = '#ffd500';
egg_gloomy.children[1].children[0].rotate(50);

//legs
egg_gloomy.children[0].children[0].children[0].strokeColor = '#ffd500';
egg_gloomy.children[0].children[1].children[0].strokeColor = '#ffd500';

//shoes
egg_gloomy.children[0].children[0].children[1].style = {
  strokeColor : "blue",
  fillColor : "blue"
};
egg_gloomy.children[0].children[1].children[1].style = {
  strokeColor : "blue",
  fillColor : "blue"
};

//face
egg_gloomy.children[2].children[1].style = {
  strokeColor : "blue",
  fillColor : "blue"
};

//eyes
egg_gloomy.children[3].children[0].children[1].style = {
  strokeColor : "blue",
  strokeWidth : 3,
  fillColor : "blue"
};

egg_gloomy.children[3].children[1].children[1].style = {
  strokeColor : "blue",
  strokeWidth : 3,
  fillColor : "blue"
};

var egg_blacky = egg.clone();

//eyes
egg_blacky.children[3].children[0].children[1].style = {
  strokeColor : "black",
  strokeWidth : 3,
  fillColor : "black"
};

//shoes
egg_blacky.children[0].children[0].children[1].style = {
  strokeColor : "black",
  fillColor : "black"
};
egg_blacky.children[0].children[1].children[1].style = {
  strokeColor : "black",
  fillColor : "black"
};

//face
egg_blacky.children[2].children[1].style = {
  strokeColor : "black",
  fillColor : "black"
};

//arms
egg_blacky.children[1].children[0].rotate(-70);
egg_blacky.children[1].children[0].position.y -= 60;

//legs
egg_blacky.children[0].children[0].rotate(20);
egg_blacky.children[0].children[1].rotate(-10);
egg_blacky.children[0].children[1].position.y -= 10;


egg_blacky.children[2].children[0].rotate(-30);

egg_blacky.children[3].children[0].position.x -= 30;
egg_blacky.children[3].children[1].position.x -= 36;
egg_blacky.children[3].children[0].rotate(180);
egg_blacky.children[3].children[1].rotate(180);

egg_blacky.children[3].children[1].children[1].style = {
  strokeColor : "black",
  strokeWidth : 3,
  fillColor : "black"
};

var egg_ghost = egg.clone();
egg_ghost.children[0].children[0].rotate(50);
egg_ghost.children[0].children[0].position.x -= 150;
egg_ghost.children[0].children[0].position.y -= 100;

egg_ghost.children[0].children[1].rotate(-10);
egg_ghost.children[0].children[1].position.x += 50;
egg_ghost.children[0].children[1].position.y -= 10;
//arms
egg_ghost.children[1].children[0].position.x += 30;
egg_ghost.children[1].children[0].position.y += 60;

var egg_crazy = egg.clone();
//face
egg_crazy.children[2].children[1].style = {
  strokeColor : "#ffd500",
  fillColor : "blue"
};
egg_crazy.children[2].children[0].rotate(50);

var egg_roller = egg.clone();
//face
egg_roller.children[2].children[1].scale(1.4);
egg_roller.children[2].children[1].style = {
  strokeColor : "#802bdb",
  fillColor : "#802bdb"
};
egg_roller.rotate(-10);

//eyes
egg_roller.children[3].children[0].children[1].position.x -= 5;
egg_roller.children[3].children[1].children[1].position.x -= 5;

egg_roller.children[2].children[0].rotate(20);

var egg_rollingface = egg.clone();

//arms
egg_rollingface.children[1].children[1].rotate(-70);
egg_rollingface.children[1].children[1].position.y += 10;
egg_rollingface.children[1].children[0].rotate(180);
egg_rollingface.children[1].children[0].position.y -= 70;

//face
egg_rollingface.children[2].children[1].opacity = 0;
egg_rollingface.children[2].children[0].style = {
  fillColor: '#ffd500',
  strokeColor: '#ffcc00',
  strokeWidth: 5
};
egg_rollingface.children[2].children[0].rotate(-70);

var egg_rainbowface = egg.clone();
//legs
egg_rainbowface.children[0].children[0].rotate(20);
egg_rainbowface.children[0].children[1].rotate(-10);
egg_rainbowface.children[0].children[1].position.y -= 10;


egg_rainbowface.children[3].children[0].position.x -= 30;
egg_rainbowface.children[3].children[1].position.x -= 36;
egg_rainbowface.children[3].children[0].rotate(180);
egg_rainbowface.children[3].children[1].rotate(180);
egg_rainbowface.children[2].children[0].rotate(-20);
egg_rainbowface.rotate(-10);

egg_rainbowface.children[2].style = {
  fillColor: 'magenta',
  strokeColor: 'magenta',
  strokeWidth: 5
};

egg_rainbowface.children[1].style = {
  strokeColor: 'magenta',
  strokeWidth: 35
};
egg_rainbowface.children[0].style = {
  strokeColor: 'magenta',
  strokeWidth: 35
};
var egg_yellowface = egg.clone();
egg_yellowface.children[0].children[0].rotate(50);
egg_yellowface.children[0].children[0].position.x -= 50;
egg_yellowface.children[0].children[0].position.y -= 10;

egg_yellowface.children[0].children[1].rotate(-10);
egg_yellowface.children[0].children[1].position.x += 50;
egg_yellowface.children[0].children[1].position.y -= 10;

egg.bringToFront();

var text = new PointText(new Point(100, 100));
text.fontFamily = 'Bangers';
text.fontSize = 40;
text.fillColor = "#00fbcf";
text.content = "Use wasd to move."

/* 배경 */
var background = new Shape.Rectangle({
  point: [0, 0],
  size: [view.size.width, view.size.height]
});
background.sendToBack();

var egg_names = ["gloomy", "blacky", "ghost", "crazy", "roller", "rollingface", "rainbowface", "yellowface"];

function onMouseDown() {
  clickcount+=1;
  text.fillColor = "#00fbcf";
  if(clickcount == 1){
    if(keycount > 0){
      text.content = "Woooow, you are very submissive to me.";
      logcount += 1;
    }else{
      text.content = "Oh... I was going to tell you\nabout that tiny egg.";
    }
  }else if(clickcount == 10) {
    text.content = "You really like tiny eggs!";
  }else if(clickcount == 15) {
    text.content = "Did you know?\nActually, tiny eggs are your clone...";
  }
  mouse_clone = egg_mouse.clone();
}


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

egg_mouse.children[2].children[0].style.fillColor = faceColor;

egg_mouse.position = event.point;
egg_gloomy.scaling = map(event.point.x, 0, 1150, 0.2, 0.5);

egg_mouse.children[2].children[0].rotate(
    map(event.point.x, 0, 1150, 0, 5));

egg_yellowface.children[2].children[0].style.fillColor = faceColor;

egg_ghost.opacity = Math.random();

egg_roller.rotate(2);
}
var firstconvo = false;

var gloomy = 0;
var blacky = 0;
var ghost = 0;
var crazy = 0;
var roller = 0;
var rollingface = 0;
var rainbowface = 0;
var yellowface = 0;

function conversation(event) {
  if (event.key =='e'){
    if(egg.position.x<egg_gloomy.position.x+100 && egg.position.x>egg_gloomy.position.x-100 &&
      egg.position.y<egg_gloomy.position.y+150 && egg.position.y>egg_gloomy.position.y-150){
      gloomy += 1;
      text.fillColor = "#51c4ff";
        if(gloomy == 1){
          text.content = "Just leave me alone.";
        }
        else if(gloomy == 2){
          text.content = "No, I was kidding!\nDon't leave me alone! plaese!";
        }
        else if(gloomy > 2){
          text.content = "Why......";
        }
      }
      else if(egg.position.x<egg_blacky.position.x+100 && egg.position.x>egg_blacky.position.x-100 &&
              egg.position.y<egg_blacky.position.y+150 && egg.position.y>egg_blacky.position.y-150){
        blacky += 1;
        text.fillColor = "black";
        if(blacky == 1){
          text.content = "Oh, my name is Blacky!";
        }
        else if(blacky == 2){
          text.content = "That's why my life is so black";
        }
        else if(blacky > 2){
          text.content = "Black means GREAT!";
        }
      }
      else if(egg.position.x<egg_ghost.position.x+100 && egg.position.x>egg_ghost.position.x-100 &&
              egg.position.y<egg_ghost.position.y+150 && egg.position.y>egg_ghost.position.y-150){
        ghost += 1;
        text.fillColor = "white";
        text.fillColor.alpha = 0.2;
        if(ghost == 1){
          text.content = "Can you see me?";
        }
        else if(ghost == 2){
          text.content = "When you go higher, my body gets more visibility.";
        }
        else if(ghost > 2){
          text.content = "I don't want disappear, \nSo plaese more...";
        }
      }
      else if(egg.position.x<egg_crazy.position.x+100 && egg.position.x>egg_crazy.position.x-100 &&
          egg.position.y<egg_crazy.position.y+150 && egg.position.y>egg_crazy.position.y-150){
        crazy += 1;
        text.fillColor = randomColor;
        text.strokeColor = black;
        if(crazy == 1){
        text.content = "HAHAHAHAHAHAAHHAHAHAHAHAHA";
        }
        else if(crazy == 2){
        text.content = "HAHAHAHAHAH";
        }
        else if(crazy > 2){
        text.content = "HA.";
        }
      }
      else if(egg.position.x<egg_roller.position.x+100 && egg.position.x>egg_roller.position.x-100 &&
              egg.position.y<egg_roller.position.y+150 && egg.position.y>egg_roller.position.y-150){
        roller += 1;
        text.fillColor = "#ffc0cb";
        if(roller == 1){
        text.content = "Move your mouse!";
        }
        else if(roller == 2){
        text.content = "YAYYYYYY!!";
        }
        else if(roller > 2){
        text.content = "SEE ME ROLLING";
        }
      }
      else if(egg.position.x<egg_rollingface.position.x+100 && egg.position.x>egg_rollingface.position.x-100 &&
              egg.position.y<egg_rollingface.position.y+150 && egg.position.y>egg_rollingface.position.y-150){
        text.fillColor = "white";
        rollingface += 1;
        if(rollingface == 1){
        text.content = "Why.";
        }
        else if(rollingface == 2){
        text.content = "Do you want fight?";
        }
        else if(rollingface > 2){
        text.content = "Go away.";
        }
      }
      else if(egg.position.x<egg_rainbowface.position.x+100 && egg.position.x>egg_rainbowface.position.x-100 &&
              egg.position.y<egg_rainbowface.position.y+150 && egg.position.y>egg_rainbowface.position.y-150){
        rainbowface += 1;
        text.fillColor = randomColor;
        if(rainbowface == 1){
        text.content = "R A I N B O W ~";
        }
        else if(rainbowface == 2){
        text.content = "I think I can be more crazy~";
        }
        else if(rainbowface > 2){
        text.content = "~ W O B N I A R";
        }
      }
      else if(egg.position.x<egg_yellowface.position.x+100 && egg.position.x>egg_yellowface.position.x-100 &&
              egg.position.y<egg_yellowface.position.y+150 && egg.position.y>egg_yellowface.position.y-150){
        yellowface += 1;
        text.fillColor = "#ffe351";
        if(yellowface == 1){
        text.content = "Yellow...?";
        }
        else if(yellowface == 2){
        text.content = "White...?";
        }
        else if(yellowface > 2){
        text.content = "Hey, Are you changing my face color?";
        }
      }
    }
    else{
      if(egg.position.x<egg_gloomy.position.x+100 && egg.position.x>egg_gloomy.position.x-100 &&
        egg.position.y<egg_gloomy.position.y+150 && egg.position.y>egg_gloomy.position.y-150){
        text.fillColor = "#51c4ff";
        text.content = "Oh... I'm so sad...";
        firstconvo = true;
      }
      else if(egg.position.x<egg_blacky.position.x+100 && egg.position.x>egg_blacky.position.x-100 &&
              egg.position.y<egg_blacky.position.y+150 && egg.position.y>egg_blacky.position.y-150){
        text.fillColor = "black";
        text.content = "Life is so Black!";
        firstconvo = true;
      }
      else if(egg.position.x<egg_ghost.position.x+100 && egg.position.x>egg_ghost.position.x-100 &&
              egg.position.y<egg_ghost.position.y+150 && egg.position.y>egg_ghost.position.y-150){
        text.fillColor = "white";
        text.fillColor.alpha = 0.2;
        text.content = "...";
        firstconvo = true;
      }
      else if(egg.position.x<egg_crazy.position.x+100 && egg.position.x>egg_crazy.position.x-100 &&
            egg.position.y<egg_crazy.position.y+150 && egg.position.y>egg_crazy.position.y-150){
        text.fillColor = randomColor;
        text.content = "I'm crazy. Call me Crazy.";
        firstconvo = true;
      }
      else if(egg.position.x<egg_roller.position.x+100 && egg.position.x>egg_roller.position.x-100 &&
              egg.position.y<egg_roller.position.y+150 && egg.position.y>egg_roller.position.y-150){
        text.fillColor = "#ffc0cb";
        text.content = "Heh......";
        firstconvo = true;
      }
      else if(egg.position.x<egg_rollingface.position.x+100 && egg.position.x>egg_rollingface.position.x-100 &&
              egg.position.y<egg_rollingface.position.y+150 && egg.position.y>egg_rollingface.position.y-150){
        text.fillColor = "white";
        text.content = "My face...";
        firstconvo = true;
      }
      else if(egg.position.x<egg_rainbowface.position.x+100 && egg.position.x>egg_rainbowface.position.x-100 &&
              egg.position.y<egg_rainbowface.position.y+150 && egg.position.y>egg_rainbowface.position.y-150){
          text.fillColor = randomColor;
          text.content = "Go Up!!!!!!!!";
          firstconvo = true;
      }
      else if(egg.position.x<egg_yellowface.position.x+100 && egg.position.x>egg_yellowface.position.x-100 &&
            egg.position.y<egg_yellowface.position.y+150 && egg.position.y>egg_yellowface.position.y-150){
          text.fillColor = "#ffe351";
          text.content = "White... Yellow... White...";
          firstconvo = true;
      }
    }
}
var logcount = 0;
function onKeyDown(event){
  keycount += 1;

  if(event.key =='w'||event.key =='a'||event.key =='s'||event.key =='d') {
    text.fillColor = "#00fbcf";
    if(logcount == 0){
      if(keycount > 0){
        if(clickcount > 0 && logcount == 0){
          text.content = "Hey, why did you get tiny egg\nwithout my advise?";
          logcount += 1;
        }
        else {
          text.content = "Well done!\nClick somewhere to get tiny egg.";
          if(clickcount != 0){
            logcount += 1;
          }
        }
      }
    }
    else {
      text.content = "Meet other eggs!";
    }
  }
    randomColor = new Color(Math.random(),Math.random(),Math.random());

    if(event.key =='d'){
      if(egg_yellowface.position.x+view.viewSize.width/2 < egg.position.x){
        text.content = "End of Eggs.";
      }

      for(i=0; i<egg_names.length; i++) {
        var eggname = "egg_" + egg_names[i];
        var eggs = eval(eggname);
        eggs.position.x -= 10;
      }
        egg_rainbowface.rotate(5);
    }


    if(event.key =='a'){

      if(egg_gloomy.position.x > view.viewSize.width){
        text.content = "Oh, well...\nI think there will be nothing.";
      }
      if(egg_gloomy.position.x > view.viewSize.width*1.5){
        text.content = "What are you doing?";
      }
      if(egg_gloomy.position.x > view.viewSize.width*2){
        text.content = "You are wasting your time.";
      }
      for(i=0; i<egg_names.length; i++) {
        var eggname = "egg_" + egg_names[i];
        var eggs = eval(eggname);
        eggs.position.x += 10;
      }
        egg_rainbowface.rotate(-5);
    }

    if(event.key =='w'){
        egg.position.y -= 10;
        egg_rainbowface.rotate(-5);
        egg_blacky.scale(1.01);
        egg_ghost.opacity += 0.05;

        egg_rainbowface.children[2].style = {
          fillColor: randomColor,
          strokeColor: randomColor,
          strokeWidth: 5
        };

        egg_rainbowface.children[1].style = {
          strokeColor: randomColor,
          strokeWidth: 35
        };

        egg_rainbowface.children[0].style = {
          strokeColor: randomColor,
          strokeWidth: 35
        };
    }

    if(event.key =='s'){
        egg.position.y += 10;
        egg_rainbowface.rotate(-5);
        egg_blacky.scale(0.99);
        egg_ghost.opacity -= 0.05;
    }
    conversation(event);
}

function onFrame(){
  randomColor = new Color(Math.random(),Math.random(),Math.random());
  egg_crazy.children[2].children[1].style.fillColor = randomColor;

  egg_rollingface.children[2].children[0].rotate(1);
}

var fontSize;

function positionEggs(){

  egg.position = view.center;
  egg_gloomy.position = view.center;
  egg_blacky.position = view.center;
  egg_ghost.position = view.center;
  egg_crazy.position = view.center;
  egg_roller.position = view.center;
  egg_rollingface.position = view.center;
  egg_rainbowface.position = view.center;
  egg_yellowface.position = view.center;

  for(i=0; i<egg_names.length; i++) {
    var eggname = "egg_" + egg_names[i];
    var eggs = eval(eggname);
    eggs.position.x += (i+1)*300;
  }
}

var resizecount = 0;

bgColor = new Color(bgR, bgG, bgB);
bgR = map(view.viewSize.width, 0, 1800, 0.22, 0.52);
bgG = map(view.viewSize.width, 0, 1800, 0, 0.16);
bgB = map(view.viewSize.width, 0, 1800, 0.55, 0.85);

function onResize(){
  bgColor = new Color(bgR, bgG, bgB);
  bgR = map(view.viewSize.width, 0, 1800, 0.22, 0.52);
  bgG = map(view.viewSize.width, 0, 1800, 0, 0.16);
  bgB = map(view.viewSize.width, 0, 1800, 0.55, 0.85);

  fontSize = map(view.viewSize.width, 0, 1800, 20, 40);

  text.fontSize = fontSize;

  if(resizecount>1){
  text.content = "You resized!";
  text.fillColor = "#00fbcf";
  }

  resizecount += 1;

  background.position = view.center;
  background.size = [view.viewSize.width,view.viewSize.height];
  console.log(view.size.width);
  background.fillColor = bgColor;

  var canvasWrapper = document.getElementsByTagName("BODY")[0];
  var canvas = document.getElementById("myCanvas");
  canvas.style.width = canvasWrapper.style.width;

  egg.scaling = map(view.bounds.width, 0, 2000, 0.3, 0.6);
  for(i=0; i<egg_names.length; i++) {
    var eggname = "egg_" + egg_names[i];
    var eggs = eval(eggname);
    eggs.scaling = map(view.bounds.width, 0, 2000, 0.3, 0.6);
   }
  positionEggs();
}

function map(value, start1, stop1, start2, stop2) {
    return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}
