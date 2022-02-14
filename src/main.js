const canvas = document.getElementById('canvas');
const button = document.getElementById('button');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
console.log(window.innerHeight);
class Player {
  x = canvas.width / 2;
  y = canvas.height / 2;
  radius = 10;
  speed = 3;
  savedDirection = 0;
  maxHealth = 100;
  currentHealth = 100;
  invincible = false;

  update() {
    this.x += Math.abs(gp?.axes[0]) > eps ? gp?.axes[0] * this.speed : 0;
    this.y += Math.abs(gp?.axes[1]) > eps ? gp?.axes[1] * this.speed : 0;
    if (Math.abs(gp?.axes[2]) > 0.2 || Math.abs(gp?.axes[3]) > 0.2) {
      this.savedDirection = degFromAxes();
    }
  }

  draw() {
    ctx.fillStyle = 'blue';
    ctx.strokeStyle = 'blue';
    ctx.beginPath();
    if (!this.invincible) {
      ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    }
    ctx.fill();
    ctx.strokeRect(this.x - 40, this.y - this.radius - 20, 80, 10);
    ctx.fillRect(this.x - 40, this.y - this.radius - 20, 80 * (this.currentHealth / this.maxHealth), 10);
  }
}

class Enemy {
  constructor(radius, maxHealth, currentHealth) {
    this.x = randomNumber(100, 0.8 * canvas.width);
    this.y = randomNumber(100, 0.8 * canvas.height);
    this.dx = randomNumber(-1.1, 1);
    this.dy = randomNumber(-1.1, 1);
    this.radius = radius;
    this.maxHealth = maxHealth;
    this.currentHealth = currentHealth;
  }

  draw() {
    ctx.fillStyle = 'red';
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 30, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeRect(this.x - 40, this.y - this.radius - 20, 80, 10);
    ctx.fillRect(this.x - 40, this.y - this.radius - 20, 80 * (this.currentHealth / this.maxHealth), 10);
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;
  }

  detectCollision() {
    if (this.x < this.radius || this.x > canvas.width - this.radius) {
      this.dx = -this.dx;
    }
    if (this.y < this.radius || this.y > canvas.height - this.radius) {
      this.dy = -this.dy;
    }
  }
}

class Projectile {
  constructor(x, y, dx, dy, radius, damage) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.damage = damage;
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;
  }

  draw() {
    ctx.fillStyle = 'orangered';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
  }
}

class UI {
  constructor() {
    this.count = 0;
  }
  draw() {
    ctx.font = '24px sans-serif';
    ctx.fillText(this.count, 30, 30);
  }
}
let gp;
const eps = 0.12;
let projectiles = [];
let enemyProjectiles = [];
let enemies = [];
let gameOver = false;
let player = new Player();
const ui = new UI();

window.addEventListener('gamepadconnected', (event) => {
  gp = navigator.getGamepads()[0];
});

canvas.addEventListener('button-pressed', (e) => {
  console.log(e.detail.index);
  if (e.detail.index === 0) {
    if (!isAnimatePlaying) {
    }
    console.log(enemies);
  }
  if (e.detail.index === 5) {
    shootAtDeg(player.savedDirection, 10);
    vibrate();
  }
  if (e.detail.index === 7) {
    //R1
    vibrate();
    shootWithSpread(5);
  }
});

function changeLoop(from, to) {
  activeLoop = 
  isAnimatePlaying = false;
  setTimeout(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    requestAnimationFrame(handleGameOver);
    player = null;
    enemies = [];
    enemyProjectiles = [];
  }, 10);
}

const degFromAxes = () => {
  const result = -Math.atan2(gp?.axes[3], gp?.axes[2]);
  if (result < 0) {
    return result + Math.PI * 2;
  } else return result;
};

const shootAtDeg = (deg, radius) => {
  addProjectile(Math.cos(deg), -Math.sin(deg), radius);
};

const shootWithSpread = (spread) => {
  const spreadToRad = (spread * Math.PI) / 180;
  shootAtDeg(player.savedDirection, 5);
  shootAtDeg(player.savedDirection + spreadToRad, 5);
  shootAtDeg(player.savedDirection - spreadToRad, 5);
};

const isOutOfBounds = (proj) => {
  return proj.x > canvas.width || proj.y > canvas.height || proj.x < 0 || proj.y < 0;
};

const randomNumber = (min, max) => {
  return Math.random() * (max - min) + min;
};

setInterval(() => {
  projectiles = projectiles.filter((proj) => !isOutOfBounds(proj));
  enemyProjectiles = enemyProjectiles.filter((proj) => !isOutOfBounds(proj));
}, 1000);

function spawnEnemy() {
  let enemy;
  do {
    enemy = new Enemy(30, 100, 100);
  } while (getDistance(enemy.x, enemy.y, player.x, player.y) < enemy.radius + player.radius + 10);
  enemies.push(enemy);
  setTimeout(() => {
    spawnEnemy();
  }, randomNumber(500, 1500));
}

spawnEnemy();

function shootPlayer() {
  enemies.forEach((enemy) => {
    //
  });
}

function changeEnemiesSpeeds() {
  enemies.forEach((enemy) => {
    let delay = randomNumber(100, 900);
    setTimeout(() => {
      enemy.dx = randomNumber(-2, 2);
      enemy.dy = randomNumber(-2, 2);
    }, delay);
  });
}

setInterval(() => {
  changeEnemiesSpeeds();
}, 2000);

shootPlayer();

const vibrate = (duration = 250, strongMagnitude = 0.9, weakMagnitude = 0.5) => {
  gp?.vibrationActuator.playEffect('dual-rumble', {
    duration,
    strongMagnitude,
    weakMagnitude,
  });
};

function getDistance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

const checkCollision = () => {
  enemies.forEach((enemy) => {
    if (getDistance(enemy.x, enemy.y, player.x, player.y) <= enemy.radius + player.radius) {
      if (!player.invincible) {
        player.currentHealth -= 50;
        player.invincible = true;
        setTimeout(() => {
          player.invincible = false;
        }, 1000);
      }
    }
    projectiles.forEach((proj) => {
      if (getDistance(proj.x, proj.y, enemy.x, enemy.y) <= proj.radius + enemy.radius) {
        enemy.currentHealth -= proj.damage;
        projectiles = projectiles.filter((p) => proj !== p);
        if (enemy.currentHealth <= 0) {
          ui.count++;
          enemies = enemies.filter((e) => e !== enemy);
        }
      }
    });
  });
  enemyProjectiles.forEach((proj) => {
    if (getDistance(proj.x, proj.y, player.x, player.y) <= proj.radius + player.radius) {
      player.currentHealth -= proj.damage;
      enemyProjectiles = enemyProjectiles.filter((p) => proj !== p);
    }
  });
  if (player.currentHealth <= 0) {
    changeLoop();
  }
};

function drawProjectiles() {
  projectiles.forEach((proj) => {
    proj.update();
    proj.draw();
  });
}

function drawEnemyProjectiles() {
  enemyProjectiles.forEach((proj) => {
    proj.update();
    proj.draw();
  });
}

function drawEnemies() {
  enemies.forEach((enemy) => {
    enemy.detectCollision();
    enemy.update();
    enemy.draw();
  });
}

function addProjectile(x, y, radius) {
  const baseSpeed = 20;
  const sum = Math.abs(x) + Math.abs(y);
  const xComp = (x / sum) * baseSpeed;
  const yComp = (y / sum) * baseSpeed;
  projectiles.push(new Projectile(player.x, player.y, xComp, yComp, radius, 20));
}

function createEvent(index) {
  return new CustomEvent('button-pressed', { detail: { index } });
}

let isAnimatePlaying = true;

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (player) {
    player.update();
    player.draw();
  }
  drawEnemies();
  checkCollision();
  drawProjectiles();
  drawEnemyProjectiles();
  ui.draw();
  if (gameOver) {
    ctx.font = 'bold 48px serif';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
  }
  if (isAnimatePlaying) {
    requestAnimationFrame(animate);
  }
}

var anim = requestAnimationFrame(animate);

function handleGamepad() {
  let prevState = gp?.buttons.map((button) => button.pressed);
  gp = navigator.getGamepads()[0];
  gp?.buttons.forEach((button, index) => {
    if (prevState?.[index] !== button.pressed && !prevState?.[index]) {
      canvas.dispatchEvent(createEvent(index));
    }
  });
  requestAnimationFrame(handleGamepad);
}

handleGamepad();

class GameOver {
  draw() {
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
  }
}

const go = new GameOver();

function handleGameOver() {
  go.draw();
  requestAnimationFrame(handleGameOver);
}

// handleGameOver();
