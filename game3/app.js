/*Title: Fractions Game
Author: Viren Pathre (Resolute Education)
Date:22/7/22*/
// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    World = Matter.World,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    Constraint = Matter.Constraint,
    Events = Matter.Events,
    Bounds = Matter.Bounds,
    Collision = Matter.Collision;

// constants
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

// create an engine
var engine = Engine.create();

engine.gravity.y = 0.5;

// create a world
var world = engine.world;

// Add bounds
var boundary = Bounds.create({
    x: 0,
    y: 0
})

// create a renderer
var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        wireframes: false,
        background: '#a3c5d3'
    }
});

render.canvas.height = ctx.height;
render.canvas.width = ctx.width;

/////////////////////////////////////////////////////////////////////////
///////////////////////////// ADD VARIABLES HERE ////////////////////////
/////////////////////////////////////////////////////////////////////////

var answer_collision;
var protagonist;
var slingshot; // slingshot variable
var mouse = Mouse.create(render.canvas);
var sling = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 0.2,
        render: {
            visible: false
        }
    }
});

/////////////////////////////////////////////////////////////////////////
//////////////////////// MAIN FUNCTIONALITY HERE ////////////////////////
/////////////////////////////////////////////////////////////////////////

function elements() {
    var temp = [];
    var obstacle_array = [];
    var antagonist_array = [];
    var ob_arr_len = 10; // number of levels (100)

    // IMMOVABLE OBJECTS
    var platform = new Rectangle(100, 535, 10, 100, {
        isStatic: true
    });
    var ground = new Rectangle(400, 835, 1000, 500, {
        isStatic: true
    });

    var top = new Rectangle(400, -250, 1000, 500, {
        isStatic: true
    });
    var left = new Rectangle(-500, 300, 1000, 1000, {
        isStatic: true
    });
    var right = new Rectangle(1250, 300, 1000, 1000, {
        isStatic: true
    });

    // PROTAGONIST
    protagonist = new Circle(100, 200, 15, false, {
        restitution: 0.5
    });

    // randomizer for selecting the circle for the answer
    const lim = 3;
    var rand = rand_interval(0, lim);

    for (let i = 0; i < lim + 1; i++) {
        curr_x = rand_interval(300, 600);
        curr_y = rand_interval(100, 535);
        curr_w = rand_interval(10, 200);
        curr_h = rand_interval(10, 100);
        curr_r = rand_interval(10, 30);
        var flag;

        if (i == rand) {
            flag = true;
        } else {
            flag = false;
        }

        // ANTAGONISTS
        antagonist_array.push(new Circle(curr_x, curr_y - (curr_h / 2) - curr_r - 10, curr_r, flag, {
            isStatic: false,
            restitution: 0.8,
            friction: 0
        }, {
            render: {
                fillStyle: '#00FF33'
            }
        }));

        obstacle_array.push(new Rectangle(curr_x, curr_y, curr_w, curr_h, {
            isStatic: true,
            restitution: 0.8,
            friction: 0,
            render: {
                fillStyle: "black",
                strokeStyle: "red",
                text: { //////////////////////// PLS CHANGE IT //////////////////////
                    content: 'pp',
                    color: "yellow",
                    size: 25
                }
            }
        }));
    }

    // loops till object collides with the "answer" circle
    answer_collision = Collision.create(protagonist, antagonist_array.find(item => item.flag === true));
    console.log(answer_collision.collided);

    // add slingshot 
    slingshot = new SlingShot(platform.x + 50, platform.y - platform.h / 0.5, protagonist.body);
    return temp;
}


// RNG for numbers between two specified bounds
function rand_interval(begin, end) {
    return Math.floor(Math.random() * (end - begin + 1) + begin);
}


/////////////////////////////////////////////////////////////////////////
//////////////////////////ADD MATH FUNCTIONS HERE////////////////////////
/////////////////////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////////////////////
//////////////////////////ADD ELEMENTS TO WORLD HERE/////////////////////
/////////////////////////////////////////////////////////////////////////


// add all of the bodies to the world
Composite.add(engine.world, elements());
World.add(world, sling);
World.add(world, boundary);


/////////////////////////////////////////////////////////////////////////
///////////////////////////// ADD LISTENERS HERE ////////////////////////
/////////////////////////////////////////////////////////////////////////


// VARIABLES
Events.on(sling, "enddrag", function () {
    setTimeout(() => {
        slingshot.release();
    }, 20);
});

Events.on(protagonist, 'collisionStart', function (event) {
    console.log("h");
    let a = event.pairs.bodyA;
    let b = event.pairs.bodyB;
    console.log(answer_collision.collided);
});


/////////////////////////////////////////////////////////////////////////
/////////////////////////////// RUN SOME STUFF //////////////////////////
/////////////////////////////////////////////////////////////////////////

// run the renderer
Render.run(render);

// create runner
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);