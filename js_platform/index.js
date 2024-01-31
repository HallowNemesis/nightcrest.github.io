const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 1080;
const CANVAS_HEIGHT = canvas.height = 900;

const scaledCanvas = {
    width: canvas.width / 4,
    height: canvas.height / 4,
}

const gravity = 0.25;

const floorCollisions2D = [];
for (let i = 0; i < floorCollisions.length; i += 36) {
    floorCollisions2D.push(floorCollisions.slice(i, i + 36));
}

const collisionBlocks = [];
floorCollisions2D.forEach((row, y) => {
    row.forEach((symbol, x) => {
        if (symbol === 202) {
            collisionBlocks.push(new CollisionBlock({
                position: {
                    x: x * 16,
                    y: y * 16,
                },
            })
            )
        }
    })
})

const platformCollisions2D = [];
for (let i = 0; i < platformCollisions.length; i += 36) {
    platformCollisions2D.push(platformCollisions.slice(i, i + 36));
}

const plaftformCollisionBlocks = [];
platformCollisions2D.forEach((row, y) => {
    row.forEach((symbol, x) => {
        if (symbol === 202) {
            plaftformCollisionBlocks.push(new CollisionBlock({
                position: {
                    x: x * 16,
                    y: y * 16,
                },
            })
            )
        }
    })
})

const player = new Player({
    position:{
        x: 50,
        y: 0,
    },
    collisionBlocks,
    imageSrc: 'gameimgs/entities/warrior/Idle.png',
   frameRate: 8,
   animations: {
    Idle: {
        imageSrc: 'gameimgs/entities/warrior/Idle.png',
        frameRate: 8,
        frameBuffer: 3,
    },
    IdleLeft: {
        imageSrc: 'gameimgs/entities/warrior/IdleLeft.png',
        frameRate: 8,
        frameBuffer: 3,
    },
    Run: {
        imageSrc: 'gameimgs/entities/warrior/Run.png',
        frameRate: 8,
        frameBuffer: 7,
    },
    RunLeft: {
        imageSrc: 'gameimgs/entities/warrior/RunLeft.png',
        frameRate: 8,
        frameBuffer: 7,
    },
    Jump: {
        imageSrc: 'gameimgs/entities/warrior/Jump.png',
        frameRate: 2,
        frameBuffer: 5,
    },
//     JumpLeft: {
//         imageSrc: 'gameimgs/entities/warrior/JumpLeft.png',
//         frameRate: 2,
//         frameBuffer: 5,
//     },
//     Fall: {
//         imageSrc: 'gameimgs/entities/warrior/Fall.png',
//         frameRate: 2,
//         frameBuffer: 5,
//     },
//     FallLeft: {
//         imageSrc: 'gameimgs/entities/warrior/FallLeft.png',
//         frameRate: 2,
//         frameBuffer: 5,
//     },
//     Attack1: {
//         imageSrc: 'gameimgs/entities/warrior/Attack1.png',
//         frameRate: 4,
//         frameBuffer: 5,
//     },
//     Attack2: {
//         imageSrc: 'gameimgs/entities/warrior/Attack2.png',
//         frameRate: 4,
//         frameBuffer: 5,
//     },
//     Attack3: {
//         imageSrc: 'gameimgs/entities/warrior/Attack3.png',
//         frameRate: 4,
//         frameBuffer: 5,
//     },
//     Death: {
//         imageSrc: 'gameimgs/entities/warrior/Death.png',
//         frameRate: 6,
//         frameBuffer: 5,
//     },
//     GetHit: {
//         imageSrc: 'gameimgs/entities/warrior/TakeHit.png',
//         frameRate: 4,
//         frameBuffer: 5,
//     },
   }
});

const keys = {
    space: {
        pressed: false,
    },
    w: {
        pressed: false,
    },
    a: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
    s: {
        pressed: false,
    }
}

const defaultBackground = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imageSrc: 'gameimgs/backgrounds/background.png',
})

const layer1 = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imageSrc: 'gameimgs/backgrounds/layer-1.png',
})
const layer2 = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imageSrc: 'gameimgs/backgrounds/layer-2.png',
})
const layer3 = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imageSrc: 'gameimgs/backgrounds/layer-3.png',
})
const layer4 = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imageSrc: 'gameimgs/backgrounds/layer-4.png',
})
const layer5 = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imageSrc: 'gameimgs/backgrounds/layer-5.png',
})
let backgroundArray = [layer1, layer2, layer3, layer4, layer5];
function animate() {
    window.requestAnimationFrame(animate);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // backgroundArray.forEach(object => object.update());
    ctx.save();
    ctx.scale(4, 4);
    ctx.translate(0, -defaultBackground.image.height + scaledCanvas.height);
    defaultBackground.update();
    
    collisionBlocks.forEach((collisionBlock) => {
        collisionBlock.update();
    });

    plaftformCollisionBlocks.forEach((block) => {
        block.update();
    });

    player.update();

    player.velocity.x = 0;

    if (keys.space.pressed || keys.w.pressed) player.velocity.y = -5;
    else if (keys.a.pressed) {
        player.switchSprite('RunLeft');
        player.velocity.x = -1;
        player.lastDirection = 'left';
    }
    else if (keys.s.pressed) player.velocity.y = 0;
    else if (keys.d.pressed) {
        player.switchSprite('Run');
        player.lastDirection = 'right;'
        player.velocity.x = 1;
    }
    else if(player.velocity.y === 0 && player.velocity.x === 0){
        player.switchSprite('Idle');
    }

    // if(player.velocity.y < 0){
    //     player.switchSprite('Jump');
    // } else if(player.velocity.y > 0) {
    //     if(player.lastDirection === 'right') {
    //         player.switchSprite('Fall');
    //     }
    //     else{
    //         player.switchSprite('FallLeft');
    //     }
    // }

    ctx.restore();


}

animate();

window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case ' ':
            keys.space.pressed = true;
            break;
        case 'w':
            keys.w.pressed = true;
            break;
        case 'a':
            keys.a.pressed = true;
            break;
        case 's':
            keys.s.pressed = true;
            break;
        case 'd':
            keys.d.pressed = true;
            break;
    }
});

window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case ' ':
            keys.space.pressed = false;
            break;
        case 'w':
            keys.w.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
        case 's':
            keys.s.pressed = false;
            break;
        case 'd':
            keys.d.pressed = false;
            break;
    }
});