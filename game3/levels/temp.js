let $level = 0;
let $diff = [{
    bars: 0,
    change: 1,
    maxScore: 100,
    maxFr: 14,
    hasAngular: false,
}, {
    bars: 2,
    change: 1,
    maxScore: 120,
    maxFr: 10,
    hasAngular: false,
}, {
    bars: 3,
    change: 1,
    maxScore: 160,
    maxFr: 27,
    hasAngular: true,
}];
let stage = 0;
let $totalScore = 0;
let sound = localStorage.getItem('sound') === '0' ? false : true;
const scores = (score = 0) => {
    let s = localStorage.getItem('scores') || '[]';
    s = JSON.parse(s);
    s.push(score)
    s = s.sort((a, b) => b - a).slice(0, 3);
    localStorage.setItem('scores', JSON.stringify(s));
    return s;
}
localStorage.getItem('scores');
class Result extends Phaser.Scene {
    constructor() {
        super("Result");
    }
    preload() {
        this.matter.world.setBounds();
        this.cameras.main.setBackgroundColor('#39006a');
        this.load.image('spark0', 'game-1/blue.png');
        this.load.image('spark1', 'game-1/red.png');
        this.load.bitmapFont('ice', 'game-1/iceicebaby.png', 'game-1/iceicebaby.xml');
    }
    create() {
        let p0 = new Phaser.Math.Vector2(100, 200);
        let p1 = new Phaser.Math.Vector2(200, 100);
        let p2 = new Phaser.Math.Vector2(300, 100);
        let p3 = new Phaser.Math.Vector2(400, 200);
        let curve = new Phaser.Curves.CubicBezier(p0, p1, p2, p3);
        let max = 10;
        let points = [];
        let tangents = [];
        for (let c = 0; c <= max; c++) {
            let t = curve.getUtoTmapping(c / max);
            points.push(curve.getPoint(t));
            tangents.push(curve.getTangent(t));
        }
        let tempVec = new Phaser.Math.Vector2();
        let spark0 = this.add.particles('spark0');
        let spark1 = this.add.particles('spark1');
        for (let i = 0; i < points.length; i++) {
            let p = points[i];
            tempVec.copy(tangents[i]).normalizeRightHand().scale(-32).add(p);
            let angle = Phaser.Math.RadToDeg(Phaser.Math.Angle.BetweenPoints(p, tempVec));
            let particles = (i % 2 === 0) ? spark0 : spark1;
            particles.createEmitter({
                x: tempVec.x,
                y: tempVec.y,
                angle: angle,
                speed: {
                    min: 10,
                    max: 500
                },
                gravityY: 400,
                scale: {
                    start: 0.5,
                    end: 0
                },
                lifespan: 800,
                blendMode: 'SCREEN'
            });
        }
        let hsv = Phaser.Display.Color.HSVColorWheel();
        let tintedText = this.add.dynamicBitmapText(250, 200, 'ice', '0', 80).setOrigin(0.5);
        let i = 0;
        tintedText.setDisplayCallback(data => {
            data.tint.topLeft = hsv[Math.floor(i)].color;
            data.tint.topRight = hsv[(Math.floor(i) + 200) % 360].color;
            data.tint.bottomLeft = hsv[(Math.floor(i) + 300) % 360].color;
            data.tint.bottomRight = hsv[359 - Math.floor(i)].color;
            i += 0.05;
            if (i >= hsv.length) {
                i = 0;
            }
            return data;
        });
        this.tween = this.tweens.addCounter({
            from: 0,
            to: $totalScore,
            duration: 2000,
            ease: 'Power2',
            onUpdate: (tween) => {
                tintedText.text = (tween.getValue() | 0);
            }
        });
        let text = this.add.text(250, 300, 'Top scores', {
            fontFamily: 'Arial',
            color: '#ff8dff',
        }).setFontSize(34).setOrigin(0.5).setShadow(3, 3, '#000000', 1);
        scores($totalScore).forEach((v, i) => {
            let text2 = this.add.text(250, 380 + i * 50, (i + 1) + ' : ' + v, {
                fontFamily: 'Arial',
                color: '#ff8dff',
            }).setFontSize(28).setOrigin(0.5).setShadow(3, 3, '#000000', 1);
        });
        let css;
        let element = this.add.text(250, 540, 'Play Again', {
            fontFamily: 'Arial',
            color: '#ffffff',
        }).setFontSize(34).setOrigin(0.5);
        element.setInteractive({
            useHandCursor: true
        });
        element.on('pointerdown', (e) => {
            this.scene.start('Intro', {
                again: true
            });
        })
        element.setBlendMode('HUE');
        this.brand();
    }
    brand() {
        let graphics = this.add.graphics();
        graphics.fillGradientStyle(0x000066, 0x000066, 0x000066, 0x000066, 1);
        graphics.fillRect(300 - 5, 0, 175, 20);
        const site = this.add.text(300, 2, 'mathwarehouse.com/games', {
            fontFamily: 'Arial',
            color: 'white',
        }).setFontSize(13);
        site.setInteractive({
            useHandCursor: true
        });
        site.on('pointerdown', () => {
            let win = window.open('http://mathwarehouse.com/games', '_blank');
            win.focus();
        });
    }
}
class Intro extends Phaser.Scene {
    constructor() {
        super("Intro");
    }
    preload() {
        this.matter.world.setBounds();
        this.cameras.main.setBackgroundColor('#39006a');
        this.load.image('keyboard', 'game-1/keyboard.png');
        this.load.image('jar', 'game-1/jar.png');
        this.load.atlas('flares', 'game-1/flares.png', 'game-1/flares.json');
        this.load.audio('start-sound', ['game-1/start-sound.mp3']);
        this.load.audio('congrats', ['game-1/congrats.mp3']);
    }
    create(data) {
        let image = this.add.image(250, 120, 'keyboard');
        image.setScale(0.5);
        image = this.add.image(350, 320, 'jar');
        image.setScale(0.14);
        let text = this.add.text(250, 40, 'Use the Arrow Keys to Move the Fraction Ball', {
            fontFamily: 'Arial',
            color: '#ff8dff',
        }).setFontSize(22).setOrigin(0.5).setShadow(3, 3, '#000000', 1);
        text = this.add.text(250, 210, 'Press Space Bar to Drop a Fraction Ball', {
            fontFamily: 'Arial',
            color: '#ff8dff',
        }).setFontSize(22).setOrigin(0.5).setShadow(3, 3, '#000000', 1);
        text = this.add.text(20, 280, 'Your goal is to guide \nthe Fraction Ball \n' +
            'into the correct container!', {
                fontFamily: 'Arial',
                color: '#ff8dff',
            }).setFontSize(22).setShadow(3, 3, '#000000', 1);
        const levels = [{
            text: 'Play Now',
            color: 'blue',
            y: 480,
            x: 250,
        }, ];
        levels.forEach((l, key) => {
            let lt = this.add.text(l.x, l.y, l.text, {
                fontFamily: 'Arial',
                color: '#ffffff',
            }).setFontSize(28).setOrigin(0.5);
            lt.setInteractive({
                useHandCursor: true
            });
            let particles;
            lt.on('pointerover', (e) => {
                particles = this.add.particles('flares');
                particles.createEmitter({
                    frame: l.color,
                    x: l.x + 80,
                    y: l.y,
                    angle: {
                        min: -10,
                        max: 10
                    },
                    scale: {
                        start: 0.3,
                        end: 0
                    },
                    quantity: 1,
                    speed: {
                        min: -300,
                        max: 300
                    },
                    blendMode: 'ADD',
                    lifespan: 1000
                });
                particles.createEmitter({
                    frame: l.color,
                    x: l.x - 80,
                    y: l.y,
                    angle: {
                        min: 170,
                        max: 190
                    },
                    scale: {
                        start: 0.3,
                        end: 0
                    },
                    quantity: 1,
                    speed: {
                        min: -300,
                        max: 300
                    },
                    blendMode: 'ADD',
                    lifespan: 1000
                });
            });
            lt.on('pointerout', () => {
                particles.destroy();
            });
            lt.on('pointerdown', () => {
                $level = key;
                this.scene.start('Example');
            });
        })
        if (data.again !== true) {
            this.bsound = this.sound.add('start-sound');
            document.onclick = () => {
                this.bsound.isPlaying || this.bsound.play({
                    loop: true
                })
            };
        }
        this.brand();
        this.speaker();
    }
    speaker() {
        const site = this.add.text(50, 470, sound ? '🔈' : '🔇', {
            fontFamily: 'Arial',
            color: 'white',
        }).setFontSize(80);
        site.setInteractive({
            useHandCursor: true
        });
        this.sound.setMute(!sound);
        site.on('pointerdown', () => {
            sound = !sound;
            localStorage.setItem('sound', sound ? '1' : '0');
            site.text = (sound ? '🔈' : '🔇');
            this.sound.setMute(!sound);
        });
    }
    brand() {
        let graphics = this.add.graphics();
        graphics.fillGradientStyle(0x000066, 0x000066, 0x000066, 0x000066, 1);
        graphics.fillRect(300 - 5, 0, 175, 20);
        const site = this.add.text(300, 2, 'mathwarehouse.com/games', {
            fontFamily: 'Arial',
            color: 'white',
        }).setFontSize(13);
        site.setInteractive({
            useHandCursor: true
        });
        site.on('pointerdown', () => {
            let win = window.open('http://mathwarehouse.com/games', '_blank');
            win.focus();
        });
    }
}
class Intro2 extends Phaser.Scene {
    constructor() {
        super("Intro2");
    }
    preload() {
        this.matter.world.setBounds();
        this.load.image('keyboard', 'game-1/keyboard.png');
        this.load.image('jar', 'game-1/jar.png');
        this.load.atlas('flares', 'game-1/flares.png', 'game-1/flares.json');
    }
    create() {
        let graphics = this.add.graphics();
        graphics.fillGradientStyle(0x39006a, 0x39006a, 0x39006a, 0x39006a, 1);
        graphics.fillRect(10, 10, 480, 500);
        let image = this.add.image(250, 120, 'keyboard');
        image.setScale(0.5);
        image = this.add.image(350, 320, 'jar');
        image.setScale(0.14);
        let text = this.add.text(250, 40, 'Use the Arrow Keys to Move the Fraction Ball', {
            fontFamily: 'Arial',
            color: '#ff8dff',
        }).setFontSize(22).setOrigin(0.5).setShadow(3, 3, '#000000', 1);
        text = this.add.text(250, 210, 'Press Space Bar to Drop a Fraction Ball', {
            fontFamily: 'Arial',
            color: '#ff8dff',
        }).setFontSize(22).setOrigin(0.5).setShadow(3, 3, '#000000', 1);
        text = this.add.text(20, 280, 'Your goal is to guide \nthe Fraction Ball \n' +
            'into the correct container!', {
                fontFamily: 'Arial',
                color: '#ff8dff',
            }).setFontSize(22).setShadow(3, 3, '#000000', 1);
        text = this.add.text(250, 430, 'Back', {
            fontFamily: 'Arial',
            color: '#ffffff',
        }).setFontSize(28).setOrigin(0.5).setShadow(3, 3, '#000000', 1);
        text.setInteractive({
            useHandCursor: true
        });
        text.on('pointerdown', () => {
            this.scene.remove();
        });
    }
}
class Example extends Phaser.Scene {
    constructor() {
        super('Example');
        this.stage = 0;
    }
    preload() {
        this.droped = false;
        this.bars = [];
        this.angBars = [];
        this.jars = [];
        this.width = 500;
        this.height = 600;
        this.tqsts = [
            [1, 2],
            [1, 3],
            [1, 4],
            [3, 4],
            [1, 5],
            [2, 5],
            [3, 5],
            [4, 5],
            [1, 6],
            [5, 6],
        ];
        $level = (this.stage / 3) | 0;
        this.qsts = this.tqsts.slice(0, $diff[$level].maxFr).sort(() => 0.5 - Math.random()).slice(0, 4)
        if ((this.stage + 1) % 3 === 0) {
            this.qsts = [...this.qsts.slice(0, 2), [0, Math.random() * 10 | 0 + 1],
                [Math.random() * 10 | 0 + 1, 0]
            ].sort(() => 0.5 - Math.random())
        }
        this.curr = 0;
        this.cursors = this.input.keyboard.createCursorKeys();
        this.input.keyboard.on('keydown_SPACE', () => this.drop());
        this.load.image('fire', 'game-1/muzzleflash3.png');
        this.matter.world.setBounds();
        this.cameras.main.setBackgroundColor('#0000ff');
        this.score = $diff[$level].maxScore;
        this.totalScore = $totalScore;
        this.load.audio('congrats', ['game-1/congrats.mp3']);
        this.load.audio('rocketthrust-buildup', ['game-1/rocketthrust-buildup.mp3']);
    }
    create() {
        this.handler = this.createHandler();
        for (let i = 0; i < $diff[$level].bars; i++) {
            this.bars.push(this.createBar(100 + i * this.width / 3, this.width / 7));
        }
        const jarStep = 400 / (this.qsts.length - 1);
        this.qsts.sort(() => Math.random() - 0.5).forEach((qst, i) => {
            this.jars.push(this.createJar(50 + jarStep * i, qst[1], qst[0]));
        });
        this.qsts.sort(() => Math.random() - 0.5);
        this.installBall();
        let fire = this.add.particles('fire');
        if ($diff[$level].hasAngular) {
            this.angBars.push(this.createAngularBar(100, 370));
            this.angBars.push(this.createAngularBar(250, 370, -1));
            this.angBars.push(this.createAngularBar(400, 370));
        }
        this.matter.world.on('collisionstart', (e, a, b) => {
            if (this.ball.visible && this.ball.y > 550) {
                this.jars.find((jar, i) => {
                    if (Math.abs(this.ball.x - jar.x) < 20) {
                        if (this.ball._divdnt / this.ball._divder === jar._filled / jar._total) {
                            this.curr++;
                            this.runFeedback('+' + this.score, jar.x)
                            this.updateScore();
                            this.sound.add('congrats').play();
                        } else {
                            fire.createEmitter({
                                alpha: {
                                    start: 1,
                                    end: 0
                                },
                                scale: {
                                    start: 0.5,
                                    end: 2.5
                                },
                                speed: 10,
                                accelerationY: -300,
                                angle: {
                                    min: -85,
                                    max: -95
                                },
                                rotate: {
                                    min: -180,
                                    max: 180
                                },
                                lifespan: {
                                    min: 500,
                                    max: 810
                                },
                                blendMode: 'ADD',
                                frequency: 60,
                                maxParticles: 10,
                                x: this.ball.x,
                                y: this.ball.y,
                            });
                            fire.setDepth(400);
                            let ball = this.ball;
                            setTimeout(() => ball.destroy(), 300);
                            this.sound.add('rocketthrust-buildup').play();
                            let old = (this.score);
                            this.tween.seek(Math.min(this.tween.progress + 0.1, 0.9));
                            setTimeout(() => {
                                let newscore = this.score;
                                this.runFeedback(newscore - old, jar.x)
                            }, 100)
                        }
                        this.installBall();
                        return true;
                    }
                })
            }
        });
        this.totalScoreText = this.add.text(20, 20, 'Total Score : ' + this.totalScore, {
            fontFamily: 'Arial',
            color: 'white',
        }).setFontSize(22);
        this.scoreText = this.add.text(20, 60, 'Score : ' + $diff[$level].maxScore, {
            fontFamily: 'Arial',
            color: 'white',
        }).setFontSize(22);
        this.tween = this.tweens.addCounter({
            from: $diff[$level].maxScore * 10,
            to: 10,
            duration: 60000,
            ease: 'Quad',
            onUpdate: (tween) => {
                this.score = (tween.getValue() / 10) | 0;
                this.scoreText.text = 'Score : ' + this.score;
            }
        });
        this.brand();
        this.help();
        this.speaker();
    }
    speaker() {
        const site = this.add.text(475, 40, sound ? '🔈' : '🔇', {
            fontFamily: 'Arial',
            color: 'white',
        }).setFontSize(20);
        site.setInteractive({
            useHandCursor: true
        });
        this.sound.setMute(!sound);
        site.on('pointerdown', () => {
            sound = !sound;
            localStorage.setItem('sound', sound ? '1' : '0');
            site.text = (sound ? '🔈' : '🔇');
            this.sound.setMute(!sound);
        });
    }
    runFeedback(text, x, y = 470) {
        this.feedback = this.add.text(-200, 200, text, {
            fontFamily: 'Arial',
            color: 'white',
        }).setFontSize(22);
        let key = (Math.random() * 10e20).toString(34);
        let texture = this.textures.addCanvas(key, this.feedback.canvas);
        this.partFeedback = this.add.particles(key);
        this.partFeedback.createEmitter({
            x: x,
            y: y,
            angle: -90,
            scale: {
                start: 1,
                end: 0.5
            },
            alpha: {
                start: 1,
                end: 0
            },
            quantity: 1,
            maxParticles: 1,
            accelerationY: {
                min: -100,
                max: -80
            },
            blendMode: 'ADD',
            lifespan: 1000,
        });
    }
    help() {
        let graphics = this.add.graphics();
        graphics.fillGradientStyle(0x000066, 0x000066, 0x000066, 0x000066, 1);
        graphics.fillRect(475, 0, 20, 30);
        const site = this.add.text(480, 5, '?', {
            fontFamily: 'Arial',
            color: 'white',
        }).setFontSize(17);
        site.setInteractive({
            useHandCursor: true
        });
        site.on('pointerdown', () => {
            this.scene.add('Intro2', Intro2, true, {
                hideLevel: true
            });
        });
    }
    brand() {
        let graphics = this.add.graphics();
        graphics.fillGradientStyle(0x000066, 0x000066, 0x000066, 0x000066, 1);
        graphics.fillRect(300 - 5, 0, 175, 20);
        const site = this.add.text(300, 2, 'mathwarehouse.com/games', {
            fontFamily: 'Arial',
            color: 'white',
        }).setFontSize(13);
        site.setInteractive({
            useHandCursor: true
        });
        site.on('pointerdown', () => {
            let win = window.open('http://mathwarehouse.com/games', '_blank');
            win.focus();
        });
    }
    updateScore() {
        if (this.curr > this.qsts.length) {
            return;
        }
        this.tween2 = this.tweens.addCounter({
            from: this.totalScore,
            to: this.totalScore + this.score,
            duration: 1000,
            ease: 'Quad',
            onUpdate: (tween) => {
                const value = tween.getValue() | 0;
                this.totalScoreText.text = 'Total Score : ' + (value);
            }
        });
        this.totalScore += this.score;
        $totalScore = this.totalScore;
        if (this.curr >= this.qsts.length) {
            this.stage++;
            if (this.stage >= 9) {
                this.stage = 0;
                this.scene.start('Result');
            } else {
                setTimeout(() => {
                    this.scene.restart();
                }, 200)
            }
            return;
        }
        this.tween.restart();
    }
    update() {
        if (this.ball.visible) {
            this.ball.body.force.x = (this.cursors.right.isDown - this.cursors.left.isDown) * 0.0015;
            this.ball.body.force.y = (this.cursors.down.isDown - this.cursors.up.isDown) * 0.0022;
        }
        if (!this.droped) {
            this.rope.setTo(this.ball.x, this.ball.y, this.handler.x, this.handler.y)
            this.ball.setAngularVelocity(0.05);
        }
        this.bars.forEach(b => b.y = 240)
        this.angBars.forEach(b => b.y = 370)
        this.angBars.forEach((b, i) => b.x = 100 + 150 * i)
    }
    installBall() {
        if (this.curr >= this.qsts.length) {
            return;
        }
        this.droped = false;
        this.ball = this.createBall(...this.qsts[this.curr]);
        this.join = this.matter.add.joint(this.handler, this.ball, 100, 1);
        this.rope = this.drawRope();
    }
    createBall(dividentValue, dividerValue) {
        [dividerValue, dividentValue] = this.change(dividerValue, dividentValue, 30);
        let circle = this.add.circle(0, 0, 22, 0x00ffff);
        let divident = this.add.text(0, 0, dividentValue, {
            fontFamily: 'Arial',
            color: 'darkblue',
        }).setFontSize(22).setOrigin(0.5, 1);
        let dash = this.add.text(0, 0, '___', {
            fontFamily: 'Arial',
            color: 'darkblue',
        }).setFontSize(22).setOrigin(0.5, 0.9);
        let divider = this.add.text(0, 0, dividerValue, {
            fontFamily: 'Arial',
            color: 'darkblue ',
        }).setFontSize(22).setOrigin(0.5, 0);
        let container = this.add.container(300, 25, [circle, divident, dash, divider]).setSize(50, 50);
        circle.strokeColor = 0xa900ff;
        circle.lineWidth = 4;
        circle.isStroked = true;
        container.setDepth(213);
        this.matter.add.gameObject(container);
        container.setMass(12);
        container.setCircle();
        container.setBounce(0.3);
        container.setFrictionAir(-0.005);
        container._divdnt = dividentValue;
        container._divder = dividerValue;
        return container;
    }
    createHandler() {
        let rect = this.add.rectangle(this.width / 2, 25, 60, 50, {});
        rect.fillColor = 0x000066;
        this.matter.add.gameObject(rect, {
            isStatic: true
        });
        return rect;
    }
    drawRope() {
        let rope = this.add.line(100, 100, 300, 0, 500, 200, 0x00ffff)
        return rope;
    }
    drop() {
        if (this.droped)
            return;
        this.matter.world.removeConstraint(this.join);
        this.join = null;
        this.rope.destroy();
        this.rope = null;
        this.ball.setFrictionAir(0.02);
        this.droped = true;
    }
    createBar(x, width) {
        const rect = this.add.rectangle(x, 200, width, 10, 10);
        rect.fillColor = 0x7f7fff;
        rect.strokeColor = 0x9696ff;
        rect.isStroked = true;
        rect.ignoreDestroy = true;
        this.matter.add.gameObject(rect);
        rect.body.ignoreGravity = true;
        rect.setVelocityX(2.1);
        rect.setFixedRotation();
        rect.setMass(12e12);
        rect.setFriction(0, 0, 0);
        rect.setBounce(1);
        rect.setFrictionAir(0);
        return rect;
    }
    createAngularBar(x, y, dir = 1) {
        const rect = this.add.rectangle(x, y, 100, 10, 10);
        rect.fillColor = 0x7f7fff;
        rect.strokeColor = 0x9696ff;
        rect.isStroked = true;
        rect.ignoreDestroy = true;
        this.matter.add.gameObject(rect);
        rect.body.ignoreGravity = true;
        rect.setAngularVelocity(0.02 * dir);
        rect.setMass(12e12);
        rect.setFriction(0, 0, 0);
        rect.setBounce(1);
        rect.setFrictionAir(0);
        return rect;
    }
    createJar(x, total, filled) {
        [total, filled] = this.change(total, filled, 12);
        const points = '0 0 0 100 100 100 100 0 90 0 90 90 10 90 10 0';
        const poly = this.add.polygon(x, 565, points.split(' '), 0x110e3c, 1);
        this.matter.add.gameObject(poly, {
            isStatic: true,
            shape: {
                type: 'fromVerts',
                verts: points
            }
        });
        poly.strokeColor = 0x442cfa;
        poly.strokeAlpha = 1;
        poly.isStroked = true;
        const theight = 90;
        const twidth = 84;
        const xstart = x - 1;
        const uhight = theight / total;
        const ystart = 503;
        poly.rects = [];
        let graphics = this.add.graphics();
        if (total === 0) {
            graphics.fillGradientStyle(0x442cfa, 0x2200b5, 0x442cfa, 0x2200b5, 1);
            graphics.fillRect(xstart - twidth / 2, ystart, twidth / 2, theight);
            graphics.fillGradientStyle(0x2200b5, 0x442cfa, 0x2200b5, 0x442cfa, 1);
            graphics.fillRect(xstart, ystart, twidth / 2, theight);
            graphics.setDepth(-22);
            this.add.text(xstart, ystart + theight / 2, '?', {
                fontFamily: 'Arial',
                color: '#77ff77',
            }).setFontSize(60).setOrigin(0.5).setShadow(0, 0, '#000000', 3);;
            this.add.text(xstart, ystart + theight / 2, 'Undefined', {
                fontFamily: 'Arial',
                color: '#77ff77',
            }).setFontSize(18).setOrigin(0.5).setShadow(1, 1, '#000000', 3);;
        }
        for (let i = 0; i < total; i++) {
            if (i >= total - filled) {
                graphics.fillGradientStyle(0x191450, 0x3e379b, 0x191450, 0x3e379b, 1);
                graphics.fillRect(xstart - twidth / 2, ystart + i * uhight, twidth / 2, uhight);
                graphics.fillGradientStyle(0x3e379b, 0x191450, 0x3e379b, 0x191450, 1);
                graphics.fillRect(xstart, ystart + i * uhight, twidth / 2, uhight);
            } else {
                graphics.fillGradientStyle(0x2200b5, 0x442cfa, 0x2200b5, 0x442cfa, 1);
                graphics.fillRect(xstart - twidth / 2, ystart + i * uhight, twidth / 2, uhight);
                graphics.fillGradientStyle(0x442cfa, 0x2200b5, 0x442cfa, 0x2200b5, 1);
                graphics.fillRect(xstart, ystart + i * uhight, twidth / 2, uhight);
            }
            graphics.setDepth(-22);
            const rect = this.add.rectangle(xstart, (ystart + uhight / 2) + i * uhight, twidth, uhight, {});
            rect.fillColor = i >= total - filled ? 0x241a7f : 0x330fe6;
            rect.fillAlpha = 0;
            rect.strokeColor = 0xffffff;
            rect.strokeAlpha = 1;
            rect.isStroked = true;
            rect.lineWidth = 1;
            rect.setDepth(-2);
            rect.setInteractive();
            rect.on('pointermove', (e) => {
                this.drawPopover(e.x, e.y, total - i);
            });
            rect.on('pointerout', () => {
                this.popover.destroy();
            });
            poly.rects.push(rect);
        }
        poly._filled = filled;
        poly._total = total;
        return poly;
    }
    drawPopover(x, y, text) {
        if (this.popover && this.popover.visible) {
            if (this.popover.list[1]._text == text) {
                this.popover.x = x;
                this.popover.y = y - 14;
                return;
            }
            this.popover.destroy();
        }
        let label = this.add.text(0, 0, text, {
            fontFamily: 'Arial',
            color: 'white',
        }).setFontSize(22).setOrigin(0, 0.5);
        let rect = this.add.rectangle(0, 0, 0, 25, {});
        rect.width = label.width;
        rect.fillColor = 0xcf004f;
        this.popover = this.add.container(x, y - 14, [rect, label]).setSize(rect.width, 50);
    }
    change(t, f, max = 12) {
        let rand = parseInt($diff[$level].change * Math.random()) + 1;
        const fac = parseInt(t ? max / t : max);
        rand = Math.min(rand, fac);
        return [t * rand, f * rand];
    }
}
let config = {
    type: Phaser.AUTO,
    physics: {
        default: 'matter',
        matter: {
            gravity: {
                y: 1
            },
            frictionAir: 0,
        }
    },
    scale: {
        parent: 'fraction-balls-1',
        width: 500,
        height: 600
    },
    dom: {
        createContainer: true
    },
    scene: [Intro, Result, Example, ]
};
let game = new Phaser.Game(config);