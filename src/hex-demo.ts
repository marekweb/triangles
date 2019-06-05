import { Grid } from './grid';
import { randomInt, delay, drawRing } from './draw';
import { Point } from './point';

export default async function hexDemo(grid: Grid) {
  const size = 1;

  while (true) {
    let point = grid.getPointReference(randomInt(-10, 10), randomInt(-10, 10));
    fillNiceHex(point, size, randomInt(0, 360));
    await delay(randomInt(600, 1200));
  }
}

async function fillNiceHex(point: Point, size: number, hue: number) {
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
          `hsl(${h}, ${50 + randomInt(-10, 10)}%, ${20 + randomInt(-5, 5)}%)`
        );
      });
    });

    await delay(125 / size);
  }
}
