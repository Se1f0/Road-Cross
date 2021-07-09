var config = {
    type: Phaser.AUTO,
    width: 832,
    height: 832,
    physics: {
        default: 'arcade',
        arcade: {
            
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var colided = false;
var crosswalks;
var player;
var roads;
var dirts;
var cars;
var game = new Phaser.Game(config);
function preload ()
{
    this.load.image('dirt', 'assets/Ground/dirt.png');
    this.load.image('road', 'assets/Ground/SideRoad.png');
    this.load.image('road2', 'assets/Ground/MidRoad.png');
    this.load.image('road3', 'assets/Ground/Intersection.png');
    this.load.image('car1','assets/Cars/blue.png');
    this.load.image('car2','assets/Cars/green.png');
    this.load.image('car3','assets/Cars/red.png');
    this.load.image('car4','assets/Cars/white.png');
    this.load.spritesheet('player', 'assets/Player/Player.png', { frameWidth: 77, frameHeight: 77 });
}

function create ()
{
    dirts = this.physics.add.staticGroup();
    roads = this.physics.add.staticGroup();
    cars = this.physics.add.group();

    for (let i = 64; i < 832; i+=64) {
        roads.create(384,i,'road2');
    }
    for (let i = 32; i < 832; i+=64) {
        for (let j = 32; j < 832; j+=64) {
            if (i !== 352 && i !== 416) {
                if (j === 160 || j === 480) {
                    roads.create(i,j,'road');        
                }
                else {
                    dirts.create(i,j,'dirt');
                }
            }
            if ( ((i === 352 || i === 416) && ( j === 160 || j === 480)) ) {
                roads.create(i,j,'road3');
            }
        }
    }

    let car1 = this.physics.add.sprite(32,480,'car1');
    car1.name = "car1";
    cars.add(car1);

    let car2 = this.physics.add.sprite(352,32,'car2');
    car2.name = "car2";
    cars.add(car2);

    let car3 = this.physics.add.sprite(800,160,'car3');
    car3.name = "car3";
    cars.add(car3);

    let car4 = this.physics.add.sprite(416,800,'car4');
    car4.name = "car4";
    cars.add(car4);

    cars.children.iterate(function (child) {
        if (child.name === 'car1') {
            child.setVelocityX(getRndInteger(250,800));
        }
        if (child.name === 'car2') {
            child.setVelocityY(getRndInteger(250,800));
        }
        if (child.name === 'car3') {
            child.setVelocityX(-getRndInteger(250,800));
        }
        if (child.name === 'car4') {
            child.setVelocityY(-getRndInteger(250,800));
        }
    });
}

function update ()
{
    cars.children.iterate(function (child) {
        respawn(child);
    });
}

function respawn(child) {
    if ( child.name === 'car1' && child.x > 864) {
        child.x = -32;
        child.setVelocityX(getRndInteger(250,800));
    }
    if ( child.name === 'car2' && child.y > 864) {
        child.setVelocityY(getRndInteger(250,800));
        child.y = -32;
    }
    if ( child.name === 'car3' && child.x < -32) {
        child.setVelocityX(-getRndInteger(250,800));
        child.x = 864;
    }
    if ( child.name === 'car4' && child.y < -32) {
        child.setVelocityY(-getRndInteger(250,800));
        child.y = 864;
    }
}

function getRndInteger(min, max) {
    let t = Math.floor(Math.random() * (max - min + 1) ) + min;
    t = Math.floor(t / 60) * 60;
    return t;
}