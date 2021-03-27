const gameState = { score: 0}
let highscore = 0
let hasForceField = 0;

//////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////

class StartScreen extends Phaser.Scene {
    constructor() {
        super(
            {
                key: "StartScreen"
            }
        )
    }
    preload() {
        this.load.audio("yankeeDoodle", "./images/yankeeDoodle.mp3")
        this.load.image("bg1", "./images/trumpRemovesMask.jpg")
        this.load.image("rules1", "./images/trumpControls1.jpg")
        this.load.image("rules2", "./images/rules2.jpg")
    }
    create(){
        gameState.gameOver = false;
        gameState.startscreenMusic = this.sound.add("yankeeDoodle", {volume: 1})
        gameState.startscreenMusic.loop = true
        if(gameState.music2){
            gameState.music2.stop();
        }
        gameState.startscreenMusic.play();
        let bg = this.add.sprite(0,0,"bg1")
        let rules1 = this.add.sprite(-210,0,"rules1").setScale(1.4)
        rules1.setOrigin(0,0)
        rules1.visible = false
        let rules2 = this.add.sprite(-210,0,"rules2").setScale(1.4)
        rules2.setOrigin(0,0)
        rules2.visible = false
        bg.setOrigin(0,0)

        gameState.next1 = this.add.text(250,600, "NEXT", {fontSize: "50px", fill:"#ff0000", backgroundColor: "#000099"})
        gameState.next1.setInteractive();
        gameState.next1.visible = false

        gameState.playgame = this.add.text(250,600, "PLAY", {fontSize: "50px", fill:"#ff0000", backgroundColor: "#000099"})
        gameState.playgame.setInteractive();
        gameState.playgame.visible = false

        gameState.highscore = this.add.text(55, 370, `Highscore: ${highscore}`, {fontSize: "30px"})
        gameState.instructions = this.add.text(55,470, "Instructions", {fontSize: "30px", fill:"#ffffff"})
        gameState.start = this.add.text(55,570, "Click to Start", {fontSize: "30px", fill:"#ffffff"})
        gameState.start.setInteractive();
        gameState.instructions.setInteractive();
        gameState.start.on("pointerdown", () => {
            this.scene.stop("StartScreen")
            this.scene.start("Game")
        })
        gameState.instructions.on("pointerdown", () => {
            bg.visible = false  
            rules1.visible = true
            gameState.highscore.visible = false
            gameState.start.visible = false
            gameState.instructions.visible = false
            gameState.next1.visible = true
            gameState.next1.on("pointerdown", () => {
                rules1.visible = false
                rules2.visible = true
                gameState.next1.visible = false;
                gameState.playgame.visible = true;
            })
        })
        gameState.playgame.on("pointerdown", () => {
            gameState.startscreenMusic.stop();
            this.scene.stop("StartScreen")
            this.scene.start("Game")
        })
    }
}

class Game extends Phaser.Scene {
    constructor() {
        super(
            {
                key: "Game"
            }
        )
    }
    
    preload() {
        gameState.loading = this.add.text(190,200, "Loading...", { fontSize: '41px', fill: '#ffffff' })
        this.load.image('virus', "./images/rsz_virus.png")
        this.load.image("trump", "./images/rsz_trump.png")
        this.load.image('blueFlare', "./images/blueFlare.png");
        this.load.image('redFlare', "./images/redFlare.png");
        this.load.audio("theme", "./images/anthem2.mp3")
        this.load.audio("end", "./images/anthemEnd.mp3")
        this.load.image("bg", "./images/trumpbackground.jpg")
        this.load.image("hat", "./images/hat.png")
        this.load.image("clorox", "./images/clorox.png")
        this.load.audio("universe", "./images/beAJudge.mp3")
        this.load.audio("firework1", "./images/fireworkOne.mp3")
        this.load.audio("firework2", "./images/fireworkTwo.mp3")
        this.load.audio("firework3", "./images/fireworkThree.mp3")
        this.load.audio("forceField", "./images/forceField.mp3")
        this.load.audio("explosion", "./images/explosion.mp3")
        this.load.audio("jetEngine", "./images/jetEngine.mp3")    
    }
    create() {
        gameState.gameOver = false;
        if(gameState.startscreenMusic) {
            gameState.startscreenMusic.stop();
        }
        gameState.int1;
        gameState.int2;
        gameState.int3;
        gameState.arrOfIntervals = []
        gameState.loading.destroy();
        gameState.cursors = this.input.keyboard.createCursorKeys();
        gameState.trump = this.physics.add.sprite(290,400,"trump").setScale(0.6)
        gameState.trump.body.width = 100
        gameState.trump.body.height = 100
        gameState.trump.depth = 1
        gameState.trump.setCollideWorldBounds(true)
        gameState.trump.setSize(50,50)
        gameState.trump.body.bounce.set(0.01)
        gameState.trump.visible = true
        gameState.trump.scaleX = 0.6
        gameState.trump.scaleY = 0.6

    
        var blueParticles = this.add.particles("blueFlare")
        var redParticles = this.add.particles("redFlare")
        var shape1 = new Phaser.Geom.Circle(0,0,35)
    
        gameState.jetEngine = this.sound.add("jetEngine", {volume: 0.2})
        gameState.explosion = this.sound.add("explosion", {volume: 0.3})
        gameState.universe = this.sound.add("universe")
        gameState.firework = this.sound.add("firework1")
        gameState.firework2 = this.sound.add("firework2")
        gameState.firework3 = this.sound.add("firework3")
        gameState.forceField = this.sound.add("forceField", {volume: 1.2})
        let fireWorkArr = [gameState.firework, gameState.firework2, gameState.firework3]
        gameState.music = this.sound.add("theme", {volume: 0.09})
        gameState.music2 = this.sound.add("end", {volume: 0.11})
        gameState.music.play();
    
        gameState.bg = this.add.sprite(290,350,"bg").setScale(0.4)
        gameState.bg.depth = -1
    
        gameState.scoreText = this.add.text(240, 670, 'Score: 0', { fontSize: '20px', fill: '#ffffff' });
        gameState.scoreText.depth = 0.5
    
        gameState.clorox = this.physics.add.group()
        gameState.hats = this.physics.add.group()
        gameState.viruses = this.physics.add.group();

    
        function callFirework() {
            let randnum = Math.floor(Math.random() * 3)
            fireWorkArr[randnum].play();
        }
    
    
        //// COLLIDERS /////
        this.physics.add.collider(gameState.trump, gameState.hats, () => {
            callFirework();
            gameState.hats.clear(true);
            gameState.score += 500
            gameState.emitter4.emitParticleAt(gameState.trump.x, gameState.trump.y)
    
        })
    
        this.physics.add.collider(gameState.trump, gameState.clorox, () => {
            if (hasForceField === 1) {
                gameState.clorox.clear(true)
                gameState.viruses.clear(true);
                emitter5.emitParticleAt(gameState.trump.x, gameState.trump.y)
                gameState.explosion.play();
                gameState.score += 500
            } else {
            gameState.clorox.clear(true)
            hasForceField = 1;
            emitter3.on = true
            gameState.forceField.play();
            }
        })
    
    
        this.physics.add.collider(gameState.trump, gameState.viruses, () => {
            if (hasForceField === 1) {
                gameState.viruses.clear(true);
                emitter3.on = 0
                hasForceField = 0;
                gameState.forceField.stop();
                emitter5.emitParticleAt(gameState.trump.x, gameState.trump.y)
                gameState.explosion.play();
            } else {
                if (gameState.score > 10000) {
                    gameState.universe.play();
                } 
    
                    gameState.music.stop();
                    gameState.music2.play();
                    this.physics.pause();
                    virusLoop.destroy();
                    virusLoop2.destroy();
                    hatLoop.destroy();
                    cloroxloop.destroy();
                    clearInterval();
                    clearInterval(gameState.int1)
                    clearInterval(gameState.int2)
                    clearInterval(gameState.int3)
                    gameState.restart = this.add.text(212, 200, 'Click to Restart', { fontSize: '17px', fill: '#2565AE', backgroundColor: "#ff0000" })
                    this.add.text(212, 15, `Score: ${gameState.score}`, { fontSize: '27px', fill: '#ffffff', backgroundColor: "#000000"});
                    gameState.scoreText.style.color = "#000000"
                    for (let i=0; i<gameState.arrOfIntervals.length; i++) {
                        clearInterval(gameState.arrOfIntervals[i])
                    }
                    this.input.on("pointerup", () => {
                        gameState.score = 0
                        gameState.music2.stop();
                        this.scene.stop("Game")
                        this.scene.start("StartScreen")
                    })
                    if (gameState.score > highscore) {
                        highscore = gameState.score
                    }
                    gameState.gameOver = true;
                }
            }
        )
    
        //// EVENT LISTENERS ////
        this.input.keyboard.on("keydown_UP", () => {
            gameState.jetEngine.play();
        })
    
        this.input.keyboard.on("keyup_UP", () => {
            gameState.jetEngine.stop();
        })
    
        //// VIRUS CREATION ////
        function virusGeneration() {
            let xCoord = Math.random() * 600
            gameState.viruses.create(xCoord, 10, "virus").setScale(0.5)
        }
    
        function multiply() {
            gameState.int1 = setInterval(virusGeneration, 1550)
            gameState.arrOfIntervals.push(gameState.int1)
        }
        function multiply2() {
            gameState.int2 = setInterval(virusGeneration, 1150)
            gameState.arrOfIntervals.push(gameState.int2)
        }
        function multiply3() {
            gameState.int3 = setInterval(virusGeneration, 1200)
            gameState.arrOfIntervals.push(gameState.int3)
        }
    
        multiply()
        multiply2()
        multiply3()
    
        let virusLoop = this.time.addEvent(
            {   
                delay: 11000,
                callback: multiply,
                callbackScope: this,
                loop: true,
            }
        )
    
        let virusLoop2 = this.time.addEvent(
            {   
                delay: 14000,
                callback: multiply2,
                callbackScope: this,
                loop: true,
            }
        )
    
        /// HAT CREATION /// 
        function summonHat() {
            let xVar = ((Math.random() * 500) + 50)
            let yVar = ((Math.random() * 150) + 50)
            gameState.hats.create(xVar,yVar,"hat").setScale(0.18).setVelocityX(Math.random() * 200 - 100).setVelocityY(-30)
    
        }
    
        let hatLoop = this.time.addEvent(
            {
                delay: 3000,
                callback: summonHat,
                callbackScope: this,
                loop: true
    
            }
        )
        
        /// CLOROX CREATOR
        function summonClorox() {
            let xVar = ((Math.random() * 500) + 50)
            let yVar = (Math.random() * 50)
            gameState.clorox.create(xVar,yVar,"clorox").setScale(0.04).setVelocityX(Math.random() * 300 - 150).setVelocityY(175)
    
        }
    
        let cloroxloop = this.time.addEvent(
            {
                delay: 17000,
                callback: summonClorox,
                callbackScope: this,
                loop: true,
            }
        )
    
    
        /// emitters
        var emitter = blueParticles.createEmitter(
            {
            lifespan: 400,
            x: -5,
            speed: { min: 200, max: 400 },
            angle: 90,
            gravityY: 300,
            scale: { start: 0.3, end: 0 },
            quantity: 2,
            blendMode: "ADD",
            follow: gameState.trump
        }
        );
        var emitter2 = redParticles.createEmitter(
            {
            lifespan: 400,
            x: +5,
            speed: { min: 200, max: 400 },
            angle: 90,
            gravityY: 300,
            scale: { start: 0.3, end: 0 },
            quantity: 2,
            blendMode: "ADD",
            follow: gameState.trump
        }
        );
        var emitter3 = blueParticles.createEmitter(
            {
                lifespan: 300,
                speed: 200,
                gravity: 300,
                scale: { start: 0.15, end: 0 },
                quantity: 10,
                emitZone: { type: 'edge', source: shape1, quantity: 48, yoyo: false },
                blendMode: "ADD",
                follow: gameState.trump,
                on: false,
            }
        )
        gameState.emitter4 = redParticles.createEmitter(
            {
                angle: { min: 0, max: 360, steps: 32 },
                lifespan: 1000,
                speed: 400,
                quantity: 32,
                scale: { start: 0.3, end: 0 },
                follow: gameState.trump,
                on: false,
            }
        )
        var emitter5 = blueParticles.createEmitter(
            {
                angle: { min: 0, max: 360, steps: 32 },
                lifespan: 150,
                speed: 2300,
                quantity: 500,
                scale: { start: 0.5, end: 0 },
                follow: gameState.trump,
                on: false,
            }
        )
    
    }
    update() {
        if(gameState.cursors.left.isDown) {
            gameState.trump.setVelocityX(-240)
        } else if(gameState.cursors.right.isDown) {
            gameState.trump.setVelocityX(240)
        } else {
            gameState.trump.setVelocityX(0)
        }
        if(gameState.cursors.up.isDown) {
            gameState.trump.setVelocityY(-160)
        } if (gameState.cursors.down.isDown) {
            gameState.trump.setVelocityY(+200)
        }
        gameState.score += 1
        gameState.scoreText.setText(`Score: ${gameState.score}`);

        if (gameState.gameOver === true && gameState.trump.scaleX <= 1.35) {
            setTimeout(() => {
                gameState.trump.scaleX += 0.01
                gameState.trump.scaleY += 0.01
            }, 800)
        }
        if (gameState.gameOver === true) {
            gameState.emitter4.emitParticleAt(gameState.trump.x, gameState.trump.y)
        
        }
    }
    
}


//////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////

const config = {
    type: Phaser.AUTO,
    width: 600,
    height: 700,
    backgroundColor: "000000",
    physics: {
        default: "arcade",
        arcade: {
            gravity: {y: 200},
            enableBody: true,
        },
        p2: {
            gravity: {y: 0},
            enableBody: true,
        }
    },
    scene: [
        StartScreen,
        Game,
    ],


}
//////////////////////////////////////////////////////////////////////////

const theGame = new Phaser.Game(config)