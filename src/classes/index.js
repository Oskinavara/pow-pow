const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let eps = 0.12;
let gp;
window.addEventListener('gamepadconnected', (event) => {
  gp = navigator.getGamepads()[0];
});

export class Player {
  x = canvas.width / 2;
  y = canvas.height / 2;
  radius = 10;
  speed = 3;

  update() {
    if (gp) {
      if (gp?.buttons[2]?.pressed) {
        this.speed = 10;
      } else {
        this.speed = 3;
      }
      this.x += Math.abs(gp.axes[0]) > eps ? gp.axes[0] * this.speed : 0;
      this.y += Math.abs(gp.axes[1]) > eps ? gp.axes[1] * this.speed : 0;
    }
  }

  draw() {
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    if (gp) {
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x + gp.axes[0] * 100, this.y + gp.axes[1] * 100);
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x + gp.axes[2] * 100, this.y + gp.axes[3] * 100);
    }
    ctx.stroke();
  }
}

export class Enemy {
  x = 100;
  y = 100;
  radius = 30;
  draw() {
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 30, 0, 2 * Math.PI);
    ctx.fill();
  }
}

export class Projectile {
  constructor(x, y, dx, dy, radius) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
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
