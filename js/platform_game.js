/** @type {HTMLCanvasElement} */
let playerState = 'idle';
const dropdown = document.getElementById('animations');
dropdown.addEventListener('change', function(e){
    playerState = e.target.value;
})

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 800;
const CANVAS_HEIGHT = canvas.height = 700;

// PlayerImage
const playerImage = new Image();
playerImage.src = 'gameimgs/entities/shadow_dog.png';
const spriteWidth = 575;
const spriteHeight = 523;

let gameSpeed = 4;

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

window.addEventListener('load', function(){
    
const slider = document.getElementById('slider');
slider.value = gameSpeed;
const showGameSpeed = document.getElementById('showGameSpeed');
showGameSpeed.innerHTML = gameSpeed;
slider.addEventListener('change', function(e){
    gameSpeed = e.target.value;
    showGameSpeed.innerHTML = e.target.value;
});

class Layer{
    constructor(image, speedModifier){
        this.x = 0;
        this.y = 0;
        this.width = 2400;
        this.height = 700;
        this.image = image;
        this.speedModifier = speedModifier
        this.speed = gameSpeed * this.speedModifier;
    }

    update(){
        this.speed = gameSpeed * this.speedModifier;
       if(this.x <= -this.width){
        this.x = 0;
       }
       this.x = this.x - this.speed;
    }
    draw(){
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
        ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height)
    }
}

const layer1 = new Layer(backgroundLayer1, 0.2); 
const layer2 = new Layer(backgroundLayer2, 0.4); 
const layer3 = new Layer(backgroundLayer3, 0.6); 
const layer4 = new Layer(backgroundLayer4, 0.8); 
const layer5 = new Layer(backgroundLayer5, 1);

const gameObjects = [layer1, layer2, layer3, layer4, layer5];


//ENEMIES
const numberOfEnemies = 10;
const enemiesArray = [];

class Enemy{
    constructor(){
        this.image = new Image();
        this.image.src = 'gameimgs/entities/enemy1.png';

       
        // this.speed = Math.random() * 4 - 2;
        this.spriteWidth = 293;
        this.spriteHeight = 155;

        this.width = this.spriteWidth / 2.5;
        this.height = this.spriteHeight / 2.5;
        this.x = Math.random() * (canvas.width - this.width);
        this.y = Math.random() * (canvas.height - this.height);


        this.frame = 0;
        this.flapSpeed = Math.floor(Math.random() * 3 + 1);
    }
    update(){
        this.x += Math.random() * 5 - 2.5;
        this.y += Math.random() * 5 - 2.5;

        //animations
        if(gameFrame % this.flapSpeed === 0){
            this.frame > 4 ? this.frame = 0: this.frame++; 
        }
    }
    draw(){
        ctx.drawImage(this.image, this.frame * this.spriteWidth,0,this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }

};

for(let i = 0; i < numberOfEnemies; i++){
    enemiesArray.push(new Enemy());
}


//Player Animations

let gameFrame = 0;
const staggerFrames = 10;
const spriteAnimations = [];
const animationStates = [
    {
        name: 'idle',
        frames: 7,
    },
    {
        name: 'jump',
        frames: 7,
    },
    {
        name: 'fall',
        frames: 7,
    },
    {
        name: 'run',
        frames: 9,
    },
    {
        name: 'dizzy',
        frames: 11,
    },
    {
        name: 'sit',
        frames: 5,
    },
    {
        name: 'roll',
        frames: 7,
    },
    {
        name: 'bite',
        frames: 7,
    },
    {
        name: 'ko',
        frames: 12,
    },
    {
        name: 'gethit',
        frames: 4,
    }

];

animationStates.forEach((state, index) => {
    let frames = {
        loc: [],
    }
    for( let j = 0; j < state.frames; j++){
        let positionX = j * spriteWidth;
        let positionY = index * spriteHeight;
        frames.loc.push({x: positionX, y: positionY});
    }
    spriteAnimations[state.name] = frames;
});

function animate(){
    ctx.clearRect(0,0, CANVAS_WIDTH, CANVAS_HEIGHT);
    let position = Math.floor(gameFrame/staggerFrames) % spriteAnimations[playerState].loc.length;
    let frameX = spriteWidth * position;
    let frameY = spriteAnimations[playerState].loc[position].y;

    //Backgrounds
    gameObjects.forEach(object => {
        object.update();
        object.draw();
    });

    //Player
    // ctx.drawImage(playerImage, frameX, frameY, spriteWidth, spriteHeight, 0,0, spriteWidth, spriteHeight);

    enemiesArray.forEach(enemies => {
        enemies.update();
        enemies.draw();
    });

    gameFrame++;
    requestAnimationFrame(animate);
};
animate();

});
