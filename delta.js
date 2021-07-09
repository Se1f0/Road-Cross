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

var inters1 = new Set();
var inters2 = new Set();

var car1Inter = 0;
var car2Inter = 0;
var car3Inter = 0;
var car4Inter = 0;

var crosswalks;
var intersections;
var player;
var coin;
var roads;
var dirts;
var cars;
var game = new Phaser.Game(config);
var cursors;
var direction;
var moving = false;
var score = 0;
var scoreText;

var speed1 = getRndInteger(200,800);
var speed2 = getRndInteger(200,800);
var speed3 = getRndInteger(200,800);
var speed4 = getRndInteger(200,800);

function preload ()
{
    this.load.image('dirt', 'assets/Ground/grass.png');
    this.load.image('road', 'assets/Ground/SideRoad.png');
    this.load.image('road2', 'assets/Ground/MidRoad.png');
    this.load.image('road3', 'assets/Ground/Intersection.png');
    this.load.image('corssS', 'assets/Ground/CrossSide.png');
    this.load.image('corssM', 'assets/Ground/CrossMid.png');
    this.load.image('car1','assets/Cars/blue.png');
    this.load.image('car2','assets/Cars/green.png');
    this.load.image('car3','assets/Cars/red.png');
    this.load.image('car4','assets/Cars/white.png');
    this.load.spritesheet('player', 'assets/Player/Player.png', { frameWidth: 77, frameHeight: 77 });
    this.load.spritesheet('coin', 'assets/Coins/spr_coin_roj.png', { frameWidth: 16, frameHeight: 16 });
}

function create ()
{
    coins = this.physics.add.staticGroup();
    crosswalks = this.physics.add.staticGroup();
    dirts = this.physics.add.staticGroup();
    roads = this.physics.add.staticGroup();
    cars = this.physics.add.group();
    intersections = this.physics.add.staticGroup();

    for (let i = 64; i < 832; i+=128) {
        if (i !== 192) {
            roads.create(384,i,'road2');   
        }
        else {
            crosswalks.create(352,224,'corssM');
            crosswalks.create(416,224,'corssM');
        }
    }
    crosswalks.create(352,800,'corssM');
    crosswalks.create(416,800,'corssM');
    for (let i = 32; i < 832; i+=64) {
        for (let j = 32; j < 832; j+=64) {
            if (i !== 352 && i !== 416) {
                if (j === 160 || j === 480) {
                    if (j === 160) {
                        if (i === 224 || i === 672) {
                            crosswalks.create(i,j,'corssS');
                        }
                        else {
                            roads.create(i,j,'road');
                        }
                    }
                    if (j === 480) {
                        if (i === 96 || i === 544) {
                            crosswalks.create(i,j,'corssS');   
                        }
                        else {
                            roads.create(i,j,'road');
                        }
                    }
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
    car1.body.setSize(32,32);
    car1.name = "car1";
    cars.add(car1);

    let car2 = this.physics.add.sprite(352,32,'car2');
    car2.body.setSize(32,32);
    car2.name = "car2";
    cars.add(car2);

    let car3 = this.physics.add.sprite(800,160,'car3');
    car3.body.setSize(32,32);
    car3.name = "car3";
    cars.add(car3);

    let car4 = this.physics.add.sprite(416,800,'car4');
    car4.body.setSize(32,32);
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

    player = this.physics.add.sprite(32, 32, 'player').setScale(0.61,0.61);
    player.setCollideWorldBounds(true);

    coins.create(96,96,'coin').setScale(1.5,1.5);

    this.anims.create({
        key: 'flip',
        frames: this.anims.generateFrameNumbers('coin', { start: 0, end: 3 }),
        frameRate: 15,
        repeat: -1
    });
    
    this.anims.create({
        key: 'down',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 7 }),
        frameRate: 15,
        repeat: -1
    });

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('player', { start: 8, end: 15 }),
        frameRate: 15,
        repeat: -1
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('player', { start: 16, end: 23 }),
        frameRate: 15,
        repeat: -1
    });

    this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('player', { start: 24, end: 31 }),
        frameRate: 15,
        repeat: -1
    });

    this.anims.create({
        key: 'idle_up',
        frames: [ { key: 'player', frame: 24 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'idle_down',
        frames: [ { key: 'player', frame: 0 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'idle_right',
        frames: [ { key: 'player', frame: 16 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'idle_left',
        frames: [ { key: 'player', frame: 8 } ],
        frameRate: 20
    });

    cursors = this.input.keyboard.createCursorKeys();

    this.physics.add.collider(player,roads);
    this.physics.add.overlap(player,cars,gameOver,null,this);
    this.physics.add.overlap(player,coins,coinHit,null,this);
    this.physics.add.collider(player,intersections);
    //this.physics.add.collider(cars,cars,wiz,null,this);

    scoreText = this.add.text(640, 800, 'Score: 0', { fontSize: '32px', fill: 'white' });
}

function update ()
{
    
    coins.children.iterate(function (child) {
        child.anims.play('flip',true);
    });

    cars.children.iterate(function (child) {
        respawn(child);
        atIntersection(child);
        mutexInter1(child);
        mutexInter2(child);
    });
    manageInters();
    if (cursors.left.isDown)
    {
        player.setVelocityX(-150);

        player.anims.play('left', true);

        direction = 2;
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(150);

        player.anims.play('right', true);

        direction = 3;
    }
    else if (cursors.down.isDown)
    {
        player.setVelocityY(150);

        player.anims.play('down',true);

        direction = 1;
    }
    else if (cursors.up.isDown)
    {
        player.setVelocityY(-150);
        player.anims.play('up',true);
        direction = 4;
    }
    else {
        player.setVelocity(0,0);
        switch (direction) {
            case 1:
                player.anims.play('idle_down',true);
                break;
            case 2:
                player.anims.play('idle_left',true);
                break;
            case 3:
                player.anims.play('idle_right',true);
                break;
            case 4:
                player.anims.play('idle_up',true);
                break;  
            default:
                break;
        }
    }
}

function coinHit(player,coin) {
    coin.disableBody(true,true);
    score += 10;
    scoreText.setText('Score: ' + score)
    var r1 = Math.floor(Math.random() * (6 - 1 + 1) ) + 1;
    console.log(r1);
    var x,y;
    switch (r1) {
        case 1:
            x =  Math.floor(Math.random() * (288 - 32 + 1) ) + 32;
            y =  Math.floor(Math.random() * (64 - 32 + 1) ) + 32;
            break;
        case 2:
            x =  Math.floor(Math.random() * (800 - 448 + 1) ) + 448;
            y =  Math.floor(Math.random() * (64 - 32 + 1) ) + 32;
            break;
        case 3:
            x =  Math.floor(Math.random() * (288 - 32 + 1) ) + 32;
            y =  Math.floor(Math.random() * (416 - 224 + 1) ) + 224;
            break;
        case 4:
            x =  Math.floor(Math.random() * (800 - 448 + 1) ) + 448;
            y =  Math.floor(Math.random() * (416 - 224 + 1) ) + 224;
            break;
        case 5:
            x =  Math.floor(Math.random() * (288 - 32 + 1) ) + 32;
            y =  Math.floor(Math.random() * (800 - 544 + 1) ) + 544;
            break;
        case 6:
            x =  Math.floor(Math.random() * (800 - 448 + 1) ) + 448;
            y =  Math.floor(Math.random() * (800 - 544 + 1) ) + 544;
            break;
        default:
            break;
    }
    coins.children.iterate(function (child) {

        child.enableBody(true, x, y, true, true);

    });
    //coin.enableBody(true,256,380,true,true);
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

function gameOver() {
    this.physics.pause();
    player.setTint(0xff0000);
    this.input.keyboard.enabled = false;
}