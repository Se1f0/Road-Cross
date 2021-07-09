var config = {
    type: Phaser.AUTO,
    width: 832,
    height: 832,
    physics: {
        default: 'arcade',
        arcade: {
            
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var inters1 = new Set();
var inters2 = new Set();

var car1Inter = 0;
var car2Inter = 0;
var car3Inter = 0;
var car4Inter = 0;

var crosswalks;
var intersections;
var player;
var roads;
var dirts;
var cars;
var game = new Phaser.Game(config);
var cursors;

var speed1 = 660;
var speed2 = 600;
var speed3 = 420;
var speed4 = 300;

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
    intersections = this.physics.add.staticGroup();

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
                intersections.create(i,j,'road3');
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
            child.setVelocityX(speed1);
        }
        if (child.name === 'car2') {
            child.setVelocityY(speed2);
        }
        if (child.name === 'car3') {
            child.setVelocityX(-speed3);
        }
        if (child.name === 'car4') {
            child.setVelocityY(-speed4);
        }
    });
    this.physics.add.overlap(cars,cars,wiz,null,this);

    cursors = this.input.keyboard.createCursorKeys();
}

function update ()
{
    cars.children.iterate(function (child) {
        respawn(child);
        atIntersection(child);
        mutexInter1(child);
        mutexInter2(child);
    });
    manageInters();
}

function wiz(child) {
    this.physics.pause();
    child.setTint(0xff0000);
}

function respawn(child) {
    if ( child.name === 'car1' && child.x > 864) {
        child.x = -32;
        child.setVelocityX(speed1);
    }
    if ( child.name === 'car2' && child.y > 864) {
        child.setVelocityY(speed2);
        child.y = -32;
    }
    if ( child.name === 'car3' && child.x < -32) {
        child.setVelocityX(-speed3);
        child.x = 864;
    }
    if ( child.name === 'car4' && child.y < -32) {
        child.setVelocityY(-speed4);
        child.y = 864;
    }
}

function atIntersection(child) {
    if (child.name === 'car1' && ( (child.x <= 288 + (speed1/60) && child.x >= 288 - (speed1/60))  && child.y === 480) && ( car2Inter === 2 || car4Inter === 2) ) {
        child.setVelocityX(0);
        inters2.add(child.name);
    }

    if (child.name === 'car2' && ( (child.y <= 96 + (speed2/60) && child.y >= 96 - (speed2/60))  && child.x === 352) && (car3Inter === 1) ) {
        child.setVelocityY(0);
        inters1.add(child.name);
    }
    if (child.name === 'car2' && ( (child.y <= 416 + (speed2/60) && child.y >= 416 - (speed2/60))  && child.x === 352) && (car1Inter === 2)) {
        console.log(true);
        child.setVelocityY(0);
        inters2.add(child.name);
    }

    if (child.name === 'car3' && ( (child.x  <= 480 + (speed3/60) && child.x >= 480 - (speed3/60))  && child.y === 160) && ( car2Inter === 1 || car4Inter === 1) ) {
        child.setVelocityX(0);
        inters1.add(child.name);
    }

    if (child.name === 'car4' && ( (child.y <= 544 + (speed4/60) && child.y >= 544 - (speed4/60))  && child.x === 416)) {
        child.setVelocityY(0);
        inters2.add(child.name);
    }
    if (child.name === 'car4' && ( (child.y <= 224 + (speed4/60) && child.y >= 224 - (speed4/60))  && child.x === 416) && (car3Inter === 1)) {
        child.setVelocityY(0);
        inters1.add(child.name);
    }
}

function getRndInteger(min, max) {
    let t = Math.floor(Math.random() * (max - min + 1) ) + min;
    t = Math.floor(t / 60) * 60;
    return t;
}

function lunch(child) {
    if (child.name === 'car1') {
        child.setVelocityX(speed1);
        inters2.delete(child.name);
    }
    if (child.name === 'car3') {
        child.setVelocityX(-speed3);
        inters1.delete(child.name);
    }
    if (child.name === 'car2') {
        child.setVelocityY(speed2);
        if (inters1.has('car2')) {
            inters1.delete('car2');
        }
        if (inters2.has('car2')) {
            inters2.delete('car2');
        }
    }
    if (child.name === 'car4') {
        child.setVelocityY(-speed4);
        if (inters1.has('car4')) {
            inters1.delete('car4');
        }
        if (inters2.has('car4')) {
            inters2.delete('car4');
        }
    }
}

function manageInters() {
    if (inters2.has('car2') || inters2.has('car4')) {
        cars.children.iterate(function (child) {
            if ((child.name === 'car2' || child.name === 'car4') && car1Inter === 0 ) {
                lunch(child);
            }
        });
    }
    else {
        cars.children.iterate(function (child) {
            if (child.name === 'car1') {
                if (car2Inter === 0 && car4Inter === 0) {
                    lunch(child);    
                }
            }
        });
    }
    if (inters1.has('car2') || inters1.has('car4')) {
        cars.children.iterate(function (child) {
            if ((child.name === 'car2' || child.name === 'car4') && car3Inter === 0 ) {
                lunch(child);
            }
        });
    }
    else {
        cars.children.iterate(function (child) {
            if (child.name === 'car3') {
                if (car2Inter === 0 && car4Inter === 0) {
                    lunch(child);    
                }
            }
        });
    }
}
function mutexInter1(child) {
    if ( child.name === 'car3') {
        if ( ((child.x >= 288 && child.x <= 480) && child.y === 160) ) {
            car3Inter = 1;    
        }
        else {
            car3Inter = 0;
        }
        
    }
    if ( child.name === 'car2') {
        if ( ((child.y >= 96 && child.y <= 224) && child.x === 352) ) {
            car2Inter = 1;    
        }
        else {
            car2Inter = 0;
        }
        
    }
    if ( child.name === 'car4') {
        if ( ((child.y >= 96 && child.y <= 224) && child.x === 416)) {
            car4Inter = 1;
        }
        else {
            car4Inter = 0;
        }
    }
}
function mutexInter2(child) {
    if ( child.name === 'car1') {
        if ( ((child.x >= 288 && child.x <= 480) && child.y === 480) ) {
            car1Inter = 2;    
        }
        else {
            car1Inter = 0;
        }
    }
    if ( child.name === 'car2' && car2Inter === 0) {
        if ( ((child.y >= 416 && child.y <= 544) && child.x === 352) ) {
            car2Inter = 2;    
        }
        else {
            car2Inter = 0;
        }
    }
    if ( child.name === 'car4' && car4Inter === 0) {
        if ( ((child.y >= 416 && child.y <= 544) && child.x === 416)) {
            car4Inter = 2;
        }
        else {
            car4Inter = 0;
        }
    }
}