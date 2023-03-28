const canvas = document.querySelector('canvas');

canvas.width = innerWidth;
canvas.height = innerHeight;
const ctx = canvas.getContext('2d');
const gravity = 2.5;

class Player {
  constructor() {
    this.position = {
      x: 100,
      y: 100,
    };
    this.width = 30;
    this.height = 30;
    this.velocity = {
      x: 0,
      y: 0,
    };
  }

  draw() {
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.draw();
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y < canvas.height) {
      this.velocity.y += gravity;
    } else {
      this.velocity.y = 0;
    }
  }
}

const player = new Player();

const animate = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.update();
  requestAnimationFrame(animate);
};

animate();

addEventListener('keydown', ({ keyCode }) => {
  switch (keyCode) {
    case 87:
      console.log('up');
      break;
    case 83:
      console.log('down');
      break;
    case 68:
      console.log('right');
      break;
    case 65:
      console.log('left');
      break;
    default:
      break;
  }
});

addEventListener('keyup', ({ keyCode }) => {
  switch (keyCode) {
    case 87:
      console.log('up');
      break;
    case 83:
      console.log('down');
      break;
    case 68:
      console.log('right');
      break;
    case 65:
      console.log('left');
      break;
    default:
      break;
  }
});
