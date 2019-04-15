import { Grid } from './grid';
import { randomInt, delay, drawRing } from './draw';

function* ramp(a: number, b: number, step = 1) {
  if (a > b) {
    step *= -1;
  }
  for (let i = a; i !== b; i += step) {
    yield i;
  }
}

function rotateArray<T>(array: T[], offset: number) {
  return [...array.slice(offset), ...array.slice(0, offset)];
}

export default async function ringsDemo(grid: Grid) {
  const largestRing = 16;
  const center = grid.getPointReference(0, 0);

  while (true) {
    let hue = randomInt(0, 360);
    const rv = randomInt(35, 75);

    for (let r of ramp(0, largestRing)) {
      const ring = rotateArray(drawRing(center, r), 1);
      for (let t of ring) {
        t.setFill(`hsl(${hue + r * 15}, ${40 + (r % 2) * 40}%, ${rv}%)`);
        await delay(5);
      }
    }

    hue = randomInt(0, 360);

    for (let r of ramp(largestRing, 0)) {
      const rv = randomInt(5, 90);
      for (let t of rotateArray(drawRing(center, r), 1).reverse()) {
        t.setFill('black');
        delay(600).then(() => {
          const tv = randomInt(25, 80);
          t.setFill(`hsl(${hue + r * 65}, ${tv}%, ${rv}%)`);
        });

        await delay(5);
      }
    }
  }
}
