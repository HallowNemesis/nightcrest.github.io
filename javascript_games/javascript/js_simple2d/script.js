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
    c.drawImage(image, -750, -650);
    c.drawImage(playerImage, canvas.width / 2 - playerImage.width / 2, canvas.height / 2 - playerImage.height / 2);

}