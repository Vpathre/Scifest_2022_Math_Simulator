var platform = null;
var timer, p2text, timerText, lives_text, ans;
var time = 25;
var spring;
// blob1 will always be the answer 
var player, blob1;
var SPEED = 900;
var dots, dot;
var num_lives;
var trajectory_disable;

// Constants
var velocity_x = 100;
var velocity_y = 100;
var gravity = 400;

// Class to Level 1 scene
class Level_5 extends Phaser.Scene {
    constructor() {
        super({
            key: "Level_5"
        });
    }

    preload() {
        this.load.image('red', 'assets/red.png');
        this.load.image('green', 'assets/green.png');
        this.load.image('white', 'assets/white.png');
        this.load.image('background', 'assets/sky_background.jpg');
        this.load.image('platform', 'assets/platform.jpg');

    }

    create() {
        // set bounds
        this.physics.world.setBounds(0, 0, 750, 600);

        trajectory_disable = false;
        num_lives = 3;

        //background
        let backg = this.add.sprite(0, 0, "background");
        backg.setOrigin(0, 0);
        let scaleX = this.cameras.main.width / backg.width;
        let scaleY = this.cameras.main.height / backg.height;
        let scale = Math.max(scaleX, scaleY);
        backg.setScale(scale).setScrollFactor(0);

        // add platforms
        platform = this.physics.add.staticGroup();
        let surface = platform.create(600, 600, 'platform').setScale(100, 0.25).refreshBody(); //resize the platform to cover the bottom of the image
        surface.body.immovable = true; //surface doesn't move
        this.level_platforms(platform);

        // add characters
        this.level_characters();

        // trajectory
        dots = this.add.group();

        //timer
        timerText = this.add.text(30, 20, "Time: 0:" + time, {
            fontSize: "20px",
            fill: 'white'
        });

        //question for each level
        p2text = this.add.text(300, 20, "Question 5:", {
            fontSize: "24px",
            fill: 'white'
        });

        //question for each level
        lives_text = this.add.text(600, 20, "Lives:3", {
            fontSize: "24px",
            fill: 'white'
        });

        ans = this.add.text(0, 0, "Ans", {
            font: "24px Arial",
            fill: "#ffffff",
            wordWrap: true,
            wordWrapWidth: blob1.width,
            wordWrapHeight: blob1.height,
            align: "center",
        });

        // // add timer
        // // Create our Timer
        // timer = gameScene.time.create(false);

        // // Set a TimerEvent to occur after 2 seconds
        // timer.loop(2000, updateCounter, this);

        // // Start the timer running - this is important!
        // // It won't start automatically, allowing you to hook it to button events and the like.
        // timer.start();

        // squeeze
        // this.tweens.add({
        //     targets: r1,
        //     scaleX: 0.25,
        //     scaleY: 0.5,
        //     yoyo: true,
        //     repeat: -1,
        //     ease: 'Sine.easeInOut'
        // });

        // fade in and out
        // this.tweens.add({
        //     targets: r1,
        //     alpha: 0.7,
        //     yoyo: true,
        //     repeat: -1,
        //     ease: 'Sine.easeInOut'
        // });

        // spin
        // this.tweens.add({
        //     targets: r1,
        //     angle: 90,
        //     yoyo: true,
        //     repeat: -1,
        //     ease: 'Sine.easeInOut'
        // });

        // add event listener
        // this.game.input.activePointer.x = this.game.width / 2;
        // this.game.input.activePointer.y = this.game.height / 2 - 100;

        this.input.mouse.disableContextMenu();

        this.input.on('pointerdown', function (pointer) {

            if (pointer.rightButtonDown()) {
                if (pointer.getDuration() > 500) {
                    this.shoot(pointer.x, pointer.y);
                } else {
                    this.shoot(pointer.x, pointer.y);
                }
            } else {
                if (pointer.getDuration() > 500) {
                    this.shoot(pointer.x, pointer.y);
                } else {
                    this.shoot(pointer.x, pointer.y);
                }
            }

        }, this);

    }


    update(delta) {
        var pointer = this.input.activePointer;

        timerText = this.add.text(30, 20, "Time: 0:" + time, {
            fontSize: "20px",
            fill: 'white'
        });

        if (!trajectory_disable) {
            this.drawTrajectory(pointer.x, pointer.y);
        }

        ans.x = Math.floor(blob1.x - 35 + blob1.width / 2);
        ans.y = Math.floor(blob1.y - 35 + blob1.height / 2);
    }


    updateTimer() {
        time--;
    }

    /**
     * Generates a random value occuring in a provided interval
     * @param {begin} begin: first value of the interval of interest
     * @param {end} end: last value of the interval of interest
     * @returns random value
     */
    rand_interval(begin, end) {
        return Math.floor(Math.random() * (end - begin + 1) + begin);
    }


    /**
     * Function used to deal with generating platforms for each level; unique platforms for each level
     * @param {platform} platform static group type passed in as a parameter
     */
    level_platforms(platform) {
        var shooting_board = platform.create(100, 300, 'platform').setScale(0.15, 0.07).refreshBody();
        var ledge1 = platform.create(405, 450, 'platform').setScale(0.25, 0.07).refreshBody();
        var ledge2 = platform.create(575, 200, 'platform').setScale(0.25, 0.07).refreshBody();
        var ledge3 = platform.create(575, 500, 'platform').setScale(0.25, 0.07).refreshBody();
        var ledge4 = platform.create(575, 500, 'platform').setScale(0.25, 0.07).refreshBody();
        var ledge5 = platform.create(200, 150, 'platform').setScale(0.05, 0.5).refreshBody();
        var ledge6 = platform.create(200, 400, 'platform').setScale(0.05, 0.5).refreshBody();
        var ledge7 = platform.create(375, 275, 'platform').setScale(0.25, 0.07).refreshBody();
        ledge1.body.immovable, ledge2.body.immovable, ledge3.body.immovable, ledge4.body.immovable, ledge6.body.immovable, ledge7.body.immovable = true; //surface doesn't move
    }

    /**
     * function uesd to deal with unique characters for each level, must be modified for each level of the game
     */
    level_characters() {
        // var blobs = this.physics.Group(); // Try to make a group instead of individual bs
        player = this.physics.add.sprite(100, 250, 'red').setScale(0.06, 0.06);
        blob1 = this.add.circle(405, 400, 20, this.rand_hex());
        var blob2 = this.add.circle(575, 150, 20, this.rand_hex());
        var blob3 = this.add.circle(575, 450, 20, this.rand_hex());
        var blob4 = this.add.circle(375, 225, 20, this.rand_hex());
        this.physics.add.existing(player);
        this.physics.add.existing(blob1);
        this.physics.add.existing(blob2);
        this.physics.add.existing(blob3);
        this.physics.add.existing(blob4);

        // // add collisions
        // player.body.bounce.x, player.body.bounce.y = 0.7;
        player.setBounce(0.7);
        blob1.body.bounce.x, blob1.body.bounce.y = 0.7;
        blob2.body.bounce.x, blob2.body.bounce.y = 0.7;
        blob3.body.bounce.x, blob3.body.bounce.y = 0.7;
        blob4.body.bounce.x, blob4.body.bounce.y = 0.7;
        this.physics.add.collider(player, platform);
        this.physics.add.collider(blob1, platform);
        this.physics.add.collider(blob2, platform);
        this.physics.add.collider(blob3, platform);
        this.physics.add.collider(blob4, platform);
        this.physics.add.collider(blob1, blob2);
        this.physics.add.collider(player, blob1, () => alert("WELL DONE!! GAME OVER"));
        this.physics.add.collider(player, blob2, () => {
            num_lives--;
            lives_text.setText("Lives:" + num_lives);
        });
        this.physics.add.collider(blob3, player, () => {
            num_lives--;
            lives_text.setText("Lives:" + num_lives);
        });
        this.physics.add.collider(blob4, player, () => {
            num_lives--;
            lives_text.setText("Lives:" + num_lives);
        });
        this.physics.add.collider(blob4, blob1);
        this.physics.add.collider(this.physics.world, blob1);
        this.physics.add.collider(this.physics.world, blob2);
        this.physics.add.collider(this.physics.world, blob3);
        this.physics.add.collider(this.physics.world, blob4);
        player.setCollideWorldBounds(true);
    }

    // random colour generator
    rand_hex() {
        var hex_char = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
        var hex_value = ['#'];

        for (let i = 0; i < 6; i++) {
            hex_value.push(hex_char[this.rand_interval(0, hex_char.length - 1)]);
        }
        // return hex_value.join('');
        return parseInt(hex_value.join('').replace(/^#/, '0X'), 16);
    }

    updateCounter() {
        timer
    }


    /**
     * add the trajectory of the expected projectile path of the ball based on gravity and velocity
     * @param {x} x end position of the expected point of the end of the ball's x trajectory
     * @param {y} y end position of the expected point of the end of the ball's y trajectory
     */
    drawTrajectory(x, y) {
        var xf = (x - player.body.x);
        var yf = (y - player.body.y);
        var m = yf / xf;
        // var xf = Math.abs(x - player.body.x);
        // var yf = Math.abs(y - player.body.y);
        var theta = Math.tan(yf / xf); //tan of angle between start and end
        var c = y - (m * x);
        var dist = Math.sqrt((xf ** 2) + (yf ** 2));

        // v*t - (1/2)a*(t^2) ;
        dots.clear(true);
        dots = this.add.group();

        for (let i = 0; i < 25; i++) {
            var temp_x = (player.body.x + 45) + (i * 20);
            // var temp_y = (Math.tan(theta) * i) - ((gravity / (2 * (velocity_x * Math.cos(theta)) ** 2)) * i * i); // very broken, please fix
            var temp_y = -1 * m * temp_x + c;
            dot = this.add.sprite(temp_x, temp_y, 'white').setScale(0.005, 0.005);
            dots.add(dot);
        }
    }

    shoot(x, y) {
        dots.destroy(true);
        trajectory_disable = true;
        player.setVelocity(x, y);
    }
}