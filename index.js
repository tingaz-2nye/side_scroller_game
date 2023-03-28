const background = './img/background.png';
const platform = './img/platform.png';
const hills = './img/hills.png';
const platformSmallTall = './img/platformSmallTall.png';
const spriteRunRight = './img/spriteRunRight.png';
const spriteRunLeft = './img/spriteRunLeft.png';
const spriteStandRight = './img/spriteStandRight.png';
const spriteStandLeft = './img/spriteStandLeft.png';
const canvas = document.querySelector('canvas');

canvas.width = 1024;
canvas.height = 576;
const ctx = canvas.getContext('2d');
const gravity = 1.5;

class Player {
  constructor() {
    this.speed = 10;
    this.position = {
      x: 100,
      y: 100,
    };
    this.width = 66;
    this.height = 150;
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.image = createImage(spriteStandRight);
    this.frames = 0;
    this.sprites = {
      stand: {
        right: createImage(spriteStandRight),
        left: createImage(spriteStandLeft),
        cropWidth: 177,
        width: 66,
      },
      run: {
        right: createImage(spriteRunRight),
        left: createImage(spriteRunLeft),
        cropWidth: 341,
        width: 127.875,
      },
    };
    this.currentSprite = this.sprites.stand.right;
    this.currentCropWidth = 177;
  }

  draw() {
    ctx.drawImage(
      this.currentSprite,
      this.currentCropWidth * this.frames,
      0,
      this.currentCropWidth,
      400,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update() {
    this.frames++;

    if (
      this.frames > 59 &&
      (this.currentSprite === this.sprites.stand.right ||
        this.currentSprite === this.sprites.stand.left)
    )
      this.frames = 0;
    else if (
      this.frames > 29 &&
      (this.currentSprite === this.sprites.run.right ||
        this.currentSprite === this.sprites.run.left)
    )
      this.frames = 0;
    this.draw();
    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;

    if (this.position.y + this.height + this.velocity.y < canvas.height) {
      this.velocity.y += gravity;
    }
  }
}

class Platform {
  constructor({ x, y, image }) {
    this.position = { x, y };
    this.image = image;
    this.width = this.image.width;
    this.height = this.image.height;
  }

  draw() {
    ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update() {
    this.draw();
  }
}
class GenericObject {
  constructor({ x, y, image }) {
    this.position = { x, y };
    this.image = image;
    this.width = this.image.width;
    this.height = this.image.height;
  }

  draw() {
    ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update() {
    this.draw();
  }
}

function createImage(imageSrc) {
  const image = new Image();
  image.src = imageSrc;

  return image;
}

let platformImage = createImage(platform);
let platformSmallTallImage = createImage(platformSmallTall);
let player = new Player();
let platforms = [];
let genericObjects = [];

const keys = {
  right: {
    keyPressed: false,
  },
  left: {
    keyPressed: false,
  },
};

let scrollOffset = 0;

const init = () => {
  platformImage = createImage(platform);
  player = new Player();
  platforms = [
    new Platform({
      x:
        platformImage.width * 4 +
        300 -
        2 +
        platformImage.width -
        platformSmallTallImage.width,
      y: 270,
      image: platformSmallTallImage,
    }),
    new Platform({ x: -1, y: 470, image: platformImage }),
    new Platform({ x: platformImage.width - 3, y: 470, image: platformImage }),
    new Platform({
      x: platformImage.width * 2 + 200,
      y: 470,
      image: platformImage,
    }),
    new Platform({
      x: platformImage.width * 3 + 400,
      y: 470,
      image: platformImage,
    }),
    new Platform({
      x: platformImage.width * 4 + 300 - 3,
      y: 470,
      image: platformImage,
    }),
    new Platform({
      x: platformImage.width * 5 + 700 - 3,
      y: 470,
      image: platformImage,
    }),
  ];
  genericObjects = [
    new GenericObject({ x: -1, y: -1, image: createImage(background) }),
    new GenericObject({ x: 0, y: 0, image: createImage(hills) }),
  ];
  scrollOffset = 0;
};

const animate = () => {
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  genericObjects.forEach((genericObject) => {
    genericObject.update();
  });
  platforms.forEach((platform) => {
    platform.update();
  });
  player.update();
  if (keys.right.keyPressed && player.position.x < 450) {
    player.velocity.x = player.speed;
  } else if (
    (keys.left.keyPressed && player.position.x > 100) ||
    (keys.left.keyPressed && scrollOffset === 0 && player.position.x > 0)
  ) {
    player.velocity.x = -player.speed;
  } else {
    player.velocity.x = 0;
    if (keys.right.keyPressed) {
      scrollOffset += player.speed;
      platforms.forEach((platform) => {
        platform.position.x -= player.speed;
      });
      genericObjects.forEach((genericObject) => {
        genericObject.position.x -= player.speed * 0.66;
      });
    } else if (keys.left.keyPressed && scrollOffset > 0) {
      scrollOffset -= player.speed;
      platforms.forEach((platform) => {
        platform.position.x += player.speed;
      });
      genericObjects.forEach((genericObject) => {
        genericObject.position.x += player.speed * 0.66;
      });
    }
  }
  platforms.forEach((platform) => {
    if (
      player.position.y + player.height <= platform.position.y &&
      player.position.y + player.height + player.velocity.y >=
        platform.position.y &&
      player.position.x + player.width >= platform.position.x &&
      player.position.x <= platform.position.x + platform.width
    ) {
      player.velocity.y = 0;
    }
  });

  if (scrollOffset > 10000) {
    console.log('you win');
  }

  if (player.position.y > canvas.height) init();
  requestAnimationFrame(animate);
};

init();
animate();

addEventListener('keydown', ({ repeat, keyCode }) => {
  switch (keyCode) {
    case 87:
      if (repeat) return;
      player.velocity.y -= 25;
      break;
    case 83:
      break;
    case 68:
      keys.right.keyPressed = true;
      player.currentSprite = player.sprites.run.right;
      player.currentCropWidth = player.sprites.run.cropWidth;
      player.width = player.sprites.run.width;
      break;
    case 65:
      keys.left.keyPressed = true;
      player.currentSprite = player.sprites.run.left;
      player.currentCropWidth = player.sprites.run.cropWidth;
      player.width = player.sprites.run.width;
      break;
    default:
      break;
  }
});

addEventListener('keyup', ({ keyCode }) => {
  switch (keyCode) {
    case 87:
      break;
    case 83:
      break;
    case 68:
      keys.right.keyPressed = false;
      player.currentSprite = player.sprites.stand.right;
      player.currentCropWidth = player.sprites.stand.cropWidth;
      player.width = player.sprites.stand.width;
      break;
    case 65:
      keys.left.keyPressed = false;
      player.currentSprite = player.sprites.stand.left;
      player.currentCropWidth = player.sprites.stand.cropWidth;
      player.width = player.sprites.stand.width;
      break;
    default:
      break;
  }
});
