const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillStyle = 'white';
c.fillRect(0, 0, canvas.width, canvas.height);

const image = new Image();
image.src = '/gameimgs/backgrounds/simple2d/Pellet Town.png';

const playerImage = new Image();
playerImage.src = '/gameimgs/backgrounds/simple2d/playerDown.png';


image.onload = () => {
    c.drawImage(image, -785, -650);
    c.drawImage(playerImage, 0, 0, playerImage.width / 4, playerImage.height, canvas.width / 2 - playerImage.width / 4 / 2, canvas.height /2 - playerImage.height /2,
    playerImage.width/4, playerImage.height);
}

window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'w':
            break;
        case 'a':
            break;
        case 'a':
            break;
        case 'd':
            break;
    }
});