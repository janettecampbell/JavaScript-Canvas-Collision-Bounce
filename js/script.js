const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

// declare variables
const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2,
};

let particles;
const colors = ["#2185C5", "#7ECEFD", "#FFF6E5", "#FF7F66"];

// Implementation

const init = () => {
  particles = [];

  for (let i = 0; i < 400; i++) {
    const radius = 15;
    let x = randomIntFromRange(radius, canvas.width - radius);
    let y = randomIntFromRange(radius, canvas.height - radius);
    const color = randomColor(colors);

    if (i !== 0) {
      for (let i = 0; i < particles.length; i++) {
        for (j = 0; j < particles.length; j++) {
          if (distance(x, y, particles[j].x, particles[j].y) - radius * 2 < 0) {
            x = randomIntFromRange(radius, canvas.width - radius);
            y = randomIntFromRange(radius, canvas.height - radius);
          }
        }
      }
    }

    particles.push(new Particle(x, y, radius, color));
  }
};

// Event Listeners
addEventListener("mousemove", (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  init();
});

addEventListener("click", () => {
  init();
});

// Objects
class Particle {
  constructor(x, y, radius, color) {
    this.velocity = {
      x: (Math.random() - 0.5) * 5,
      y: (Math.random() - 0.5) * 5,
    };
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.mass = 1;
    this.opacity = 0;
  }

  draw = () => {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
    ctx.strokeStyle = this.color;
    ctx.stroke();
    ctx.closePath();
  };

  update = (particles) => {
    this.draw();
    for (let i = 0; i < particles.length; i++) {
      if (this === particles[i]) {
        continue;
      }
      if (
        distance(this.x, this.y, particles[i].x, particles[i].y) -
          this.radius * 2 <
        0
      ) {
        resolveCollision(this, particles[i]);
      }
    }

    if (this.x - this.radius <= 0 || this.x + this.radius >= innerWidth) {
      this.velocity.x = -this.velocity.x;
    }

    if (this.y - this.radius <= 0 || this.y + this.radius >= innerHeight) {
      this.velocity.y = -this.velocity.y;
    }

    // mouse collision detection
    if (
      distance(mouse.x, mouse.y, this.x, this.y) < 120 &&
      this.opacity < 0.2
    ) {
      this.opacity += 0.02;
    } else if (this.opacity > 0) {
      this.opacity -= 0.02;
      this.opacity = Math.max(0, this.opacity);
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;
  };
}

// Animation Loop
const animate = () => {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((particle) => particle.update(particles));
};

init();
animate();
