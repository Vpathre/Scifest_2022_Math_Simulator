var platform = null;
var circle, body;
// const DEG_RAD = Math.PI / 180;
// const RAD_DEG = 180 / Math.PI;

// Constants
var velocity_x = 200;
var velocity_y = 200;
var gravity = 400;
var music;
var plus_music;
var minus_music;
var mult_music;
var jump_music;
var hit_music;
var gate_music;
var selected_sign = "Choose a sign";

// player animations
var stand, walk, jump, duck;
// globals for new ball
var ball;
var gate;

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
var text1, text2;


var Body = Phaser.Physics.Matter.Matter.Body;
var Bodies = Phaser.Physics.Matter.Matter.Bodies;
var Composite = Phaser.Physics.Matter.Matter.Composite;
var Parser = Phaser.Physics.Matter.PhysicsEditorParser;
var Matter = Phaser.Physics.Matter.Matter;


// Class to Level 1 scene
class Level_1 extends Phaser.Scene {
    constructor() {
        super({
            key: "Level_1"
        });
    }

    preload() {
        this.load.audio('theme', 'assets/HappyLoops/HappyLoops/intro.wav');
        this.load.audio('plus_sound', 'assets/HappyLoops/Cancel_1.wav');
        this.load.audio('minus_sound', 'assets/HappyLoops/Confirm_1.wav');
        this.load.audio('divide_sound', 'assets/HappyLoops/Select_1.wav');
        this.load.audio('jump_sound', 'assets/HappyLoops/Jump_1.wav');
        this.load.audio('hit_sound', 'assets/HappyLoops/collect_number.wav');
        this.load.audio('gate_sound', 'assets/HappyLoops/Open_gate.wav');
        this.load.image('red', 'assets/red.png');
        this.load.image('background', 'assets/Platformer/Base pack/bg.png');
        this.load.image('cloud1', '/assets/Platformer/Base pack/Items/cloud1.png');
        this.load.image('cloud2', '/assets/Platformer/Base pack/Items/cloud2.png');
        this.load.image('cloud3', '/assets/Platformer/Base pack/Items/cloud3.png');
        this.load.image('left', '/assets/Platformer/Base pack/Tiles/grassLeft.png');
        this.load.image('mid', '/assets/Platformer/Base pack/Tiles/grassMid.png');
        this.load.image('right', '/assets/Platformer/Base pack/Tiles/grassRight.png');
        this.load.image('mud', '/assets/Platformer/Base pack/Tiles/grassCenter.png');
        this.load.image('brown_tall', '/assets/Platformer/Mushroom expansion/PNG/tallShroom_brown.png');
        this.load.image('red_tall', '/assets/Platformer/Mushroom expansion/PNG/tallShroom_red.png');
        this.load.image('tan_tall', '/assets/Platformer/Mushroom expansion/PNG/tallShroom_tan.png');
        this.load.image('brown_short', '/assets/Platformer/Mushroom expansion/PNG/tinyShroom_brown.png');
        this.load.image('mushroom_bush', '/assets/Platformer/Mushroom expansion/PNG/bush.png');
        this.load.image('brick_platform', 'assets/Platformer/Base Pack/Tiles/castleHalf.png');
        this.load.image('small_bricks', 'assets/Platformer/Base Pack/Tiles/brickWall.png');
        this.load.image('plant', '/assets/Platformer/Base pack/Items/plant.png');
        this.load.image('cactus', '/assets/Platformer/Base pack/Items/cactus.png');
        this.load.image('pp_plant', '/assets/Platformer/Base pack/Items/plantPurple.png');
        this.load.image('bush', '/assets/Platformer/Base pack/Items/bush.png');
        this.load.image('cactus', '/assets/Platformer/Base pack/Items/cactus.png');
        this.load.image('white_rect', 'assets/white_rectangle.png');
        this.load.image('black_rect', 'assets/black_rectangle.png');
        this.load.image('plus', 'assets/plus.png');
        this.load.image('minus', 'assets/minus.png');
        this.load.image('multiply', 'assets/multiply.png');
        this.load.image('divide', 'assets/divide.png');
        this.load.image("particle", "assets/particle.png");
        this.load.image('exit_sign', 'assets/Platformer/Base Pack/Tiles/signExit.png')
        this.load.image('snow', '/assets/White.png');
        this.load.spritesheet('player', '/assets/Platformer/Base pack/Player/p1_spritesheet.png', {
            frameWidth: 72.57,
            frameHeight: 92
        });
    }

    create() {

        // add background image
        let bg = this.add.image(400, 300, 'background').setScale(3.5, 3.5);
        bg.setTint(0x00C4F4);

        let c1 = this.add.image(650, 100, 'cloud1').setScale(1, 1);
        let c2 = this.add.image(280, 50, 'cloud2').setScale(1, 1);
        let c3 = this.add.image(50, 200, 'cloud3').setScale(1, 1);
        c1.alphaBottomLeft = 0.5;
        c1.alphaBottomRight = 0.5;
        c2.alphaBottomLeft = 0.5;
        c2.alphaBottomRight = 0.5;
        c3.alphaBottomLeft = 0.5;
        c3.alphaBottomRight = 0.5;

        let p1 = this.add.image(125, 460, 'plant').setScale(0.8, 0.8);
        p1.alpha = 0.8;
        let p2 = this.add.image(465, 460, 'plant').setScale(0.8, 0.8);
        p2.alpha = 0.8;
        let p3 = this.add.image(440, 460, 'plant').setScale(0.8, 0.8);
        p3.alpha = 0.8;
        let p4 = this.add.image(425, 395, 'pp_plant').setScale(0.8, 0.8);
        p4.alpha = 0.8;
        let p5 = this.matter.add.image(495, 400, 'pp_plant', null, {
            isStatic: true,
            isSensor: true,
            angle: 0.4
        }).setScale(0.8, 0.8);
        p5.alpha = 0.8;
        this.add.image(600, 450, 'bush').setScale(1, 1);
        this.add.image(580, 450, 'bush').setScale(1, 1);
        this.add.image(610, 450, 'bush').setScale(1, 1);
        this.add.image(690, 435, 'cactus').setScale(1.5, 1.5);
        this.add.image(170, 450, 'mushroom_bush').setScale(1, 1);
        this.add.image(190, 450, 'mushroom_bush').setScale(1, 1);
        this.add.image(200, 250, 'red_tall').setScale(1, 1).setAlpha(1);
        this.add.image(190, 250, 'red_tall').setScale(1, 1).setAlpha(0.9);
        this.add.image(175, 450, 'red_tall').setScale(1, 1).setAlpha(1);
        this.add.image(570, 110, 'brown_tall').setScale(1, 1).setAlpha(0.9);
        this.add.image(580, 110, 'brown_tall').setScale(1, 1).setAlpha(0.9);
        this.add.image(150, 450, 'brown_short').setScale(1, 1).setAlpha(1);
        this.add.image(220, 450, 'brown_short').setScale(1, 1).setAlpha(1);




        this.matter.add.image(450, 450, 'exit_sign', null, {
            isStatic: true,
            isSensor: true
        }).setScale(1, 1);

        music = this.sound.add('theme');
        plus_music = this.sound.add('plus_sound');
        minus_music = this.sound.add('minus_sound');
        mult_music = this.sound.add('divide_sound');
        hit_music = this.sound.add('hit_sound');
        jump_music = this.sound.add('jump_sound');
        gate_music = this.sound.add('gate_sound');

        music.play({
            loop: true
        });

        ///////////////////////////////////////////// 
        // add borders to recreate borders of pinball
        /////////////////////////////////////////////

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

        den_score = current_question.denominator;

        current_frac = this.add.text(365, 10, num_score + "\n" + den_score, {
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
            fontSize: 25,
            align: 'center'
        });

        let temp_rect = this.add.rectangle(130, 0, 300, 80, 0xA07B51);
        temp_rect.setStrokeStyle(2, "0xd6d6d6");
        current_operation = this.add.text(10, 10, "Current operation: " + selected_sign, {
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
            fontSize: 18
        });


        // creation of the particle emitter
        this.emitter = this.add.particles("particle").createEmitter({

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
        ball.angle = 0;

        // check for key presses
        if (LEFT.isDown) {
            ball.setVelocityX(-3);
            if (ball.flipX == false) {
                ball.flipX = true;
            }
        }
        if (RIGHT.isDown) {
            ball.setVelocityX(3);
            if (ball.flipX == true) {
                ball.flipX = false;
            }
        }
        if (UP.isDown && ball.body.velocity.y < 0.1 && ball.body.velocity.y >= 0) {
            ball.setVelocityY(-10);
            // jump_music.play({
            //     loop: false
            // });
        } else if (DOWN.isDown) {

            ball.setVelocityY(5);
        }
        if (ball.body.velocity.x > 1 && ball.body.velocity.y < 1 && ball.body.velocity.y > -1) {
            ball.anims.play('walk', true);
        } else if (ball.body.velocity.x < -1 && ball.body.velocity.y < 1 && ball.body.velocity.y > -1) {
            ball.anims.play('walk', true);
        } else if (ball.body.velocity.y > 1 || ball.body.velocity.y < -1) {
            ball.anims.play('jump', true);
        } else {
            ball.anims.play('stand', true);
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
        // // create ball
        // circle = this.add.circle(25, 45, 22, 0xF21818);
        // body = this.matter.add.circle(25, 45, 22);
        // ball = this.matter.add.gameObject(circle, body);
        // ball.frictionAir = 0;
        // body.restitution = 0.7;

        ball = this.matter.add.sprite(30, 45, "player").setScale(0.8, 0.8); //make player1 body with physics enabled
        ball.fstatic = 1;
        ball.setTint(0x40C49D);

        // create character and animations
        this.anims.create({
            key: "stand",
            frames: this.anims.generateFrameNumbers('player', {
                start: 4,
                end: 5
            }),
            frameRate: 4,
            repeat: -1
        });

        this.anims.create({
            key: "walk",
            frames: this.anims.generateFrameNumbers('player', {
                start: 0,
                end: 5
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: "duck",
            frames: this.anims.generateFrameNumbers('player', {
                start: 12,
                end: 12
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: "jump",
            frames: this.anims.generateFrameNumbers('player', {
                start: 13,
                end: 13
            }),
            frameRate: 10,
            repeat: -1
        });


        LEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        RIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        UP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        DOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    }


    level_platforms() {
        // Basic platform right
        this.matter.add.image(450, 520, 'left', null, {
            isStatic: true,
            friction: 0.2,
            restitution: 0.8
        }).setScale(1, 1);

        this.matter.add.image(520, 520, 'mid', null, {
            isStatic: true,
            friction: 0.2,
            restitution: 0.8
        }).setScale(1, 1);
        this.matter.add.image(590, 520, 'mid', null, {
            isStatic: true,
            friction: 0.2,
            restitution: 0.8
        }).setScale(1, 1);
        this.matter.add.image(660, 520, 'mid', null, {
            isStatic: true,
            friction: 0.2,
            restitution: 0.8
        }).setScale(1, 1);
        this.matter.add.image(730, 520, 'right', null, {
            isStatic: true,
            friction: 0.2,
            restitution: 0.8
        }).setScale(1, 1);

        // Basic platform left
        this.matter.add.image(20, 520, 'left', null, {
            isStatic: true,
            friction: 0.2,
            restitution: 0.8
        }).setScale(1, 1);

        this.matter.add.image(90, 520, 'mid', null, {
            isStatic: true,
            friction: 0.2,
            restitution: 0.8
        }).setScale(1, 1);
        this.matter.add.image(160, 520, 'mid', null, {
            isStatic: true,
            friction: 0.2,
            restitution: 0.8
        }).setScale(1, 1);
        this.matter.add.image(230, 520, 'mid', null, {
            isStatic: true,
            friction: 0.2,
            restitution: 0.8
        }).setScale(1, 1);
        this.matter.add.image(300, 520, 'right', null, {
            isStatic: true,
            friction: 0.2,
            restitution: 0.8
        }).setScale(1, 1);


        // BOTTOM PLATFORM right
        this.matter.add.image(450, 585, 'mud', null, {
            isStatic: true,
            friction: 0.2,
            restitution: 0.8
        }).setScale(1, 1);
        this.matter.add.image(520, 585, 'mud', null, {
            isStatic: true,
            friction: 0.2,
            restitution: 0.8
        }).setScale(1, 1);
        this.matter.add.image(590, 585, 'mud', null, {
            isStatic: true,
            friction: 0.2,
            restitution: 0.8
        }).setScale(1, 1);
        this.matter.add.image(660, 585, 'mud', null, {
            isStatic: true,
            friction: 0.2,
            restitution: 0.8
        }).setScale(1, 1);
        this.matter.add.image(730, 585, 'mud', null, {
            isStatic: true,
            friction: 0.2,
            restitution: 0.8
        }).setScale(1, 1);

        // bottom left
        this.matter.add.image(20, 585, 'mud', null, {
            isStatic: true,
            friction: 0.2,
            restitution: 0.8
        }).setScale(1, 1);

        this.matter.add.image(90, 585, 'mud', null, {
            isStatic: true,
            friction: 0.2,
            restitution: 0.8
        }).setScale(1, 1);
        this.matter.add.image(160, 585, 'mud', null, {
            isStatic: true,
            friction: 0.2,
            restitution: 0.8
        }).setScale(1, 1);
        this.matter.add.image(230, 585, 'mud', null, {
            isStatic: true,
            friction: 0.2,
            restitution: 0.8
        }).setScale(1, 1);
        this.matter.add.image(300, 585, 'mud', null, {
            isStatic: true,
            friction: 0.2,
            restitution: 0.8
        }).setScale(1, 1);


        gate = this.matter.add.image(375, 490, 'brick_platform', null, {
            isStatic: true,
            friction: 0.2,
            restitution: 0.8
        }).setScale(1.1, 0.15);
        this.matter.add.image(200, 295, 'small_bricks', null, {
            isStatic: true,
            friction: 0.5,
            restitution: 0.8
        }).setScale(1, 1);

        this.matter.add.image(550, 175, 'small_bricks', null, {
            isStatic: true,
            friction: 0.5,
            restitution: 0.8
        }).setScale(1, 1);
    }


    text_creator() {
        this.ask_question();
        ball_num = current_question.numerator;
        ball_den = current_question.denominator;
        let text1_num = 5;
        let text1_den = 4;
        let text2_num = 1;
        let text2_den = 1;

        const ans2 = this.add.rectangle(200, 230, 50, 50, 0xF26419, 0.15);
        const body2 = this.matter.add.rectangle(200, 230, 50, 50, {
            isStatic: true,
            restitution: 1,
            isSensor: true
        });
        ans2.setStrokeStyle(2, "0x32F514");
        var ledge2 = this.matter.add.gameObject(ans2, body2);

        text1 = this.add.text(193, 200, text1_num + "\n" + text1_den, {
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
            fontSize: 25,
            align: 'center'
        });

        ledge2.setOnCollideWith(ball, pair => {
            if (selected_sign == "Choose a sign") {

            } else if (selected_sign == "Addition") {
                this.fraction_arithmatic(selected_sign, text1_num, text1_den);
                console.log(selected_sign, num_score, den_score, text1_num, text1_den);
            } else if (selected_sign == "Subtraction") {
                this.fraction_arithmatic(selected_sign, text1_num, text1_den);
                console.log(selected_sign, num_score, den_score, text1_num, text1_den);
            } else if (selected_sign == "Multiplication") {
                this.fraction_arithmatic(selected_sign, text1_num, text1_den);
                console.log(selected_sign, num_score, den_score, text1_num, text1_den);
            }

            hit_music.play({
                loop: false
            });
        });


        const ans3 = this.add.rectangle(550, 110, 50, 50, 0xF26419, 0.15);
        const body3 = this.matter.add.rectangle(550, 110, 50, 50, {
            isStatic: true,
            restitution: 1,
            isSensor: true
        });
        ans3.setStrokeStyle(2, "0x32F514");
        var ledge3 = this.matter.add.gameObject(ans3, body3);

        text2 = this.add.text(543, 80, text2_num, {
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
            fontSize: 40,
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
                console.log(selected_sign, num_score, den_score, text2_num, text2_den);
            } else if (selected_sign == "Subtraction") {
                this.fraction_arithmatic(selected_sign, text2_num, text2_den);
                console.log(selected_sign, num_score, den_score, text2_num, text2_den);
            } else if (selected_sign == "Multiplication") {
                this.fraction_arithmatic(selected_sign, text2_num, text2_den);
                console.log(selected_sign, num_score, den_score, text2_num, text2_den);
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

            // this.tweens.add({
            //     targets: ledge,
            //     alpha: 0.5,
            //     yoyo: true,
            //     repeat: -1,
            //     ease: 'Sine.easeInOut'

            // });
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
        temp.numerator = 1;
        temp.denominator = 4;
        current_question = temp;
    }


    // Check if the basket is correct
    logic_checker(ball_obj) {
        if (num_score == current_question.numerator && den_score == current_question.denominator) {
            if (globalCounter == 0) {
                this.destroyPlatform(gate);
                globalCounter++;
            }
            if (ball_obj.y > 460 && ball_obj.x < 375 + 60 && ball_obj.x > 375 - 60) {
                // alert("Game Over");
                music.stop();
                this.scene.start("Level_2");
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
        let circle1 = this.add.circle(100, 375, 22, 0x12191D);
        let body1 = this.matter.add.circle(100, 375, 22);
        let add = this.matter.add.gameObject(circle1, body1);
        body1.restitution = 0.8;
        body1.isStatic = true;
        body1.isSensor = true;
        var pls_img = this.matter.add.image(100, 375, 'plus', null, {
            isStatic: true,
            isSensor: true
        }).setScale(0.065, 0.065);
        let glow1 = circle1.setStrokeStyle(3, "0x63B616");
        this.tweens.add({
            targets: glow1,
            // alpha: 0.3,
            y: 355,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        this.tweens.add({
            targets: pls_img,
            y: 355,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        add.setOnCollideWith(ball, pair => {
            ball.setTint("0x63B616");
            selected_sign = "Addition";
            plus_music.play({
                loop: false
            });
        });


        // create - ball
        let circle2 = this.add.circle(375, 115, 22, 0x12191D);
        let body2 = this.matter.add.circle(375, 115, 22);
        let sub = this.matter.add.gameObject(circle2, body2);
        body2.restitution = 0.8;
        body2.isStatic = true;
        body2.isSensor = true;
        var min_img = this.matter.add.image(375, 115, 'minus', null, {
            isStatic: true,
            isSensor: true
        }).setScale(0.065, 0.065);
        let glow2 = circle2.setStrokeStyle(3, "0x001A9F");
        this.tweens.add({
            targets: glow2,
            y: 130,
            // alpha: 0.3,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        this.tweens.add({
            targets: min_img,
            y: 130,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        sub.setOnCollideWith(ball, pair => {
            ball.setTint("0x1499BA");
            selected_sign = "Subtraction";
            minus_music.play({
                loop: false
            });
        });


        // create * ball
        let circle3 = this.add.circle(650, 350, 22, 0x12191D);
        let body3 = this.matter.add.circle(650, 350, 22);
        let mult = this.matter.add.gameObject(circle3, body3);
        body3.restitution = 0.8;
        body3.isStatic = true;
        body3.isSensor = true;
        var mult_image = this.matter.add.image(650, 350, 'multiply', null, {
            isStatic: true,
            isSensor: true
        }).setScale(0.065, 0.065);
        let glow3 = circle3.setStrokeStyle(3, "0xE4DE29");
        this.tweens.add({
            targets: glow3,
            // alpha: 0.3,
            y: 330,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        this.tweens.add({
            targets: mult_image,
            y: 330,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        mult.setOnCollideWith(ball, pair => {
            ball.setTint("0xE4DE29");
            selected_sign = "Multiplication";
            mult_music.play({
                loop: false
            });
        });
    }

    destroyPlatform(closestPlatform) {
        // retrieve platform bounding box
        let platformBounds = closestPlatform.getBounds();

        // place particle emitter in the top left coordinate of the platform
        this.emitter.setPosition(platformBounds.left, platformBounds.top);

        // now the emitter is active
        this.emitter.active = true;

        // set a emit zone
        this.emitter.setEmitZone({

            // zone source is a rectangle with the same size as the platform
            source: new Phaser.Geom.Rectangle(0, 0, platformBounds.width, platformBounds.height),

            // place particles at random positions
            type: "random",

            // how many particles? 50
            quantity: 50
        });

        // explosion!
        this.emitter.explode();
        gate_music.play({
            loop: false
        });
        gate.destroy();
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
            let temp_den = den_score;
            num_score /= den_score;
            den_score /= temp_den;
        }
        // big denominator; small numerator
        else if (den_score % num_score == 0 && num_score > 1) {
            let temp_num = num_score;
            den_score /= num_score;
            num_score /= temp_num;
        }
    }
}