export const draw = (
  context: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  time: number,
  particles: Particle[],
) => {
  // Clear the canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Fill the canvas with color

  for (let n = 0; n < particles.length; n += 1) {
    let closestParticle = 2000;
    for (let j = 0; j < particles.length; j += 1) {
      const dx = particles[n].x - particles[j].x;
      const dy = particles[n].y - particles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < closestParticle && distance > 1) {
        closestParticle = distance;
      }
      if (distance < 120) {
        // Do something if the distance is less than 100
        // For example, draw a line between the particles
        const opacity = Math.max(0, 1 - distance / 120);
        context.strokeStyle = `rgba(100, 100, 100, ${opacity})`;
        context.beginPath();
        context.moveTo(particles[n].x, particles[n].y);
        context.lineTo(particles[j].x, particles[j].y);
        context.stroke();
      }
    }
    let value = 1.76258992806 * closestParticle - 191.762589928;
    if (value > 55 || closestParticle > 170) {
      value = 55;
    } else if (value < -200) {
      value = -200;
    }
    particles[n].drawParticle(context, value);
    particles[n].update(canvas);
  }

  context.fillStyle = 'rgba(255, 255, 255, 0.5)';
  context.fillRect(0, 0, canvas.width, canvas.height);
};

export class Particle {
  x: number;
  y: number;
  directionX: number;
  directionY: number;
  size: number;
  color: string;

  constructor(
    x: number,
    y: number,
    directionX: number,
    directionY: number,
    size: number,
    color: string,
  ) {
    this.x = x;
    this.y = y;
    this.directionX = directionX;
    this.directionY = directionY;
    this.size = size;
    this.color = color;
  }

  drawParticle(context: CanvasRenderingContext2D, value: number) {
    context.beginPath();
    context.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    this.color = `rgba(${200 + value}, ${200 + value}, ${200 + value})`;
    context.fillStyle = this.color;
    context.fill();
  }

  update(canvas: HTMLCanvasElement) {
    if (this.x > canvas.width || this.x < 0) {
      this.directionX = -this.directionX;
    }
    if (this.y > canvas.height || this.y < 0) {
      this.directionY = -this.directionY;
    }

    this.x += this.directionX * 0.5;
    this.y += this.directionY * 0.5;
  }
}

export function CreateParticlesArray(
  count: number,
  canvasWidth: number,
  canvasHeight: number,
) {
  let particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    let size = Math.random() * 5 + 1;
    let x = Math.random() * (canvasWidth - size * 2);
    let y = Math.random() * (canvasHeight - size * 2);
    let directionX = Math.random() * 0.4 - 0.2;
    let directionY = Math.random() * 0.4 - 0.2;
    let color = '#e4e4e4';

    particles.push(new Particle(x, y, directionX, directionY, size, color));
  }
  return particles;
}
