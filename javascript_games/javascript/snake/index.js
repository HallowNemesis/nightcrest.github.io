const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highscoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls");

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 10;
let snakeBody = [];
let velocityX = 0, velocityY = 0;
let setIntervalId;
let score = 0;
let highscore = localStorage.getItem("high-score") || 0;
highscoreElement.innerText = `High Score: ${highscore}`;
const changeFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

const changeDirection = (e) => {

    if ((e.key === "ArrowUp" || e.key === "w") && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if ((e.key === "ArrowDown"  || e.key === "s") && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if ((e.key === "ArrowLeft"  || e.key === "a")&& velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if ((e.key === "ArrowRight"  || e.key === "d") && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

controls.forEach(key =>{
    key.addEventListener("click", () => changeDirection({key: key.dataset.key}));
});


const handleGameOver = () => {
    clearInterval(setIntervalId);
    alert("Game Over... Press Okay to retry");
    location.reload();
}

const initGame = () => {
    if (gameOver) return handleGameOver();
    let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX} "></div>`;

    if (snakeX === foodX && snakeY === foodY) {
        changeFoodPosition();
        snakeBody.push([foodX, foodY]);
        score++;

        highscore = score >= highscore ? score : highscore;
        localStorage.setItem("high-score", highscore);
        scoreElement.innerText = `Score: ${score}`;
        highscoreElement.innerText = `High Score: ${highscore}`;

    }

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }

    snakeBody[0] = [snakeX, snakeY];

    snakeX += velocityX;
    snakeY += velocityY;

    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        gameOver = true;
    }

    for (let i = 0; i < snakeBody.length; i++) {
        htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]} "></div>`;

        if(i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]){
            gameOver = true;
        }
    }

    playBoard.innerHTML = htmlMarkup;
}
changeFoodPosition();
setIntervalId = setInterval(initGame, 125);
document.addEventListener("keydown", changeDirection);