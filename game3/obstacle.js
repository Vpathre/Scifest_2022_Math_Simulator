function Rectangle(x, y, w, h, options, render) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.body = Bodies.rectangle(x, y, w, h, options, render);

    World.add(world, this.body);

    this.show = function () {
        var pos = this.body.position;
        var angle = this.body.angle;
    }
}

function Circle(x, y, r, flag, options) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.body = Bodies.circle(x, y, r, options);
    this.flag = flag;

    World.add(world, this.body);

    this.show = function () {
        var pos = this.body.position;
        var angle = this.body.angle;
    }
}

class SlingShot {
    constructor(x, y, body) {
        const options = {
            pointA: {
                x: x,
                y: y,
            },
            bodyB: body,
            stiffness: 0.1,
            length: 50
        }
        this.sling = Constraint.create(options);
        World.add(world, this.sling);
    }

    release() {
        this.sling.pointA = null;
        this.sling.bodyB = null;
    }
}