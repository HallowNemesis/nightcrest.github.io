/** @type {HTMLCanvasElement} */
const dropdown = document.getElementById('animations');
dropdown.addEventListener('change', function (e) {
    playerState = e.target.value;
})

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 1080;
const CANVAS_HEIGHT = canvas.height = 720;
let canvasPosition = canvas.getBoundingClientRect();
console.log(canvasPosition);

let gameSpeed = .5;

//Background Images
const backgroundLayer1 = new Image();
const backgroundLayer2 = new Image();
const backgroundLayer3 = new Image();
const backgroundLayer4 = new Image();
const backgroundLayer5 = new Image();

backgroundLayer1.src = 'gameimgs/backgrounds/layer-1.png';
backgroundLayer2.src = 'gameimgs/backgrounds/layer-2.png';
backgroundLayer3.src = 'gameimgs/backgrounds/layer-3.png';
backgroundLayer4.src = 'gameimgs/backgrounds/layer-4.png';
backgroundLayer5.src = 'gameimgs/backgrounds/layer-5.png';


//RUNS THE GAME ONLY WHEN EVERYTHING LOADS

window.addEventListener('load', function () {

    const slider = document.getElementById('slider');
    slider.value = gameSpeed;
    const showGameSpeed = document.getElementById('showGameSpeed');
    showGameSpeed.innerHTML = gameSpeed;
    slider.addEventListener('input', function (e) {
        gameSpeed = e.target.value;
        showGameSpeed.innerHTML = e.target.value;
    });

    class Layer {
        constructor(image, speedModifier) {
            this.x = 0;
            this.y = 0;
            this.width = 2400;
            this.height = 700;
            this.image = image;
            this.speedModifier = speedModifier;
            this.speed = gameSpeed * this.speedModifier;
        }

        update(deltaTime) {
            this.speed = gameSpeed * this.speedModifier;
            if (this.x <= -this.width) {
                this.x = 0;
            }
            this.x = this.x - this.speed;
        }
        draw(ctx) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
            ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height)
        }
    }

    const layer1 = new Layer(backgroundLayer1, 0.2);
    const layer2 = new Layer(backgroundLayer2, 0.4);
    const layer3 = new Layer(backgroundLayer3, 0.6);
    const layer4 = new Layer(backgroundLayer4, 0.8);
    const layer5 = new Layer(backgroundLayer5, 1);
    const explosions = [];


    class Game {
        constructor(ctx, width, height) {
            this.ctx = ctx;
            this.width = width;
            this.height = height;
            this.explosions = explosions;
            this.gameObjects = [layer1, layer2, layer3, layer4, layer5];
            this.player = new Player(this);
            this.enemies = [];
            this.enemyInterval = 500;
            this.enemyTimer = 0;
            this.enemyTypes = ['worm', 'ghost', 'spider'];
        }
        update(deltaTime) {
            //Backgrounds
            this.gameObjects.forEach(object => object.update(deltaTime));

            this.player.update(deltaTime);

            this.enemies = this.enemies.filter(object => !object.markedForDeletion);
            if (this.enemyTimer > this.enemyInterval) {
                this.#addNewEnemy();
                this.enemyTimer = 0;
            } else {
                this.enemyTimer += deltaTime;
            }
            this.enemies.forEach(object => object.update(deltaTime));


            for(let i = 0; i < this.explosions.length; i++){
                this.explosions[i].update();
            }


        }
        draw() {
            //backgrounds
            this.gameObjects.forEach(object => object.draw(this.ctx));

            //Player
            this.player.draw(this.ctx);

            //enemies
            this.enemies.forEach(object => object.draw(this.ctx));

            //Explosions
            this.explosions.forEach(object => object.draw());
            // for(let i = 0; i < this.explosions.length; i++){
            //     this.explosions[i].draw();
            // }

        }

        #addNewEnemy() {
            const randomEnemy = this.enemyTypes[Math.floor(Math.random() * this.enemyTypes.length)];
            if (randomEnemy == 'worm') this.enemies.push(new Worm(this));
            if (randomEnemy == 'ghost') this.enemies.push(new Ghost(this));
            if (randomEnemy == 'spider') this.enemies.push(new Spider(this));

            this.enemies.sort(function (a, b) {
                return a.y - b.y;
            });
        }

        
    }

    window.addEventListener('click', function(e){
        let positionX = e.x - canvasPosition.left;
        let positionY = e.y - canvasPosition.top;
        explosions.push(new Explosion(positionX, positionY));
    });


    class Player {
        constructor(game) {
            this.game = game;
            this.markedForDeletion = false;
            this.frameX = 0;
            this.frameY = 3;
            this.maxFrame = 6;
            this.frameInterval = 100;
            this.frameTimer = 0;

            this.spriteWidth = 575;
            this.spriteHeight = 523;
            this.width = this.spriteWidth*.25;
            this.height = this.spriteHeight*.25;

            this.x = this.game.width;
            this.y = this.game.height - this.height - 135;

            this.image = new Image();
            this.image.src = "gameimgs/entities/shadow_dog.png";
            this.vx = Math.random() * 0.1 + 0.1;

            //Player Animations
            this.staggerFrames = 10;
            this.spriteAnimations = [];
            this.animationStates = [];
            this.playerState = 'idle';

            // this.animationInit();
        }

        update(deltaTime) {
            this.x -= this.vx * deltaTime;
            if (this.x < 0 - this.width) this.markedForDeletion = true;

            if (this.frameTimer > this.frameInterval) {
                if (this.frameX < this.maxFrame) this.frameX++;
                else this.frameX = 0;
                this.frameTimer = 0;
            } else {
                this.frameTimer += deltaTime;
            }

            // let position = Math.floor(deltaTime/this.staggerFrames) % this.spriteAnimations[playerState].loc.length;
            //  this.frameX = spriteWidth * position;
            //  this.frameY = spriteAnimations[playerState].loc[position].y;
      
        }
        draw(ctx) {
            ctx.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
        }


        // animationInit() {
        //             //Player Animations
        //             this.animationStates = [
        //                 {
        //                     name: 'idle',
        //                     frames: 7,
        //                 },
        //                 {
        //                     name: 'jump',
        //                     frames: 7,
        //                 },
        //                 {
        //                     name: 'fall',
        //                     frames: 7,
        //                 },
        //                 {
        //                     name: 'run',
        //                     frames: 9,
        //                 },
        //                 {
        //                     name: 'dizzy',
        //                     frames: 11,
        //                 },
        //                 {
        //                     name: 'sit',
        //                     frames: 5,
        //                 },
        //                 {
        //                     name: 'roll',
        //                     frames: 7,
        //                 },
        //                 {
        //                     name: 'bite',
        //                     frames: 7,
        //                 },
        //                 {
        //                     name: 'ko',
        //                     frames: 12,
        //                 },
        //                 {
        //                     name: 'gethit',
        //                     frames: 4,
        //                 }
        
        //             ];
        
        //             this.animationStates.forEach((state, index) => {
        //                 let frames = {
        //                     loc: [],
        //                 }
        //                 for (let j = 0; j < state.frames; j++) {
        //                     let positionX = j * spriteWidth;
        //                     let positionY = index * spriteHeight;
        //                     frames.loc.push({ x: positionX, y: positionY });
        //                 }
        //                 this.spriteAnimations[state.name] = frames;
        //         });
        // }      
    }

    //Enemies
    class Enemy {
        constructor(game) {
            this.game = game;
            this.markedForDeletion = false;
            this.frameX = 0;
            this.maxFrame = 5;
            this.frameInterval = 5000;
            this.frameTimer = 0;

        }
        update(deltaTime) {
            this.x -= this.vx * deltaTime;
            if (this.x < 0 - this.width) this.markedForDeletion = true;

            if (this.frameTimer > this.frameInterval) {
                if (this.frameX < this.maxFrame) this.frameX++;
                else this.frameX = 0;
                this.frameTimer = 0;
            } else {
                this.frameTimer += deltaTime;
            }
        }
        draw(ctx) {
            ctx.drawImage(this.image, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
        }

    };

    class Worm extends Enemy {
        constructor() {
            super(game);
            this.spriteWidth = 80;
            this.spriteHeight = 60;
            this.width = this.spriteWidth;
            this.height = this.spriteHeight;

            this.x = this.game.width;
            this.y = this.game.height - this.height - 135;

            this.image = new Image();
            this.image.src = "gameimgs/entities/worm.png";
            this.vx = Math.random() * 0.1 + 0.1;
        }
    }

    class Ghost extends Enemy {
        constructor() {
            super(game);
            this.spriteWidth = 60;
            this.spriteHeight = 70;
            this.width = this.spriteWidth*.5;
            this.height = this.spriteHeight*.5;

            this.x = this.game.width;
            this.y = Math.random() * this.game.height * 0.6;

            this.image = new Image();
            this.image.src = "gameimgs/entities/ghost4.png";

            this.vx = Math.random() * 0.2 + 0.1;
            this.angle = 0;
            this.curve = Math.random() * 3
        }
        update(deltaTime) {
            super.update(deltaTime);
            this.y += Math.sin(this.angle) * this.curve;
            this.angle += 0.04;
        }
        draw(ctx) {
            ctx.save();
            ctx.globalAlpha = 0.5;
            super.draw(ctx);
            ctx.restore();

        }
    }

    class Spider extends Enemy {
        constructor() {
            super(game);
            this.spriteWidth = 310;
            this.spriteHeight = 175;
            this.width = this.spriteWidth*.25;
            this.height = this.spriteHeight*.25;

            this.x = Math.random() * this.game.width;
            this.y = 0 - this.height;

            this.image = new Image()
            this.image.src = "gameimgs/entities/small_spider.png";

            this.vx = 0;
            this.vy = Math.random() * 0.1 + 0.1;
            this.maxLength = Math.random() * this.game.height;
        }

        update(deltaTime) {
            super.update(deltaTime);
            if (this.y < 0 - this.width * 2) this.markedForDeletion = true;
            this.y += this.vy * deltaTime;
            if (this.y > this.maxLength) this.vy *= -1;
        }

        draw(ctx) {
            ctx.beginPath();
            ctx.moveTo(this.x + this.width*.5, 0);
            ctx.lineTo(this.x + this.width*.5, this.y + 10);
            ctx.stroke();
            super.draw(ctx);
        }
    }

    class Explosion{
        constructor(x,y){
            this.x = x;
            this.y = y;
            this.spriteWidth = 200;
            this.spriteHeight = 179;
            this.width = this.spriteWidth*.5;
            this.height = this.spriteHeight*.5;
            this.image = new Image();
            this.image.src = 'gameimgs/objects/boom.png';
            this.frame = 0;
        }

        update(){
            this.frame++;
        }
        
        draw(ctx){
            ctx.drawImage(this.image, this.spriteWidth * this.frame, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
        }
    }



    const game = new Game(ctx, CANVAS_WIDTH, CANVAS_HEIGHT);
    let lastTime = 1;
    function animate(timeStamp) {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;

        game.update(deltaTime * gameSpeed);
        game.draw();

        requestAnimationFrame(animate);
    };
    animate(0);

});
