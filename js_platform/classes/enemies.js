
class Enemy extends Sprite {
    constructor({
        position,
        collisionBlocks,
        platformCollisionBlocks,
        imageSrc,
        frameRate,
        scale = 0.5,
        animations,
    }) {
        super({ imageSrc, frameRate, scale });
        this.position = position;
        this.velocity = {
            x: 0,
            y: 1,
        }

        this.collisionBlocks = collisionBlocks;
        this.platformCollisionBlocks = platformCollisionBlocks;

        this.hitbox = {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            width: 10,
            height: 10,
        }

        this.animations = animations;
        this.lastDirection = 'right';

        for (let key in this.animations) {
            const image = new Image();
            image.src = this.animations[key].imageSrc;

            this.animations[key].image = image;
        }d
    }

    switchSprite(key) {
        if (this.image === this.animations[key].image || !this.loaded) return;

        // this.currentFrame = 0;
        this.image = this.animations[key].image;
        this.frameBuffer = this.animations[key].frameBuffer;
        this.frameRate = this.animations[key].frameRate;

    }

    update() {
        this.updateFrames();
        this.updateHitbox();


        this.draw();

        this.position.x += this.velocity.x;
        this.updateHitbox();
        this.checkForHorizontalCollisions();
        this.applyGravity();
        this.updateHitbox();
        this.checkForVerticalCollisions();
    }

    checkForHorizontalCanvasCollision() {
        if (
            this.hitbox.position.x + this.hitbox.width + this.velocity.x >= 576 ||
            this.hitbox.position.x + this.velocity.x <= 0
        ) {
            this.velocity.x = 0;
        }
    }

    updateHitbox() {
        this.hitbox = {
            position: {
                x: this.position.x + 35,
                y: this.position.y + 26,
            },
            width: 14,
            height: 27,
        }
    }

    checkForHorizontalCollisions() {
        for (let i = 0; i < this.collisionBlocks.length; i++) {
            const collisionBlock = this.collisionBlocks[i];

            if (
                collision({
                    object1: this.hitbox,
                    object2: collisionBlock,
                })
            ) {
                if (this.velocity.x > 0) {
                    this.velocity.x = 0;

                    const offset = this.hitbox.position.x - this.position.x + this.hitbox.width;

                    this.position.x = collisionBlock.position.x - offset - 0.01;
                    break;
                }

                if (this.velocity.x < 0) {
                    this.velocity.x = 0;

                    const offset = this.hitbox.position.x - this.position.x;

                    this.position.x = collisionBlock.position.x + collisionBlock.width - offset + 0.01;
                    break;
                }
            }
        }
    }

    applyGravity() {
        this.velocity.y += gravity;
        this.position.y += this.velocity.y;
    }

    checkForVerticalCollisions() {
        for (let i = 0; i < this.collisionBlocks.length; i++) {
            const collisionBlock = this.collisionBlocks[i];

            if (
                collision({
                    object1: this.hitbox,
                    object2: collisionBlock,
                })
            ) {
                if (this.velocity.y > 0) {
                    this.velocity.y = 0;

                    const offset = this.hitbox.position.y - this.position.y + this.hitbox.height;

                    this.position.y = collisionBlock.position.y - offset - 0.01;
                    break;
                }

                if (this.velocity.y < 0) {
                    this.velocity.y = 0;

                    const offset = this.hitbox.position.y - this.position.y;

                    this.position.y = collisionBlock.position.y + collisionBlock.height - offset + 0.01;
                    break;
                }
            }
        }

        //Platform Collision Blocks
        for (let i = 0; i < this.platformCollisionBlocks.length; i++) {
            const platformCollisionBlock = this.platformCollisionBlocks[i];

            if (
                platformCollision({
                    object1: this.hitbox,
                    object2: platformCollisionBlock,
                })
            ) {
                if (this.velocity.y > 0) {
                    this.velocity.y = 0;

                    const offset = this.hitbox.position.y - this.position.y + this.hitbox.height;

                    this.position.y = platformCollisionBlock.position.y - offset - 0.01;
                    break;
                }
            }
        }
    }
}
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
        this.width = this.spriteWidth * .5;
        this.height = this.spriteHeight * .5;

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
        this.width = this.spriteWidth * .25;
        this.height = this.spriteHeight * .25;

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
        ctx.moveTo(this.x + this.width * .5, 0);
        ctx.lineTo(this.x + this.width * .5, this.y + 10);
        ctx.stroke();
        super.draw(ctx);
    }
}
