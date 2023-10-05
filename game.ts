let canvasWidth: number = 2000;
let canvasHeight: number = 800;
let canvas: HTMLCanvasElement | null;
let content: CanvasRenderingContext2D | null;

let playerWidth: number = 104.57;
let playerHeight: number = 257;
let playerX: number = 100;
let playerY: number = canvasHeight - playerHeight;
let player: {
    x: number;
    y: number;
    width: number;
    height: number;
} | null;
let playerImg: HTMLImageElement;

let randomBox: {
    img: HTMLImageElement | null;
    x: number;
    y: number;
    width: number | null;
    height: number;
}[] = [];
let boxOneWidth: number = 133.14;
let boxTwoWidth: number = 133.14;
let boxThreeWidth: number = 133.14;
let boxHeight: number = 103.4;
let boxX: number = 3000;
let boxY: number = canvasHeight - boxHeight;
let boxOneImg: HTMLImageElement;
let boxTwoImg: HTMLImageElement;
let boxThreeImg: HTMLImageElement;

let collidedImgWidth: number = 271;
let collidedImgHeight: number = 319;
let collidedPlayer: {
    width: number | null;
    height: number;
} | null;
let collidedImg: HTMLImageElement;

let villainHeight: number = 250.5;
let villainWidth: number = 192.4;
let villainImg: HTMLImageElement;
let villainX: number = 3000;
let villainY: number = canvasHeight - villainHeight;

let speedX: number = -15;
let speedY: number = 0;
let gravity: number = 0.9;
let gameOver: boolean = false;
let score: number = 0;

window.onload = function () {
    canvas = document.getElementById("canvas") as HTMLCanvasElement;
    content = canvas?.getContext("2d");
    
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

    content.clearRect(0, 0, canvas!.width, canvas!.height);

    speedY += gravity;
    if (player) {
        player.y = Math.min(player.y + speedY, playerY);
    }

    content.drawImage(
        playerImg,
        (player?.x || 0) as number,
        (player?.y || 0) as number,
        (player?.width || 0) as number,
        (player?.height || 0) as number
    );

    for (let i = 0; i < randomBox.length; i++) {
        let box = randomBox[i];
        box.x += speedX;
        if (content && box.img) {
            if (box.width !== null) {
                content.drawImage(box.img, box.x, box.y, box.width, box.height);
            } else {
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
                    collidedImg.width = (collidedPlayer.width || 0) as number;
                }
                content?.drawImage(
                    collidedImg,
                    (player?.x || 0) as number,
                    (player?.y || 0) as number,
                    (collidedPlayer?.width || 0) as number,
                    playerHeight
                );
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

function playerMove(e: KeyboardEvent) {
    if (gameOver) {
        return;
    }
    if ((e.code == "Space" || e.code == "ArrowUp") && player?.y == playerY) {
        speedY = -25;
    }
    if (e.code == "ArrowRight" && player?.x == playerX) {
        speedY = -5;
    }
}

function loadBox() {
    if (gameOver) {
        return;
    }

    let villain: {
        img: HTMLImageElement;
        x: number;
        y: number;
        width: number;
        height: number;
    } = {
        img: villainImg,
        x: villainX,
        y: villainY,
        width: villainWidth,
        height: villainHeight,
    };

    let box: {
        img: HTMLImageElement | null;
        x: number;
        y: number;
        width: number | null;
        height: number;
    } = {
        img: null,
        x: boxX,
        y: boxY,
        width: null,
        height: boxHeight,
    };

    let loadRandomBox: number = Math.random();

    if (loadRandomBox > 0.80) {
        box.img = boxThreeImg;
        box.width = boxThreeWidth;
        randomBox.push(box);
    } else if (loadRandomBox > 0.60) {
        box.img = boxTwoImg;
        box.width = boxTwoWidth;
        randomBox.push(box);
    } else if (loadRandomBox > 0.70) {
        box.width = boxOneWidth;
        box.img = boxOneImg;
        randomBox.push(box);
    } else if (loadRandomBox > 0.50) {
        randomBox.push(villain);
    }

    if (randomBox.length > 5) {
        randomBox.shift();
    }
}

function colliding(
    a: { x: number; y: number; width: number; height: number },
    b: { x: number; y: number; width: number | null; height: number }
): boolean {
    return (
        a.x < b.x + (b.width || 0) &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}
