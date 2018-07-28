import { Grid } from './grid';
import { drawCubeTower, randomInt, delay } from './draw';

export async function cubesDemo(grid: Grid) {
  while (true) {
    const x = randomInt(-10, 10);
    const y = randomInt(-10, 10);

    const p = grid.getPointReference(x, y);

    const roll = Math.random();
    if (roll < 0.33) {
      await drawCubeTower(p, 'SE', randomInt(5, 12));
    } else if (roll < 0.66) {
      await drawCubeTower(p, 'SW', randomInt(5, 12));
    } else {
      await drawCubeTower(p, 'N', randomInt(5, 12));
    }

    await delay(2500);
  }
}
