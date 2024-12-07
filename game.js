// 1. Constants first
const GOAL_WIDTH = 20;
const GOAL_HEIGHT = 150;
const SCORE_DISPLAY_SIZE = '24px';

// 2. Classes
class Kirby {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 30;
        this.speed = 5;
        this.floating = false;
        this.velocityY = 0;
        this.gravity = 0.5;
    }

    draw(ctx) {
        // Draw Kirby's body (pink circle)
        ctx.beginPath();
        ctx.fillStyle = '#FFB6C1';
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw Kirby's eyes
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.ellipse(this.x - 8, this.y - 10, 5, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(this.x + 8, this.y - 10, 5, 8, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    update() {
        if (!this.floating) {
            this.velocityY += this.gravity;
        } else {
            this.velocityY = -3;
        }

        this.y += this.velocityY;

        if (this.y > canvas.height - this.radius) {
            this.y = canvas.height - this.radius;
            this.velocityY = 0;
        }
        if (this.y < this.radius) {
            this.y = this.radius;
            this.velocityY = 0;
        }
    }
}

class WaddleDee {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 30;
        this.speed = 5;
        this.floating = false;
        this.velocityY = 0;
        this.gravity = 0.5;
    }

    draw(ctx) {
        // Main body (tan/orange circle)
        ctx.beginPath();
        ctx.fillStyle = '#FFA07A';
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // Bandana (blue)
        ctx.beginPath();
        ctx.fillStyle = '#4169E1';
        ctx.arc(this.x, this.y - 5, this.radius/1.5, Math.PI, 2 * Math.PI);
        ctx.fill();
        
        // Bandana tails
        ctx.beginPath();
        ctx.moveTo(this.x - 15, this.y - 5);
        ctx.lineTo(this.x - 35, this.y - 15);
        ctx.lineTo(this.x - 30, this.y);
        ctx.fillStyle = '#4169E1';
        ctx.fill();

        // Eyes
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(this.x - 8, this.y - 10, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + 8, this.y - 10, 4, 0, Math.PI * 2);
        ctx.fill();
    }

    update() {
        if (!this.floating) {
            this.velocityY += this.gravity;
        } else {
            this.velocityY = -3;
        }

        this.y += this.velocityY;

        if (this.y > canvas.height - this.radius) {
            this.y = canvas.height - this.radius;
            this.velocityY = 0;
        }
        if (this.y < this.radius) {
            this.y = this.radius;
            this.velocityY = 0;
        }
    }
}

class Ball {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 15;
        this.velocityX = 0;
        this.velocityY = 0;
        this.gravity = 0.5;
        this.friction = 0.99;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'black';
        ctx.stroke();

        // Soccer ball pattern
        ctx.beginPath();
        ctx.moveTo(this.x - this.radius/2, this.y);
        ctx.lineTo(this.x + this.radius/2, this.y);
        ctx.moveTo(this.x, this.y - this.radius/2);
        ctx.lineTo(this.x, this.y + this.radius/2);
        ctx.stroke();

        for(let i = 0; i < 5; i++) {
            const angle = (i * 72) * Math.PI / 180;
            ctx.beginPath();
            ctx.arc(
                this.x + Math.cos(angle) * this.radius/2,
                this.y + Math.sin(angle) * this.radius/2,
                this.radius/4,
                0,
                Math.PI * 2
            );
            ctx.stroke();
        }
    }

    update() {
        this.velocityY += this.gravity;
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        this.velocityX *= this.friction;
        this.velocityY *= this.friction;

        if (this.x < this.radius || this.x > canvas.width - this.radius) {
            this.velocityX *= -0.8;
            this.x = this.x < this.radius ? this.radius : canvas.width - this.radius;
        }

        if (this.y > canvas.height - this.radius || this.y < this.radius) {
            this.velocityY *= -0.8;
            this.y = this.y > canvas.height - this.radius ? 
                     canvas.height - this.radius : 
                     this.radius;
        }

        if (isNaN(this.x) || isNaN(this.y) || 
            this.x < 0 || this.x > canvas.width || 
            this.y < 0 || this.y > canvas.height) {
            this.resetPosition();
        }
    }

    resetPosition() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.velocityX = 0;
        this.velocityY = 0;
    }
}

class Goal {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw(ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeStyle = '#000000';
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }

    checkGoal(ball) {
        return ball.x > this.x && 
               ball.x < this.x + this.width && 
               ball.y > this.y && 
               ball.y < this.y + this.height;
    }
}

// 3. Canvas and game objects setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let player1Score = 0;
let player2Score = 0;

const kirby = new Kirby(400, 300);
const waddleDee = new WaddleDee(200, 300);
const ball = new Ball(200, 100);
const leftGoal = new Goal(0, canvas.height/2 - GOAL_HEIGHT/2, GOAL_WIDTH, GOAL_HEIGHT);
const rightGoal = new Goal(canvas.width - GOAL_WIDTH, canvas.height/2 - GOAL_HEIGHT/2, GOAL_WIDTH, GOAL_HEIGHT);

// 4. Input handling
const keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (e.key === ' ') kirby.floating = true;
    if (e.key === 'Shift') waddleDee.floating = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
    if (e.key === ' ') kirby.floating = false;
    if (e.key === 'Shift') waddleDee.floating = false;
});

// 5. Helper functions
function checkCollision(character, ball) {
    const dx = character.x - ball.x;
    const dy = character.y - ball.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < character.radius + ball.radius) {
        const angle = Math.atan2(dy, dx);
        const speed = Math.sqrt(ball.velocityX * ball.velocityX + ball.velocityY * ball.velocityY);
        
        ball.velocityX = -Math.cos(angle) * speed * 1.5;
        ball.velocityY = -Math.sin(angle) * speed * 1.5;
    }
}

function resetBall() {
    ball.resetPosition();
}

// 6. Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    leftGoal.draw(ctx);
    rightGoal.draw(ctx);

    if (leftGoal.checkGoal(ball)) {
        player2Score++;
        resetBall();
    }
    if (rightGoal.checkGoal(ball)) {
        player1Score++;
        resetBall();
    }

    // Draw scores with blue color
    ctx.font = `${SCORE_DISPLAY_SIZE} Arial`;
    ctx.fillStyle = '#0000FF';
    ctx.fillText(`Kirby: ${player1Score}`, 50, 40);
    ctx.fillText(`Waddle Dee: ${player2Score}`, canvas.width/2 - 50, 40);

    if (keys['ArrowLeft']) kirby.x -= kirby.speed;
    if (keys['ArrowRight']) kirby.x += kirby.speed;
    if (keys['a']) waddleDee.x -= waddleDee.speed;
    if (keys['d']) waddleDee.x += waddleDee.speed;

    kirby.x = Math.max(kirby.radius, Math.min(canvas.width - kirby.radius, kirby.x));
    waddleDee.x = Math.max(waddleDee.radius, Math.min(canvas.width - waddleDee.radius, waddleDee.x));

    kirby.update();
    waddleDee.update();
    ball.update();

    checkCollision(kirby, ball);
    checkCollision(waddleDee, ball);

    kirby.draw(ctx);
    waddleDee.draw(ctx);
    ball.draw(ctx);

    requestAnimationFrame(gameLoop);
}

// 7. Start the game
gameLoop(); 