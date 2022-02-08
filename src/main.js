const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

import { Player, Projectile, Enemy } from './classes';

let gp;
window.addEventListener('gamepadconnected', (event) => {
  gp = navigator.getGamepads()[0];
});

canvas.addEventListener('button-pressed', (e) => {
  if (e.detail.index === 5) {
    shootAtDeg(degFromAxes());
    vibrate();
  }
  if (e.detail.index === 7) {
    //R1
    vibrate();
    shootWithSpread(5);
  }
});

const degFromAxes = () => {
  const result = -Math.atan2(gp.axes[3], gp.axes[2]);
  if (result < 0) {
    return result + 360;
  } else return result;
};

const shootAtDeg = (deg, radius) => {
  addProjectile(Math.cos(deg), -Math.sin(deg), radius);
};

const shootWithSpread = (spread) => {
  const spreadToRad = (spread * Math.PI) / 180;
  shootAtDeg(degFromAxes(), 5);
  shootAtDeg(degFromAxes() + spreadToRad, 5);
  shootAtDeg(degFromAxes() - spreadToRad, 5);
};

const isOutOfBounds = (proj) => {
  return proj.x > canvas.width || proj.y > canvas.height || proj.x < 0 || proj.y < 0;
};

setInterval(() => {
  projectiles = projectiles.filter((proj) => !isOutOfBounds(proj));
}, 1000);

const vibrate = (duration = 250, strongMagnitude = 0.9, weakMagnitude = 0.5) => {
  gp?.vibrationActuator.playEffect('dual-rumble', {
    duration,
    strongMagnitude,
    weakMagnitude,
  });
};

const getDistance = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
};

const checkCollision = () => {
  projectiles.forEach((proj) => {
    if (getDistance(proj.x, proj.y, enemy.x, enemy.y) <= proj.radius + enemy.radius) {
      console.log('Collision detected');
      projectiles = projectiles.filter((p) => proj !== p);
      // ctx.fillText('Collision detected', 10, 50);
    }
  });
};

const player = new Player();
const enemy = new Enemy();
let projectiles = [];

function drawProjectiles() {
  projectiles.forEach((proj) => {
    proj.update();
    proj.draw();
  });
}

function addProjectile(x = gp.axes[2], y = gp.axes[3], radius = 10) {
  const baseSpeed = 20;
  const sum = Math.abs(x) + Math.abs(y);
  const xComp = (x / sum) * baseSpeed;
  const yComp = (y / sum) * baseSpeed;
  if (sum < 0.1) {
    projectiles.push(new Projectile(player.x, player.y, baseSpeed, 0, radius));
  } else {
    projectiles.push(new Projectile(player.x, player.y, xComp, yComp, radius));
  }
}

function createEvent(index) {
  return new CustomEvent('button-pressed', { detail: { index } });
}

let prevState;

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.update();
  player.draw();
  enemy.draw();
  checkCollision();

  drawProjectiles();

  requestAnimationFrame(animate);
}

animate();

function handleGamepad() {
  prevState = gp?.buttons.map((button) => button.pressed);
  gp = navigator.getGamepads()[0];
  gp?.buttons.forEach((button, index) => {
    if (prevState[index] !== button.pressed && !prevState[index]) {
      canvas.dispatchEvent(createEvent(index));
    }
  });

  requestAnimationFrame(handleGamepad);
}

handleGamepad();
