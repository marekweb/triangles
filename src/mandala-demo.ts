import { Grid } from './grid';
import { Point } from './point';
import { Triangle } from './triangle';
import { randomInt, delay } from './draw';

export function drawRing(center: Point, size: number) {
  const side = 1 + size * 2;
  const apex = center.getAdjacentPoint('N', size);

  let tri = apex.getTriangle('NW');

  const directions: Direction[] = ['+X', 'S', '+Y', '-X', 'N', '-Y'];

  const sides: Triangle[][] = [];

  for (let direction of directions) {
    let sideTriangles: Triangle[] = [];
    sides.push(sideTriangles);
    for (let i = 0; i < side; i++) {
      tri = tri.getAdjacent(direction);
      sideTriangles.push(tri);
    }
  }

  return sides;
}

export default async function(grid: Grid) {
  const center = grid.getPointReference(0, 0);

  while (true) {
    const A = randomInt(3, 6) * 10;
    const B = randomInt(2, 20) * 6;
    const C = randomInt(3, 5);
    const D = randomInt(2, 7);
    const E = randomInt(0, 360);

    const size = 14;

    for (let ringIndex = 0; ringIndex < size; ringIndex++) {
      const sides = drawRing(center, ringIndex);
      sides.forEach(side =>
        side.forEach(
          (t, tIndex) => {
            // offset: from ring side center
            const offset = Math.abs(tIndex - ringIndex);
            if (ringIndex + offset === C || offset === D) {
              t.setFill('black');
              return;
            }
            t.setFillHsl(
              E + offset * B + ringIndex * A,
              40 + ((offset % D) * 50) / D,
              70 - (80 / size) * ringIndex + 10
            );
          }
          // )
        )
      );
      await delay(50);
    }

    await delay(5000);
  }
}

// 0 1 0
// 1 3 1
// 2 5 2
// 3 7 3
// 4 9 4
// n n*2+1
