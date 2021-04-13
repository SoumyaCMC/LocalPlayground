var cursorX;
var cursorY;
var w = document.body.clientWidth;
var h = document.body.clientHeight;
var stage = document.querySelector('[data-el="stage"]');
var head = document.querySelector('[data-el="head"]');
var letters = head.querySelectorAll('[data-el="letter"]');
var blocks = [];
var borders = [];
var bouncer = document.querySelector('[data-el="bouncer"]');
var bouncerRadius = bouncer.clientWidth * 0.5;
var bouncerClone;
var bubbles = [];
var categories = {
  catMouse: 0x0002,
  catBody: 0x0004
}


initDim = {
  w: document.body.clientWidth,
  h: document.body.clientHeight
};

// ______________________________ Matter.js module aliases
var Engine = Matter.Engine,
    World = Matter.World,
    Body = Matter.Body,
    Bodies = Matter.Bodies,
    Render = Matter.Render,
    Constraint = Matter.Constraint,
    Mouse = Matter.Mouse,
    MouseConstraint = Matter.MouseConstraint;



// ______________________________ canvas element to draw into
var canvas = document.createElement('canvas'),
    context = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 600;


// ______________________________ Matter engine
var engine = Engine.create(  {  enableSleeping: false  });
    engine.world.wireframes = false;
    engine.world.gravity.x = 0;
    engine.world.gravity.y = 0.25;



var renderer = Render.create({
  element: stage,
  canvas: canvas,
  context: context,
  engine: engine,
  options: {
    bounds: true,
    showBounds: true,
    background: "transparent",
    width: w,
    height: h,
    wireframes: false
  }
});

var initBubbles = function(){
  if(!letters || letters.length == 0) return;
  var bubbleContainer = document.querySelector('[data-el="bubbles"]');
  for(var i = 0; i < letters.length; i++) {
    var bubble = document.createElement('div');
    bubble.classList.add('bubble');
    bubble.dataset.active = 'false';
    bubbleContainer.appendChild( bubble );
    bubbles.push( bubble );
  }
}

// var animateBubble = function( x, y ){

//   function animate(el, x, y){
//     el.dataset.active = 'true';
//     TweenMax.set(el, {
//       x: x,
//       y: y
//     })
//     TweenMax.fromTo(el, 0.4, {
//       opacity: 1,
//       scaleX: 0,
//       scaleY: 0
//     }, {
//       opacity: 0,
//       scaleX: 1,
//       scaleY: 1,
//       ease: Power3.easeOut,
//       onComplete: function(){
//         el.style = '';
//         el.dataset.active = 'false';
//       }
//     })
//   };

//   for(var i = 0; i < bubbles.length; i++) {
//     if( bubbles[i].dataset.active == 'false'){
//       animate(bubbles[i], x, y);
//       break;
//     }
//   }

// }

Matter.Events.on(engine, 'collisionStart', function(event) {

    var pairs = event.pairs;

    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i];
        if( pair.bodyA.isStatic || pair.bodyB.isStatic ) return;
        animateBubble(
          pair.bodyA.position.x + (pair.bodyA.position.x - pair.bodyB.position.x) * -0.5,
          pair.bodyA.position.y + (pair.bodyA.position.y - pair.bodyB.position.y) * -0.5
        );
    }
})

var updatePosition = function(){

  requestAnimationFrame(updatePosition);

  for(var i = 0; i < letters.length; i++) {
    TweenLite.set( letters[i], {
      x: blocks[i].position.x - letters[i].clientWidth*0.5 + 'px',
      y: blocks[i].position.y - letters[i].clientWidth*0.5 + 'px',
      rotation: blocks[i].angle + 'rad'
    });
  }

  // TweenLite.set( bouncer, {
  //   x: bouncerClone.position.x - bouncer.clientWidth*0.5 + 'px',
  //   y: bouncerClone.position.y - bouncer.clientHeight*0.5 + 'px',
  //   rotation: bouncerClone.angle + 'rad'
  // });
}



// ______________________________ util
var updateCanvas = function(){
  var diffX = document.body.clientWidth - w;
  var diffY = document.body.clientHeight - h;

  w = document.body.clientWidth;
  h = document.body.clientHeight;

  renderer.options.width = w;
  renderer.options.height = h;
  renderer.canvas.width = w;
  renderer.canvas.height = h;

  engine.world.bounds.max.x = window.width;
  engine.world.bounds.max.y = window.height;
};


var initMouse = function (array){
  var mouse = Matter.Mouse.create(canvas);
  var mouseConstraint = MouseConstraint.create(engine, { mouse: mouse });
  mouseConstraint.constraint.stiffness = 1;
  World.add(engine.world, mouseConstraint);
  Matter.Events.on(mouseConstraint, 'startdrag', removeInfo);
  mouseConstraint.collisionFilter.mask = 0x0002 | categories.catMouse;

  // catBody category objects should not be draggable with the mouse
}

// helpful function
// src > http://stackoverflow.com/a/35093569
var initEscapedBodiesRetrieval = function(allBodies, startCoordinates) {

    function hasBodyEscaped(body) {
        var x = body.position.x;
        var y = body.position.y;

        return x < 0 || x > w || y < 0 || y > h;
    }

    setInterval(function() {
        var i, body;

        for (i = 0; i < allBodies.length; i++) {
            body = allBodies[i];
            if (hasBodyEscaped(body)) {

              Matter.Body.setVelocity(body, {
                x: 0,
                y: 0
              });

              Matter.Body.translate(body, {
                x: ( startCoordinates.x - body.position.x ),
                y: ( startCoordinates.y - body.position.y )
              });
            }
        }
    }, 300);
}

// ______________________________ create centered block
var fixBouncer = function(){
  bouncer.style.position = 'absolute';
  bouncer.style.top = '0';
  bouncer.style.left = '0';
  bouncer.style.marginTop = '0';

  updatePosition();
};

var removeInfo = function(){
  bouncer.classList.add('infoOut');
};

var initBouncer = function(){

  bouncerClone = Bodies.circle(
    bouncer.offsetLeft + bouncerRadius,
    bouncer.offsetTop + bouncerRadius,
    bouncerRadius, {
    isSleeping: false,
    density: 0.08,
    collisionFilter: {
        category: categories.catMouse
    },
    render: {
        opacity: 0
    }
  });

  World.add(engine.world, bouncerClone );
  Matter.Events.on(engine.world, "afterAdd", fixBouncer);
}


var fixLetters = function(){
  head.style.position = 'absolute';
  head.style.top = '0';
  head.style.left = '0';

  for(var i = 0; i < letters.length; i++) {
    letters[i].style.position = 'absolute';
    letters[i].style.top = '0';
    letters[i].style.left = '0';
  }
};

var initLetterClones = function(){
    
  for(var i = 0; i < letters.length; i++) {
    blocks.push(
      Bodies.rectangle(
          head.offsetLeft + letters[i].offsetLeft + letters[i].clientWidth*0.5,
          head.offsetTop + letters[i].offsetTop + letters[i].clientHeight*0.5,
          letters[i].clientWidth,
          letters[i].clientHeight, {
            isSleeping: false,
            density: 1,
            restitution: 0.5,
            frictionAir: 0,
            collisionFilter: {
              category: categories.catMouse
            },
            render: {
              opacity: 0
            }
          })
        );
    Body.scale(blocks[i],1,2.5);
    Body.setCentre(blocks[i],{x:blocks[i].position.x + 18,y:blocks[i].position.y + letters[i].clientHeight/2 +18},false);
    World.add(engine.world, blocks[i]);

    letters[i].style.width = letters[i].clientWidth + 'px';
    letters[i].style.height = letters[i].clientHeight + 'px';
  }
}



// walls/borders
var initBorders = function(){
  var borderOptions = { isStatic: true, render: { opacity: 0 }};
  var offset = 5;
  borders.push(Bodies.rectangle( w*0.5, offset, w, 10, borderOptions )); // top
  borders.push(Bodies.rectangle( w - offset, h*0.5, 2, h, borderOptions ));
  borders.push(Bodies.rectangle( w*0.5, h - 10 , w, 8, borderOptions )); // bottom
  borders.push(Bodies.rectangle( offset, h*0.5, 2, h, borderOptions ));

  for(var i = 0; i < borders.length; i++){
      World.add(engine.world, borders[i]);
  }

};

var updateBorders = function() {
  for(var i = 0; i < borders.length; i++){
      World.remove(engine.world, borders[i]);
  }
  borders = [];
  initBorders();
}



var init = function(){
  initBubbles();
  initLetterClones();
    initMouse(blocks);
    initBouncer();
    initEscapedBodiesRetrieval(blocks, { x: w*0.5, y: h*0.5 });
    fixLetters();
  
  initBorders();
  Engine.run(engine);
  Render.run(renderer);
}


// ======================= H E L P E R S  /  U T I L S

window.addEventListener('resize', resizeHandler);

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

var resizeHandler = debounce(function() {
  updateCanvas();
  updateBorders();
}, 250);


// ______________________________ Helpers
function randArb(min, max) {
    return Math.random() * (max - min) + min;
}
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

console.log(letters[1]);

// ______________________________ F I R E
init();