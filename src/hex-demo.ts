import { Grid } from './grid';
import { randomInt, delay, drawRing, randomChoice } from './draw';
import { Point } from './point';
import { clamp } from './utilities';

export default async function hexDemo(grid: Grid) {
  let delayTime = 1000;
  while (true) {
    // Pick a size, with more weight given to smaller than larger.
    const size = randomChoice([0, 0, 0, 1, 1, 2]);

    const point = grid.getPointReference(
      randomInt(-10, 10),
      randomInt(-10, 10),
    );
    drawHexBloom(point, size, randomInt(0, 360));

    // Wait before each hex bloom
    delayTime = clamp(delayTime + randomInt(-100, 100), 0, 3000);

    await delay(delayTime);
  }
}

async function drawHexBloom(point: Point, size: number, hue: number) {
  for (let i = 0; i <= size; i++) {
    const ring = drawRing(point, i);
    const s = 50 + i * (size / 50);

    ring.forEach(t => {
      let h = hue + randomInt(-20, 20);
      t.setFill(`hsl(${h}, ${s * 2}%, 75%)`);
    });

    delay(200).then(async () => {
      ring.forEach(t => {
        let h = hue + randomInt(-20, 20);
        t.setFill(`hsl(${h}, ${s}%, 60%)`);
      });
    });

    delay(200).then(async () => {
      ring.slice().forEach(t => {
        let h = hue + randomInt(-30, 30);
        t.setFill(
          `hsl(${h}, ${50 + randomInt(-10, 10)}%, ${20 + randomInt(-5, 5)}%)`,
        );
      });
    });

    await delay(125 / size);
  }
}
