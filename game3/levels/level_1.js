// var platform = null;
// var circle, body;

// // Constants
// var velocity_x = 200;
// var velocity_y = 200;
// var gravity = 400;
// var global_numerator = 0;
// var global_denominator = 15;
// var global_tracker = 0;

// // globals for new ball
// var ball;
// var trash_can;
// var answer_can;

// // global for fraction line on ball
// var line1, line2;
// var constraint = true;
// var cons;
// var graphics;

// // globals for input keys
// var SPACE;
// var LEFT;
// var RIGHT;
// var UP;
// var DOWN;

// // make global variable to store the questions that are asked in the level
// var questions = [];
// var current_question;
// var baskets = [];
// var blocks = [];

// // text for scorekeeping
// var total_score;
// var ball_num, ball_den;
// var ball_num_text, ball_den_text;
// var total_score_keeper = 0;
// var total_score_text;
// var level_counter = 0;
// var timer = 800;
// var interval;
// var trash_music, wrong_sound, correct_sound, complete_sound, star_sound;
// var frame;
// var pls_img;

// // asset variables
// var star_flag1 = false;
// var star_flag2 = false;
// var star1 = null;
// var star2 = null;

// var Body = Phaser.Physics.Matter.Matter.Body;
// var Bodies = Phaser.Physics.Matter.Matter.Bodies;
// var Composite = Phaser.Physics.Matter.Matter.Composite;
// var Parser = Phaser.Physics.Matter.PhysicsEditorParser;
// var Matter = Phaser.Physics.Matter.Matter;


// // Class to Level 1 scene
// class Level_1 extends Phaser.Scene {
//     constructor() {
//         super({
//             key: "Level_1"
//         });
//     }

//     preload() {
//         this.load.image('red', 'assets/red.png');
//         this.load.image('green', 'assets/green.png');
//         this.load.image('white', 'assets/white.png');
//         this.load.image('background', 'assets/sky_background.jpg');
//         this.load.image('platform', 'assets/platform.jpg');
//         this.load.image('white_rect', 'assets/white_rectangle.png');
//         this.load.image('black_rect', 'assets/black_rectangle.png');
//         this.load.image('trash', 'assets/trash_can_white.png');
//         this.load.image('frame', 'assets/frame.png');
//         this.load.image('plus', 'assets/plus.png');
//         this.load.image('star', 'assets/star.png');
//         this.load.audio('trash_sound', 'assets/HappyLoops/Crunch.wav');
//         this.load.audio('wrong_sound', 'assets/HappyLoops/Access_denied.mp3');
//         this.load.audio('correct_sound', 'assets/HappyLoops/collect_number.wav');
//         this.load.audio('completed', 'assets/HappyLoops/Open_gate.wav');
//         this.load.audio('star_sound', 'assets/HappyLoops/Select_1.wav');
//     }

//     create() {
//         // add camera to enable shake effect
//         this.cameras.main.setBounds(0, 0, 750, 600);

//         // add some music
//         trash_music = this.sound.add('trash_sound');
//         wrong_sound = this.sound.add('wrong_sound');
//         correct_sound = this.sound.add('correct_sound');
//         complete_sound = this.sound.add('completed');
//         star_sound = this.sound.add('star_sound');

//         // add background image
//         this.add.image(400, 300, 'background').setScale(2, 2);

//         // create the platform at the top of the page
//         this.matter.add.image(375, 0, 'platform', null, {
//             isStatic: true
//         }).setScale(0.05, 0.5);

//         // create and place baskets on the screen
//         var basket = '60 0 70 0 70 90 130 90 130 0 140 0 140 100 60 100 60 0';

//         for (var i = 0; i < 2; i++) {
//             var poly = this.add.polygon(220 + (300 * i), 560, basket, 0x000000, 0.8);
//             baskets.push(poly);
//             let added = this.matter.add.gameObject(poly, {
//                 shape: {
//                     type: 'fromVerts',
//                     verts: basket,
//                     flagInternal: true
//                 },
//                 isStatic: true
//             }).setScale(1.1, 1.1);
//             if (i >= 0) {
//                 added.visible = false;
//             }
//         }

//         frame = this.add.image(385, 300, 'frame', null, {
//             isStatic: true
//         }).setScale(0.24, 0.194);
//         frame.alpha = 0;

//         trash_can = this.matter.add.image(220 + (300 * 1), 560, 'trash', null, {
//             isStatic: true,
//             isSensor: true
//         }).setScale(0.06, 0.063)
//         trash_can.setTint(0x000000);
//         // 0xBA2020

//         answer_can = this.matter.add.image(220, 560, 'trash', null, {
//             isStatic: true,
//             isSensor: true
//         }).setScale(0.06, 0.063)
//         answer_can.setTint(0xF2FAE5);

//         pls_img = this.matter.add.image(220, 535, 'plus', null, {
//             isStatic: true,
//             isSensor: true
//         }).setScale(0.065, 0.065);

//         for (let j = 0; j < 10; j++) {
//             for (let i = 0; i < global_denominator + 1; i++) {
//                 questions.push(new Questions(global_numerator, global_denominator, false));
//                 global_numerator++;
//             }
//             global_numerator = 0;
//         }

//         // add bounds to this world
//         let bounds = this.matter.world.setBounds(0, 0, 750, 600);


//         // line2 = this.add.line(cons.bodyB.x, cons.bodyB.y, cons.bodyB.x, cons.bodyB.y, cons.pointA.x, cons.pointA.y, 0xF5F514);
//         graphics = this.add.graphics();
//         graphics.lineStyle(128, 0xffffff, 1);
//         line2 = graphics.lineBetween(375, 50, 475, 100);


//         this.ball_creator();
//         this.asset_creator();
//         this.block_creator(global_denominator, 0);


//         total_score_text = this.add.text(5, 10, 'Total Score: ' + total_score_keeper, {
//             fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
//             fontSize: 22
//         });
//     }


//     update(delta) {
//         // destroy lines and text added during rendering update
//         line1.destroy();
//         line2.destroy();
//         ball_num_text.destroy();
//         ball_den_text.destroy();

//         this.children.bringToTop(trash_can);
//         this.children.bringToTop(answer_can);
//         this.children.bringToTop(pls_img);
//         this.children.bringToTop(star1);
//         this.children.bringToTop(star2);

//         // update the ball speed, make it swing
//         if (ball.y < 50 && ball.x < 375) {
//             ball.setVelocity(12);
//         } else if (ball.y < 50 && ball.x > 375) {
//             ball.setVelocity(12);
//         }

//         if (constraint == false) {
//             // check for key presses
//             if (LEFT.isDown) {
//                 ball.setVelocityX(-2);
//             }

//             if (RIGHT.isDown) {
//                 ball.setVelocityX(2);
//             }

//             if (UP.isDown) {
//                 ball.setVelocityY(-1.75);
//             }
//         }

//         line1 = this.add.line(ball.x, ball.y, 0, 0, 30, 0, 0x000000);

//         ball_num_text = this.add.text(ball.x - 5, ball.y - 20, ball_num, {
//             fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
//         });
//         ball_den_text = this.add.text(ball.x - 7, ball.y - 1, ball_den, {
//             fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
//         });

//         this.scoreKeeper();
//         this.logic_checker(ball);
//     }


//     ball_creator() {
//         // create ball
//         circle = this.add.circle(300, 45, 22, 0xF21818);
//         body = this.matter.add.circle(300, 45, 22);
//         ball = this.matter.add.gameObject(circle, body);
//         ball.frictionAir = 0;
//         body.restitution = 0.7;
//         cons = this.matter.add.worldConstraint(body, 120, 1, {
//             pointA: {
//                 x: 375,
//                 y: 50
//             },
//             bodyB: body
//         });

//         // add line for fraction representation to the ball
//         line1 = this.add.line(ball.x, ball.y, ball.x, ball.y, ball.x, ball.y, 0x000000);

//         // Add input keys to the scene
//         // SPACEBAR
//         this.input.keyboard.on('keydown-SPACE', function () {
//             cons.pointA = null;
//             cons.bodyB = null;
//             line2.destroy();
//             constraint = false;
//         }, this);

//         LEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
//         RIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
//         UP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);

//         this.ask_question();
//         ball_num = current_question.numerator;
//         ball_den = current_question.denominator;
//         ball_num_text = this.add.text(ball.x, ball.y - 15, ball_num, {
//             fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
//         });
//         ball_den_text = this.add.text(ball.x, ball.y + 15, ball_den, {
//             fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
//         });
//     }


//     /**
//      * Generates a random value occuring in a provided interval
//      * @param {begin} begin: first value of the interval of interest
//      * @param {end} end: last value of the interval of interest
//      * @returns random value
//      */
//     rand_interval(begin, end) {
//         return Math.floor(Math.random() * (end - begin + 1) + begin);
//     }


//     /**
//      * Function used to generate assets that add points to overall tally
//      */
//     asset_creator() {
//         if (!star_flag1) {
//             star1 = this.matter.add.image(600, 350, 'star', null, {
//                 isStatic: true,
//                 isSensor: true
//             }).setScale(0.05, 0.05);

//             this.tweens.add({
//                 targets: star1,
//                 y: 340,
//                 yoyo: true,
//                 repeat: -1,
//                 ease: 'Sine.easeInOut'
//             });

//             star1.setOnCollideWith(ball, () => {
//                 star_sound.play({
//                     loop: false
//                 });

//                 this.tweens.add({
//                     targets: star1,
//                     y: 300,
//                     alpha: 0,
//                     yoyo: false,
//                     repeat: 0,
//                     ease: 'Sine.easeInOut'
//                 });
//                 star_flag1 = true;
//             });
//         }
//         if (!star_flag2) {
//             star2 = this.matter.add.image(150, 350, 'star', null, {
//                 isStatic: true,
//                 isSensor: true
//             }).setScale(0.05, 0.05);

//             this.tweens.add({
//                 targets: star2,
//                 y: 340,
//                 yoyo: true,
//                 repeat: -1,
//                 ease: 'Sine.easeInOut'
//             });

//             star2.setOnCollideWith(ball, () => {
//                 star_sound.play({
//                     loop: false
//                 });

//                 this.tweens.add({
//                     targets: star2,
//                     y: 300,
//                     alpha: 0,
//                     yoyo: false,
//                     repeat: 0,
//                     ease: 'Sine.easeInOut'
//                 });
//                 star_flag2 = true;
//             });
//         }
//     }


//     // based on the index of the basket, the blocks
//     block_creator(number, colour_blocks) {
//         // draw the total number of blocks in each respective basket
//         let temp, temp_colour;
//         if (number % 2 == 0 ? temp = 0 : temp = 1);

//         if (temp == 0) {
//             for (let i = 0; i < number / 2; i++) {
//                 if (colour_blocks > 0) {
//                     temp_colour = 0x000000
//                     colour_blocks--;
//                 } else {
//                     temp_colour = 0xFFFFFF
//                 }
//                 const ans0 = this.add.rectangle(20, 440 - (10 * i), 30, 20, temp_colour);
//                 const body0 = this.matter.add.rectangle(20, 440 - (10 * i), 30, 20, {
//                     isStatic: false,
//                     restitution: 1
//                 });
//                 ans0.setStrokeStyle(2, "0xF5EA14");
//                 var ledge = this.matter.add.gameObject(ans0, body0);
//                 blocks.push(ledge);

//                 const ans1 = this.add.rectangle(50, 440 - (10 * i), 30, 20, temp_colour);
//                 const body1 = this.matter.add.rectangle(50, 440 - (10 * i), 30, 20, {
//                     isStatic: false,
//                     restitution: 1
//                 });
//                 ans1.setStrokeStyle(2, "0xF5EA14");
//                 var ledge = this.matter.add.gameObject(ans1, body1);
//                 blocks.push(ledge);
//             }
//         } else {
//             let x_tracker = 20;
//             for (let i = 0; i < number; i++) {
//                 if (colour_blocks > 0) {
//                     temp_colour = 0x000000
//                     colour_blocks--;
//                 } else {
//                     temp_colour = 0xFFFFFF
//                 }

//                 if (x_tracker > 60) {
//                     x_tracker = 20;
//                 }
//                 const ans1_0 = this.add.rectangle(x_tracker, 600 - (10 * i), 20, 20, temp_colour);
//                 const body1_0 = this.matter.add.rectangle(x_tracker, 600 - (10 * i), 20, 20, {
//                     isStatic: false,
//                     restitution: 1
//                 });
//                 ans1_0.setStrokeStyle(2, "0xF5EA14");
//                 var ledge = this.matter.add.gameObject(ans1_0, body1_0);
//                 blocks.push(ledge);

//                 x_tracker += 20;
//             }
//         }
//     }


//     // random colour generator
//     rand_hex() {
//         var hex_char = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
//         var hex_value = ['#'];

//         for (let i = 0; i < 6; i++) {
//             hex_value.push(hex_char[this.rand_interval(0, hex_char.length - 1)]);
//         }
//         return parseInt(hex_value.join('').replace(/^#/, '0X'), 16);
//     }


//     scoreKeeper() {
//         total_score_text.destroy();
//         total_score_text = this.add.text(5, 10, 'Total Score: ' + total_score_keeper, {
//             fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
//             fontSize: 22
//         });
//     }


//     ask_question() {
//         let temp = questions[this.rand_interval(0, questions.length - 1)];

//         if (temp.asked) {
//             this.ask_question()
//             return;
//         } else {
//             level_counter++;
//             current_question = temp;
//             temp.asked = true;
//             return;
//         }
//     }


//     // Check if the basket is correct
//     logic_checker(ball_obj) {
//         if (ball_obj.y > 567 && (ball_obj.x < (220 + 60) && ball_obj.x > (220 - 60))) {
//             this.ball_manager(ball_obj, true);
//         } else if (ball_obj.y > 567 && (ball_obj.x < (220 + 300 + 60) && ball_obj.x > (220 + 300 - 60))) {
//             this.ball_manager(ball_obj, false);
//         }
//     }


//     ball_manager(ball_obj, flag) {
//         if (!flag) {
//             trash_music.play({
//                 loop: false
//             });

//             frame.setTint(0xFFE500);
//             this.tweens.add({
//                 targets: frame,
//                 alpha: 1,
//                 yoyo: true,
//                 repeat: 0,
//                 ease: 'Sine.easeInOut'
//             });
//             frame.alpha = 0;
//             total_score_keeper += 10;
//         }
//         let num = ball_num
//         // ball_obj.destroy();
//         ball_num_text.destroy();
//         ball_den_text.destroy();
//         line1.destroy();

//         if (flag) {
//             if (global_tracker + num <= global_denominator) {
//                 for (let i = 0; i < blocks.length; i++) {
//                     blocks[i].destroy();
//                 }
//                 this.block_creator(global_denominator, global_tracker + num);
//                 global_tracker += num;

//                 frame.setTint(0x00FF00);
//                 this.tweens.add({
//                     targets: frame,
//                     alpha: 1,
//                     yoyo: true,
//                     repeat: 0,
//                     ease: 'Sine.easeInOut'
//                 });
//                 correct_sound.play({
//                     loop: false
//                 });
//                 frame.alpha = 0;
//                 total_score_keeper += 10;
//             } else {
//                 wrong_sound.play({
//                     loop: false
//                 });
//                 frame.setTint(0xFF0000);
//                 this.tweens.add({
//                     targets: frame,
//                     alpha: 1,
//                     yoyo: true,
//                     repeat: 0,
//                     ease: 'Sine.easeInOut'
//                 });
//                 this.cameras.main.shake(300);
//                 total_score_keeper -= 10;
//                 frame.alpha = 0;
//                 // alert("NO");
//             }
//             if (global_tracker == global_denominator) {
//                 complete_sound.play({
//                     loop: false
//                 });
//             }
//         }

//         this.ball_creator();
//     }
// }

const {
    enable3d,
    Scene3D,
    Canvas,
    Cameras,
    THREE,
    ExtendedObject3D,
    FirstPersonControls
} = ENABLE3D

class Level_1 extends Scene3D {
    constructor() {
        super({
            key: 'Level_1'
        })
        this.move = {
            x: 0,
            y: 0,
            z: 0
        }
        this.tile = []
        this.trees = []
        this.targets = []
    }

    postRender() {
        this.third.renderer.setViewport(0, 0, window.innerWidth, window.innerHeight)
        this.third.renderer.render(this.third.scene, this.third.camera)

        this.third.renderer.clearDepth()

        this.third.renderer.setScissorTest(true)
        this.third.renderer.setScissor(50, 50, 150, 100)
        this.third.renderer.setViewport(50, 50, 150, 100)

        this.third.renderer.render(this.third.scene, this.secondCamera)

        this.third.renderer.setScissorTest(false)
    }

    create() {
        this.accessThirdDimension({
            maxSubSteps: 100,
            fixedTimeStep: 1 / 180,
            gravity: {
                x: 0,
                y: -20,
                z: 0
            },
            antialias: true
        })

        this.third.warpSpeed('sky', '-orbitControls')
        this.third.renderer.gammaFactor = 1.5
        this.third.camera.layers.enable(1) // enable layer 1

        const platformMaterial = {
            phong: {
                transparent: true,
                color: 0x21572f
            }
        }
        this.third.physics.add.box({
                name: 'platform-ground',
                y: -0.4,
                width: 100,
                depth: 100,
                height: 1,
                mass: 0
            },
            platformMaterial
        )

        this.third.load.gltf('/assets/3d_pack/Models/gltf/slingshot_teamRed.gltf.glb').then(object => {
            const rifle = object.scene

            this.rifle = new ExtendedObject3D()
            this.rifle.name = 'rifle'
            this.rifle.add(rifle)

            this.third.add.existing(this.rifle)

            this.rifle.traverse(child => {
                if (child.isMesh) {
                    child.layers.set(1) // mesh is in layer 1
                    child.castShadow = child.receiveShadow = true
                    if (child.material) child.material.metalness = 0
                }
            })
        })

        // add red dot
        this.redDot = this.add.circle(this.cameras.main.width / 2, this.cameras.main.height / 2, 4, 0xff0000)
        this.redDot.depth = 1

        // add player
        this.player = new ExtendedObject3D()
        this.player.position.setX(50)
        this.player.position.setY(2)
        this.player.position.setZ(-30)

        // add first person controls
        this.firstPersonControls = new FirstPersonControls(this.third.camera, this.player, {})

        this.level_platforms();

        // lock the pointer and update the first person control
        this.input.on('pointerdown', () => {
            this.input.mouse.requestPointerLock()
        })
        this.input.on('pointermove', pointer => {
            if (this.input.mouse.locked) {
                this.firstPersonControls.update(pointer.movementX, pointer.movementY)
            }
        })
        this.events.on('update', () => {
            this.firstPersonControls.update(0, 0)
        })

        // add keys
        this.keys = {
            w: this.input.keyboard.addKey('w'),
            a: this.input.keyboard.addKey('a'),
            s: this.input.keyboard.addKey('s'),
            d: this.input.keyboard.addKey('d'),
            q: this.input.keyboard.addKey('q'),
            e: this.input.keyboard.addKey('e')
        }
    }

    update(time, delta) {
        if (this.rifle && this.rifle) {
            // some variables
            const zoom = this.input.mousePointer.rightButtonDown()
            const speed = 0.1
            const direction = new THREE.Vector3()
            const rotation = this.third.camera.getWorldDirection(direction)
            const theta = Math.atan2(rotation.x, rotation.z)

            // reset red dot
            this.redDot.alpha = 1

            // the rifle movement
            if (zoom) {
                this.redDot.alpha = 0
                this.move.x = THREE.MathUtils.lerp(this.move.x, 0.6, 0.2)
                this.move.y = THREE.MathUtils.lerp(this.move.y, -0.8 + 1.8, 0.2)
                this.move.z = THREE.MathUtils.lerp(this.move.z, -0.45, 0.2)
            } else if (this.keys.w.isDown) {
                this.move.x = Math.sin(time * -0.015) * 0.075
                this.move.y = Math.sin(time * 0.015) * 0.075
                this.move.z = Math.sin(time * 0.015) * 0.075
            } else {
                this.move.x = Math.sin(time * -0.003) * 0.01
                this.move.y = Math.sin(time * 0.003) * 0.01
                this.move.z = Math.sin(time * 0.003) * 0.01
            }

            // tilt
            if (this.keys.q.isDown) {
                this.third.camera.rotateZ(0.2)
                this.firstPersonControls.offset = new THREE.Vector3(
                    Math.sin(theta + Math.PI * 0.5) * 0.4,
                    0,
                    Math.cos(theta + Math.PI * 0.5) * 0.4
                )
            } else if (this.keys.e.isDown) {
                this.third.camera.rotateZ(-0.2)
                this.firstPersonControls.offset = new THREE.Vector3(
                    Math.sin(theta - Math.PI * 0.5) * 0.4,
                    0,
                    Math.cos(theta - Math.PI * 0.5) * 0.4
                )
            } else {
                this.third.camera.rotateZ(0)
                this.firstPersonControls.offset = new THREE.Vector3(0, 0, 0)
            }

            // adjust the position of the rifle to the camera
            const raycaster = new THREE.Raycaster()
            // x and y are normalized device coordinates from -1 to +1
            raycaster.setFromCamera({
                x: 0.6 - this.move.x,
                y: -0.8 - this.move.y
            }, this.third.camera)
            const pos = new THREE.Vector3()
            pos.copy(raycaster.ray.direction)
            pos.multiplyScalar(0.8 + this.move.z)
            pos.add(raycaster.ray.origin)

            this.rifle.position.copy(pos)
            this.rifle.rotation.copy(this.third.camera.rotation)

            // move forwards and backwards
            if (this.keys.w.isDown) {
                this.player.position.x += Math.sin(theta) * speed
                this.player.position.z += Math.cos(theta) * speed
            } else if (this.keys.s.isDown) {
                this.player.position.x -= Math.sin(theta) * speed
                this.player.position.z -= Math.cos(theta) * speed
            }

            // move sideways
            if (this.keys.a.isDown) {
                this.player.position.x += Math.sin(theta + Math.PI * 0.5) * speed
                this.player.position.z += Math.cos(theta + Math.PI * 0.5) * speed
            } else if (this.keys.d.isDown) {
                this.player.position.x += Math.sin(theta - Math.PI * 0.5) * speed
                this.player.position.z += Math.cos(theta - Math.PI * 0.5) * speed
            }

            // shoot
            if (this.input.mousePointer.leftButtonDown()) {
                const x = 0
                const y = 0
                const force = 5
                const pos = new THREE.Vector3()

                raycaster.setFromCamera({
                    x,
                    y
                }, this.third.camera)

                pos.copy(raycaster.ray.direction)
                pos.add(raycaster.ray.origin)

                const sphere = this.third.physics.add.sphere({
                    radius: 0.05,
                    x: pos.x,
                    y: pos.y,
                    z: pos.z,
                    mass: 5,
                    bufferGeometry: true
                }, {
                    phong: {
                        color: 0x202020
                    }
                })

                pos.copy(raycaster.ray.direction)
                pos.multiplyScalar(24)

                sphere.body.applyForce(pos.x * force, pos.y * force, pos.z * force)
            }
        }
    }

    level_platforms() {
        this.third.load.gltf('./assets/3d_pack/Models/Scenes/Forest_scene.glb').then(object => {
            const scene = object.scenes[0]

            const book = new ExtendedObject3D()
            book.name = 'scene'
            book.add(scene)
            this.third.add.existing(book)

            // add animations
            // sadly only the flags animations works
            object.animations.forEach((anim, i) => {
                book.mixer = this.third.animationMixers.create(book)
                // overwrite the action to be an array of actions
                book.action = []
                book.action[i] = book.mixer.clipAction(anim)
                book.action[i].play()
            })

            book.traverse(child => {
                if (child.isMesh) {
                    child.castShadow = child.receiveShadow = false
                    child.material.metalness = 0
                    child.material.roughness = 1

                    if (/mesh/i.test(child.name)) {
                        this.third.physics.add.existing(child, {
                            shape: 'concave',
                            mass: 0,
                            collisionFlags: 1,
                            autoCenter: false
                        })
                        child.body.setAngularFactor(0, 0, 0)
                        child.body.setLinearFactor(0, 0, 0)
                    }
                }
            })
        })
    }
}