/*Title: Fractions Game
Author: Resolute Education (Viren Pathre)
Date:22/7/22*/

var questions_array = [];
const DEG_RAD = Math.PI / 180;
const RAD_DEG = 180 / Math.PI;


class Questions {
    constructor(numerator, denominator, asked) {
        this.numerator = numerator;
        this.denominator = denominator;
        this.asked = asked;
    }


    getRandomQuestion() {
        let send = questions_array[Math.floor(Math.random() * (questions_array.length - 1 - 0 + 1) + 0)];
        while (send.asked == true) {
            send = questions_array[Math.floor(Math.random() * (questions_array.length - 1 - 0 + 1) + 0)];
        }
        return [send.question, send.answer];
    }
}

// populate array with 200 questions that can be recycled and rearranged
function initializeArray() {
    for (let i = 0; i < 200; i++) {
        let temp0 = rand_interval(1, 8);
        let temp1 = rand_interval(temp0, 10);
        questions_array.push(new Questions(temp0, temp1, false));
    }
}


function rand_interval(begin, end) {
    return Math.floor(Math.random() * (end - begin + 1) + begin);
}

initializeArray();

function load1() {
    //set configuration for the scene
    var config = {
        type: Phaser.AUTO,
        width: 750,
        height: 600,
        audio: {
            disableWebAudio: true
        },
        physics: {
            default: 'matter',
            arcade: {
                debug: true,
                gravity: {
                    y: 300
                }
            },
            matter: {
                debug: false,
                gravity: {
                    y: 0.8
                }
            }
        },
        scene: [Level_1]
        // scene: [Level_2]
        // scene: [Level_3]
    };
    //start new game scene
    const gameScene = new Phaser.Game(config);
}

function load2() {
    //set configuration for the scene
    var config = {
        type: Phaser.AUTO,
        width: 750,
        height: 600,
        audio: {
            disableWebAudio: true
        },
        physics: {
            default: 'matter',
            arcade: {
                debug: true,
                gravity: {
                    y: 300
                }
            },
            matter: {
                debug: false,
                gravity: {
                    y: 0.8
                }
            }
        },
        scene: [Level_2]
    };
    //start new game scene
    const gameScene = new Phaser.Game(config);
}

function load3() {
    //set configuration for the scene
    var config = {
        type: Phaser.AUTO,
        width: 750,
        height: 600,
        audio: {
            disableWebAudio: true
        },
        physics: {
            default: 'matter',
            arcade: {
                debug: true,
                gravity: {
                    y: 300
                }
            },
            matter: {
                debug: false,
                gravity: {
                    y: 0.8
                }
            }
        },
        scene: [Level_3]
    };
    //start new game scene
    const gameScene = new Phaser.Game(config);
}