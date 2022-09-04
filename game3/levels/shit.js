var circle, body;

// Constants
var velocity_x = 200;
var velocity_y = 200;
var gravity = 400;
var music;
var plus_music;
var minus_music;
var mult_music;
var div_music;
var jump_music;
var hit_music;
var gate_music;
var selected_sign = "Choose a sign";

// globals for new ball
var ball;
var gate2;

// global for fraction line on ball
var line1, line2;
var constraint = true;
var cons;
var graphics;

// globals for input keys
var SPACE;
var LEFT;
var RIGHT;
var UP;
var DOWN;

// make global variable to store the questions that are asked in the level
var questions = [];
var current_question;
var baskets = [];

// text for scorekeeping
var total_score, current_score;
var ball_num, ball_den;
var num_score = 0;
var den_score = 0;
var current_frac, current_operation;
var timer = 800;
var interval;
var globalCounter = 0;
var text0, text1, text2, text3;


var Body = Phaser.Physics.Matter.Matter.Body;
var Bodies = Phaser.Physics.Matter.Matter.Bodies;
var Composite = Phaser.Physics.Matter.Matter.Composite;
var Parser = Phaser.Physics.Matter.PhysicsEditorParser;
var Matter = Phaser.Physics.Matter.Matter;


// Class to Level 1 scene
class Level_2 extends Phaser.Scene {
    constructor() {
        super({
            key: "Level_2"
        });
    }

    preload() {
        this.load.audio('theme2', 'assets/HappyLoops/HappyLoops/not-really-lost.wav');
        this.load.audio('plus_sound', 'assets/HappyLoops/Cancel_1.wav');
        this.load.audio('minus_sound', 'assets/HappyLoops/Confirm_1.wav');
        this.load.audio('mult_sound', 'assets/HappyLoops/Select_1.wav');
        this.load.audio('divide_sound', 'assets/HappyLoops/Text_1.wav');
        this.load.audio('jump_sound', 'assets/HappyLoops/Jump_1.wav');
        this.load.audio('hit_sound', 'assets/HappyLoops/collect_number.wav');
        this.load.audio('gate_sound', 'assets/HappyLoops/Open_gate.wav');
        this.load.image('red', 'assets/red.png');
        this.load.image('green', 'assets/green.png');
        this.load.image('white', 'assets/white.png');
        this.load.image('background', 'assets/sky_background_2.jpg');
        this.load.image('platform', 'assets/platform.jpg');
        this.load.image('brick_platform', 'assets/bricks.png');
        this.load.image('small_bricks', 'assets/small_bricks.jpg');
        this.load.image('white_rect', 'assets/white_rectangle.png');
        this.load.image('black_rect', 'assets/black_rectangle.png');
        this.load.image('plus', 'assets/plus.png');
        this.load.image('minus', 'assets/minus.png');
        this.load.image('multiply', 'assets/multiply.png');
        this.load.image('divide', 'assets/divide.png');
        this.load.image("particle", "assets/particle.png");
    }

    create() {
        // new scene setup
        num_score = 0;
        globalCounter = 0;

        // add background image
        this.add.image(400, 300, 'background').setScale(0.75, 0.65);

        music = this.sound.add('theme2');
        plus_music = this.sound.add('plus_sound');
        minus_music = this.sound.add('minus_sound');
        mult_music = this.sound.add('mult_sound');
        div_music = this.sound.add('divide_sound');
        hit_music = this.sound.add('hit_sound');
        jump_music = this.sound.add('jump_sound');
        gate_music = this.sound.add('gate_sound');

        music.play({
            loop: true
        });

        ///////////////////////////////////////////// 
        // add borders to recreate borders of pinball
        /////////////////////////////////////////////

        this.matter.add.image(585, 540, 'brick_platform', null, {
            isStatic: true,
            friction: 0.2,
            restitution: 0.8
        }).setScale(0.65, 0.5);

        this.matter.add.image(165, 540, 'brick_platform', null, {
            isStatic: true,
            friction: 0.2,
            restitution: 0.8
        }).setScale(0.65, 0.5);

        gate2 = this.matter.add.image(375, 485, 'brick_platform', null, {
            isStatic: true,
            friction: 0.2,
            restitution: 0.8
        }).setScale(0.17, 0.065);

        // create and place baskets on the screen
        var basket = '60 0 70 0 70 90 130 90 130 0 140 0 140 100 60 100 60 0';

        for (var i = 0; i < 1; i++) {
            // 0xFF44FF
            var poly = this.add.polygon(375 + (200 * i), 560, basket, 0x000000, 0.8);
            baskets.push(poly);
            this.matter.add.gameObject(poly, {
                shape: {
                    type: 'fromVerts',
                    verts: basket,
                    flagInternal: true
                },
                isStatic: true
            }).setScale(1.1, 1.1);
        }

        // fill baskets with answer "blocks"
        // create coloured blocks worth numerator
        // total blocks worth denominator
        // randomly allocate block representations between the 7 baskets

        for (let i = 0; i < 1; i++) {
            let temp = this.rand_interval(0, 199);
            questions.push(questions_array[temp]);
        }


        // add bounds to this world
        let bounds = this.matter.world.setBounds(0, 0, 750, 600);

        graphics = this.add.graphics();
        graphics.lineStyle(128, 0xffffff, 1);
        line2 = this.add.line(370, 40, 0, 0, 40, 0, 0x000000);


        this.ball_creator();
        this.level_platforms();
        this.text_creator();
        this.block_creator(0, current_question.numerator, current_question.denominator);

        // generate mathematical powerups
        this.powerups();

        den_score = 1;

        current_frac = this.add.text(365, 10, num_score + "\n" + den_score, {
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
            fontSize: 25,
            align: 'center'
        });

        let temp_rect = this.add.rectangle(130, 0, 300, 80, 0x764E24);
        temp_rect.setStrokeStyle(2, "0xd6d6d6");
        current_operation = this.add.text(10, 10, "Current operation: " + selected_sign, {
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
            fontSize: 18
        });


        // creation of the particle emitter
        this.emitter2 = this.add.particles("particle").createEmitter({

            // each particle starts at full scale and shrinks down until it disappears
            scale: {
                start: 1,
                end: 0
            },

            // each particle has a random speed from zero (no speed) to 200 pixels per second
            speed: {
                min: 0,
                max: 200
            },

            // the emitter is not active at the moment, this means no particles are emitted
            active: false,

            // each particle has a 500 milliseconds lifespan
            lifespan: 500,

            // the emitter can fire 50 particles simultaneously
            quantity: 50
        });
    }


    update(delta) {
        // destroy lines and text added during rendering update
        current_frac.destroy();
        current_operation.destroy();



        // check for key presses
        if (LEFT.isDown) {
            ball.setVelocityX(-3);
        }

        if (RIGHT.isDown) {
            ball.setVelocityX(3);
        }

        if (UP.isDown && ball.body.velocity.y < 0.1 && ball.body.velocity.y > 0) {
            ball.setVelocityY(-10);
            // jump_music.play({
            //     loop: false
            // });
        }

        if (DOWN.isDown) {
            ball.setVelocityY(5);
        }


        current_frac = this.add.text(360, 10, num_score + "\n" + den_score, {
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
            fontSize: 25,
            align: 'center'
        });

        current_operation = this.add.text(10, 10, "Current operation: " + selected_sign, {
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
            fontSize: 18
        });
        this.logic_checker(ball);
    }


    ball_creator() {
        // create ball
        circle = this.add.circle(375, 45, 22, 0xF21818);
        body = this.matter.add.circle(375, 45, 22);
        ball = this.matter.add.gameObject(circle, body);
        ball.frictionAir = 0;
        body.restitution = 0.7;


        LEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        RIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        UP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        DOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    }


    level_platforms() {
        this.matter.add.image(150, 175, 'small_bricks', null, {
            isStatic: true,
            friction: 0.5,
            restitution: 0.8
        }).setScale(0.08, 0.08);

        this.matter.add.image(180, 350, 'small_bricks', null, {
            isStatic: true,
            friction: 0.5,
            restitution: 0.8
        }).setScale(0.15, 0.06);

        this.matter.add.image(600, 175, 'small_bricks', null, {
            isStatic: true,
            friction: 0.5,
            restitution: 0.8
        }).setScale(0.08, 0.08);

        this.matter.add.image(575, 350, 'small_bricks', null, {
            isStatic: true,
            friction: 0.5,
            restitution: 0.8
        }).setScale(0.15, 0.06);
    }


    text_creator() {
        this.ask_question();
        ball_num = current_question.numerator;
        ball_den = current_question.denominator;
        let text0_num = 1;
        let text0_den = 1;
        let text1_num = 1;
        let text1_den = 7;
        let text2_num = 5;
        let text2_den = 7;
        let text3_num = 1;
        let text3_den = 2;

        const ans1 = this.add.rectangle(150, 105, 50, 50, 0x2F434C, 0.7);
        const body1 = this.matter.add.rectangle(150, 105, 50, 50, {
            isStatic: true,
            restitution: 1,
            isSensor: true
        });
        ans1.setStrokeStyle(2, "0x32F514");
        var ledge1 = this.matter.add.gameObject(ans1, body1);

        text0 = this.add.text(140, 80, text0_num, {
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
            fontSize: 40,
            align: 'center'
        });

        ledge1.setOnCollideWith(ball, pair => {
            if (selected_sign == "Choose a sign") {

            } else if (selected_sign == "Addition") {
                this.fraction_arithmatic(selected_sign, text0_num, text0_den);
            } else if (selected_sign == "Subtraction") {
                this.fraction_arithmatic(selected_sign, text0_num, text0_den);
            } else if (selected_sign == "Multiplication") {
                this.fraction_arithmatic(selected_sign, text0_num, text0_den);
            } else if (selected_sign == "Division") {
                this.fraction_arithmatic(selected_sign, text0_num, text0_den);
            }

            hit_music.play({
                loop: false
            });
        });

        const ans2 = this.add.rectangle(150, 290, 50, 50, 0xF26419, 0.15);
        const body2 = this.matter.add.rectangle(150, 290, 50, 50, {
            isStatic: true,
            restitution: 1,
            isSensor: true
        });
        ans2.setStrokeStyle(2, "0x32F514");
        var ledge2 = this.matter.add.gameObject(ans2, body2);

        text1 = this.add.text(145, 260, text1_num + "\n" + text1_den, {
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
            fontSize: 25,
            align: 'center'
        });

        ledge2.setOnCollideWith(ball, pair => {
            if (selected_sign == "Choose a sign") {

            } else if (selected_sign == "Addition") {
                this.fraction_arithmatic(selected_sign, text1_num, text1_den);
            } else if (selected_sign == "Subtraction") {
                this.fraction_arithmatic(selected_sign, text1_num, text1_den);
            } else if (selected_sign == "Multiplication") {
                this.fraction_arithmatic(selected_sign, text1_num, text1_den);
            } else if (selected_sign == "Division") {
                this.fraction_arithmatic(selected_sign, text1_num, text1_den);
            }

            hit_music.play({
                loop: false
            });
        });


        const ans3 = this.add.rectangle(600, 105, 50, 50, 0x2F434C, 0.7);
        const body3 = this.matter.add.rectangle(600, 105, 50, 50, {
            isStatic: true,
            restitution: 1,
            isSensor: true
        });
        ans3.setStrokeStyle(2, "0x32F514");
        var ledge3 = this.matter.add.gameObject(ans3, body3);

        text2 = this.add.text(595, 75, text2_num + "\n" + text2_den, {
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
            fontSize: 25,
            align: 'center'
        });

        this.tweens.add({
            targets: [ledge2, ledge3],
            alpha: 0.7,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        ledge3.setOnCollideWith(ball, pair => {
            if (selected_sign == "Choose a sign") {

            } else if (selected_sign == "Addition") {
                this.fraction_arithmatic(selected_sign, text2_num, text2_den);
            } else if (selected_sign == "Subtraction") {
                this.fraction_arithmatic(selected_sign, text2_num, text2_den);
            } else if (selected_sign == "Multiplication") {
                this.fraction_arithmatic(selected_sign, text2_num, text2_den);
            } else if (selected_sign == "Division") {
                this.fraction_arithmatic(selected_sign, text2_num, text2_den);
            }
            hit_music.play({
                loop: false
            });
        });

        const ans4 = this.add.rectangle(600, 290, 50, 50, 0xF26419, 0.15);
        const body4 = this.matter.add.rectangle(600, 290, 50, 50, {
            isStatic: true,
            restitution: 1,
            isSensor: true
        });
        ans4.setStrokeStyle(2, "0x32F514");
        var ledge4 = this.matter.add.gameObject(ans4, body4);

        text3 = this.add.text(593, 260, text3_num + "\n" + text3_den, {
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
            fontSize: 25,
            align: 'center'
        });

        ledge4.setOnCollideWith(ball, pair => {
            if (selected_sign == "Choose a sign") {

            } else if (selected_sign == "Addition") {
                console.log(selected_sign, num_score, den_score, text3_num, text3_den);
            } else if (selected_sign == "Subtraction") {
                this.fraction_arithmatic(selected_sign, text3_num, text3_den);
            } else if (selected_sign == "Multiplication") {
                this.fraction_arithmatic(selected_sign, text3_num, text3_den);
            } else if (selected_sign == "Division") {
                this.fraction_arithmatic(selected_sign, text3_num, text3_den);
            }

            hit_music.play({
                loop: false
            });
        });
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


    // based on the index of the basket, the blocks
    block_creator(number, numerator, total) {
        // draw the total number of blocks in each respective basket
        for (let i = 0; i < total; i++) {
            // if numerator is 0
            if (numerator == 0) {
                return;
            }

            // if denominator is 0
            else if (total == 0) {
                return;
            }

            // if the block is a numerator, color it
            else if (i + 1 <= numerator) {
                const ans = this.add.rectangle(375 + (200 * number), 580 - (10 * i), 60, Math.floor(90 / total), 0x000000);
                const body = this.matter.add.rectangle(375 + (200 * number), 580 - (10 * i), 60, Math.floor(90 / total), {
                    isStatic: false,
                    restitution: 1
                });
                ans.setStrokeStyle(2, "0xF5EA14");
                var ledge = this.matter.add.gameObject(ans, body);

            }
            // if denominator, colour it white or something else
            else {
                const ans = this.add.rectangle(375 + (200 * number), 580 - (10 * i), 60, Math.floor(90 / total), 0xFFFFFF);
                const body = this.matter.add.rectangle(375 + (200 * number), 580 - (10 * i), 60, Math.floor(90 / total), {
                    isStatic: false,
                    restitution: 1
                });
                ans.setStrokeStyle(2, "0xF5EA14");
                var ledge = this.matter.add.gameObject(ans, body);
            }
        }
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


    ask_question() {
        let temp = questions[this.rand_interval(0, questions.length - 1)];
        temp.numerator = 3;
        temp.denominator = 7;
        current_question = temp;
    }


    // Check if the basket is correct
    logic_checker(ball_obj) {

        if (num_score == current_question.numerator && den_score == current_question.denominator) {
            if (globalCounter == 0) {
                this.destroyPlatform(gate2);
                globalCounter++;
            }
            if (ball_obj.y > 480 && ball_obj.x < 375 + 60 && ball_obj.x > 375 - 60) {
                alert("LEVEL COMPLETED: Game Over");
            }
        }
    }


    ball_manager(ball_obj) {
        ball_obj.destroy();
        ball_num_text.destroy();
        ball_den_text.destroy();
        line1.destroy();

        this.ball_creator();
    }


    powerups() {
        // create + ball
        let circle1 = this.add.circle(50, 260, 22, 0x12191D);
        let body1 = this.matter.add.circle(50, 260, 22);
        let add = this.matter.add.gameObject(circle1, body1);
        body1.restitution = 0.8;
        body1.isStatic = true;
        body1.isSensor = true;
        var pls_img = this.matter.add.image(50, 260, 'plus', null, {
            isStatic: true,
            isSensor: true
        }).setScale(0.065, 0.065);
        let glow1 = circle1.setStrokeStyle(3, "0x63B616");
        this.tweens.add({
            targets: glow1,
            // alpha: 0.3,
            y: 240,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        this.tweens.add({
            targets: pls_img,
            y: 240,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        add.setOnCollideWith(ball, pair => {
            circle.setFillStyle("0x63B616", 0.8);
            circle.setStrokeStyle(2, "0x2F434C");
            selected_sign = "Addition";
            plus_music.play({
                loop: false
            });
        });


        // create - ball
        let circle2 = this.add.circle(700, 260, 22, 0x12191D);
        let body2 = this.matter.add.circle(700, 260, 22);
        let sub = this.matter.add.gameObject(circle2, body2);
        body2.restitution = 0.8;
        body2.isStatic = true;
        body2.isSensor = true;
        var min_img = this.matter.add.image(700, 260, 'minus', null, {
            isStatic: true,
            isSensor: true
        }).setScale(0.065, 0.065);
        let glow2 = circle2.setStrokeStyle(3, "0x001A9F");
        this.tweens.add({
            targets: glow2,
            y: 240,
            // alpha: 0.3,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        this.tweens.add({
            targets: min_img,
            y: 240,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        sub.setOnCollideWith(ball, pair => {
            circle.setFillStyle("0x001A9F", 0.8);
            circle.setStrokeStyle(2, "0xF5A614");
            selected_sign = "Subtraction";
            minus_music.play({
                loop: false
            });
        });


        // create * ball
        let circle3 = this.add.circle(375, 350, 22, 0x12191D);
        let body3 = this.matter.add.circle(375, 350, 22);
        let mult = this.matter.add.gameObject(circle3, body3);
        body3.restitution = 0.8;
        body3.isStatic = true;
        body3.isSensor = true;
        var mult_image = this.matter.add.image(375, 350, 'multiply', null, {
            isStatic: true,
            isSensor: true
        }).setScale(0.065, 0.065);
        let glow3 = circle3.setStrokeStyle(3, "0xE4DE29");
        this.tweens.add({
            targets: glow3,
            // alpha: 0.3,
            y: 370,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        this.tweens.add({
            targets: mult_image,
            y: 370,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        mult.setOnCollideWith(ball, pair => {
            circle.setFillStyle("0xFFF200", 0.8);
            circle.setStrokeStyle(2, "0xF21818");
            selected_sign = "Multiplication";
            mult_music.play({
                loop: false
            });
        });



        // create / ball
        let circle4 = this.add.circle(375, 150, 22, 0x12191D);
        let body4 = this.matter.add.circle(375, 150, 22);
        let div = this.matter.add.gameObject(circle4, body4);
        body4.restitution = 0.8;
        body4.isStatic = true;
        body4.isSensor = true;
        let divimg = this.matter.add.image(375, 150, 'divide', null, {
            isStatic: true,
            isSensor: true
        }).setScale(0.065, 0.065);
        let glow4 = circle4.setStrokeStyle(3, "0xE429AC");
        this.tweens.add({
            targets: glow4,
            // alpha: 0.3,
            y: 170,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        this.tweens.add({
            targets: divimg,
            y: 170,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        div.setOnCollideWith(ball, pair => {
            circle.setFillStyle("0xFF00B3", 0.8);
            circle.setStrokeStyle(2, "0x5C2A73");
            selected_sign = "Division";
            div_music.play({
                loop: false
            });
        });
    }

    destroyPlatform(closestPlatform) {
        // retrieve platform bounding box
        let platformBounds = closestPlatform.getBounds();

        // place particle emitter in the top left coordinate of the platform
        this.emitter2.setPosition(platformBounds.left, platformBounds.top);

        // now the emitter is active
        this.emitter2.active = true;

        // set a emit zone
        this.emitter2.setEmitZone({

            // zone source is a rectangle with the same size as the platform
            source: new Phaser.Geom.Rectangle(0, 0, platformBounds.width, platformBounds.height),

            // place particles at random positions
            type: "random",

            // how many particles? 50
            quantity: 50
        });

        // explosion!
        this.emitter2.explode();
        gate_music.play({
            loop: false
        });
        closestPlatform.destroy();
    }

    fraction_arithmatic(operation, local_num, local_den) {
        let temp = math.lcm(den_score, local_den);
        if (operation == "Addition") {
            // check for similar fractions and add
            if (den_score == local_den) {
                num_score += local_num;
            } else {
                if (local_den < den_score) {
                    local_num *= (temp / local_den);
                    num_score += local_num;
                } else {
                    num_score *= (temp / den_score);
                    num_score += local_num;
                    den_score = temp;
                }
            }
        } else if (operation == "Subtraction") {
            // check for similar fractions and subtract
            if (den_score == local_den) {
                num_score -= local_num;
            } else {
                if (local_den < den_score) {
                    local_num *= (temp / local_den);
                    num_score -= local_num;
                } else {
                    num_score *= (temp / den_score);
                    num_score -= local_num;
                    den_score = temp;
                }
            }
        } else if (operation == "Multiplication") {
            num_score *= local_num;
            den_score *= local_den;
        } else if (operation == "Division") {
            num_score *= local_den;
            den_score *= local_num;
        }

        // simplify
        // big numerator; small denominator
        if (num_score % den_score == 0 && den_score > 1) {
            console.log("1");
            let temp_den = den_score;
            num_score /= den_score;
            den_score /= temp_den;
        }
        // big denominator; small numerator
        else if (den_score % num_score == 0 && num_score > 1) {
            console.log("2");
            let temp_num = num_score;
            den_score /= num_score;
            num_score /= temp_num;
        } else {
            let gcd = math.gcd(num_score, den_score);
            if (gcd == 2) {
                num_score /= gcd;
                den_score /= gcd;
            }
        }
    }
}