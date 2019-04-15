import { Grid } from './grid';
import { drawCubeTower, randomInt, randomChoice, delay } from './draw';

export default async function cubePipes(grid: Grid) {
  let p = grid.getPointReference(0, 0);
  let hue = 0;
  const directions: Direction[] = ['N', 'SW', 'SE'];
  while (true) {
    let nextP, direction: Direction, distance;
    do {
      direction = randomChoice(directions);
      distance = randomInt(1, 6);
      nextP = p.getAdjacentPoint(direction, distance);
    } while (!nextP.isWithinScreen());
    hue = await drawCubeTower(p, direction, distance, hue, 200);
    hue = hue % 360;
    p = nextP;
    await delay(0);
  }
}
