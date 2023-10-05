"use strict";
let canvasWidth = 2000;
let canvasHeight = 800;
let canvas;
let content;
let playerWidth = 104.57;
let playerHeight = 257;
let playerX = 100;
let playerY = canvasHeight - playerHeight;
let player;
let playerImg;
let randomBox = [];
let boxOneWidth = 133.14;
let boxTwoWidth = 133.14;
let boxThreeWidth = 133.14;
let boxHeight = 103.4;
let boxX = 3000;
let boxY = canvasHeight - boxHeight;
let boxOneImg;
let boxTwoImg;
let boxThreeImg;
let collidedImgWidth = 271;
let collidedImgHeight = 319;
let collidedPlayer;
let collidedImg;
let villainHeight = 250.5;
let villainWidth = 192.4;
let villainImg;
let villainX = 3000;
let villainY = canvasHeight - villainHeight;
let speedX = -15;
let speedY = 0;
let gravity = 0.9;
let gameOver = false;
let score = 0;
window.onload = function () {
    canvas = document.getElementById("canvas");
    content = canvas === null || canvas === void 0 ? void 0 : canvas.getContext("2d");
    if (!canvas || !content) {
        console.error("Canvas or context is not available.");
        return;
    }
    loadImages();
    setupGame();
    requestAnimationFrame(load);
    setInterval(loadBox, 1000);
    document.addEventListener("keydown", playerMove);
};
function loadImages() {
    playerImg = new Image();
    playerImg.src = "./img/player.png";
    boxOneImg = new Image();
    boxOneImg.src = "./img/boxes1.png";
    boxTwoImg = new Image();
    boxTwoImg.src = "./img/boxes2.png";
    boxThreeImg = new Image();
    boxThreeImg.src = "./img/boxes3.png";
    villainImg = new Image();
    villainImg.src = "./img/old.png";
    collidedPlayer = {
        width: collidedImgWidth,
        height: collidedImgHeight
    };
}
function setupGame() {
    player = {
        x: playerX,
        y: playerY,
        width: playerWidth,
        height: playerHeight
    };
    gameOver = false;
    score = 0;
}
function load() {
    requestAnimationFrame(load);
    if (gameOver || !content) {
        return;
    }
    content.clearRect(0, 0, canvas.width, canvas.height);
    speedY += gravity;
    if (player) {
        player.y = Math.min(player.y + speedY, playerY);
    }
    content.drawImage(playerImg, ((player === null || player === void 0 ? void 0 : player.x) || 0), ((player === null || player === void 0 ? void 0 : player.y) || 0), ((player === null || player === void 0 ? void 0 : player.width) || 0), ((player === null || player === void 0 ? void 0 : player.height) || 0));
    for (let i = 0; i < randomBox.length; i++) {
        let box = randomBox[i];
        box.x += speedX;
        if (content && box.img) {
            if (box.width !== null) {
                content.drawImage(box.img, box.x, box.y, box.width, box.height);
            }
            else {
                // Handle the case where width is null (if needed)
            }
        }
        if (player && colliding(player, box)) {
            gameOver = true;
            playerImg.src = "./img/collided.png";
            playerImg.onload = function () {
                collidedImg = new Image();
                collidedImg.src = "./img/collided.png";
                if (collidedPlayer) {
                    collidedImg.width = (collidedPlayer.width || 0);
                }
                content === null || content === void 0 ? void 0 : content.drawImage(collidedImg, ((player === null || player === void 0 ? void 0 : player.x) || 0), ((player === null || player === void 0 ? void 0 : player.y) || 0), ((collidedPlayer === null || collidedPlayer === void 0 ? void 0 : collidedPlayer.width) || 0), playerHeight);
            };
        }
    }
    if (content) {
        content.fillStyle = "crimson";
        content.font = "50px MArgarine";
        score++;
        content.fillText(score.toString(), 1550, 150);
    }
}
function playerMove(e) {
    if (gameOver) {
        return;
    }
    if ((e.code == "Space" || e.code == "ArrowUp") && (player === null || player === void 0 ? void 0 : player.y) == playerY) {
        speedY = -25;
    }
    if (e.code == "ArrowRight" && (player === null || player === void 0 ? void 0 : player.x) == playerX) {
        speedY = -5;
    }
}
function loadBox() {
    if (gameOver) {
        return;
    }
    let villain = {
        img: villainImg,
        x: villainX,
        y: villainY,
        width: villainWidth,
        height: villainHeight,
    };
    let box = {
        img: null,
        x: boxX,
        y: boxY,
        width: null,
        height: boxHeight,
    };
    let loadRandomBox = Math.random();
    if (loadRandomBox > 0.80) {
        box.img = boxThreeImg;
        box.width = boxThreeWidth;
        randomBox.push(box);
    }
    else if (loadRandomBox > 0.60) {
        box.img = boxTwoImg;
        box.width = boxTwoWidth;
        randomBox.push(box);
    }
    else if (loadRandomBox > 0.70) {
        box.width = boxOneWidth;
        box.img = boxOneImg;
        randomBox.push(box);
    }
    else if (loadRandomBox > 0.50) {
        randomBox.push(villain);
    }
    if (randomBox.length > 5) {
        randomBox.shift();
    }
}
function colliding(a, b) {
    return (a.x < b.x + (b.width || 0) &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y);
}
