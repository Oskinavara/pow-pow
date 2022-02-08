import data from './words.js';
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 700;
canvas.height = 700;

const randomIndex = () => Math.floor(Math.random() * data.length);

const randomNumber = (min, max) => Math.random() * (max - min) + min;

class Word {
  text = data[randomIndex()];
  fontGrow = 0.06;
  acc = 0;
  fontSize = 30;
  alpha = 1;
  x = canvas.width / 2 + randomNumber(-canvas.width / 3, canvas.width / 3) - 100;
  y = canvas.height / 2 + randomNumber(-canvas.width / 4, canvas.width / 4);
  constructor() {}

  update() {
    ctx.fillStyle = `rgba(85, 50, 0, ${this.alpha})`;
    ctx.font = `${this.fontSize}px Arial`;
    this.fontSize += this.fontGrow;
    this.fontGrow += this.acc;
    this.x += this.x > canvas.width / 2 ? 0.2 : -0.2;
    this.y += this.y > canvas.height / 2 ? 0.2 : -0.2;
    // if (this.fontSize > 40) {
    //   console.log(this.fontSize);
    //   this.alpha -= this.fontSize / 50;
    // }
  }

  draw() {
    ctx.fillText(this.text, this.x, this.y);
  }
}

const words = [];

const initWords = (count) => {
  for (let i = 0; i < count; i++) {
    words.push(new Word());
  }
};

initWords(10);

const renderWords = () => {
  words.forEach((word) => {
    word.update();
    word.draw();
  });
};
console.log(words);
const animate = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  renderWords();
  requestAnimationFrame(animate);
};

animate();
