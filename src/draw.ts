import { Point } from './point';
import { Triangle } from './triangle';
import { Grid } from './grid';

export function drawCube(centerPoint: Point, hue: number = 0) {
  hue = Math.round(hue) % 360;
  const l = randomInt(85, 90);
  const s = randomInt(40, 60);
  const top = `hsl(${hue}, ${s}%, ${l}%)`;
  const left = `hsl(${hue}, ${s - 10}%, ${l - 25}%)`;
  const right = `hsl(${hue}, ${s - 20}%, ${l - 50}%)`;

  const hex = drawHex(centerPoint);
  hex.forEach(t => t.setFill('white'));

  return delay(200).then(() => {
    centerPoint.getTriangle('NE').setFill(top);
    centerPoint.getTriangle('NW').setFill(top);

    centerPoint.getTriangle('E').setFill(right);
    centerPoint.getTriangle('SE').setFill(right);

    centerPoint.getTriangle('W').setFill(left);
    centerPoint.getTriangle('SW').setFill(left);
  });
}

export async function drawCubeTower(
  p: Point,
  direction: Direction,
  height: number,
  hue: number = 0,
  interval: number = 600,
) {
  for (let i = 0; i < height; i++) {
    drawCube(p, hue + 1 * i);
    await delay(randomInt(0, interval));
    p = p.getAdjacentPoint(direction);
  }
  return hue + 1 * height;
}

export function randomInt(a: number, b: number): number {
  return Math.floor(Math.random() * (b - a) + a);
}

export function randomChoice<T>(array: T[]): T {
  return array[randomInt(0, array.length)];
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function drawRing(center: Point, size: number) {
  const triangles = [];
  const side = 1 + size * 2;
  const apex = center.getAdjacentPoint('N', size);

  let tri = apex.getTriangle('NE');
  triangles.push(tri);

  for (let i = 0; i < side; i++) {
    tri = tri.getAdjacent('+X');
    triangles.push(tri);
  }

  for (let i = 0; i < side; i++) {
    tri = tri.getAdjacent('S');
    triangles.push(tri);
  }

  for (let i = 0; i < side; i++) {
    tri = tri.getAdjacent('+Y');
    triangles.push(tri);
  }

  for (let i = 0; i < side; i++) {
    tri = tri.getAdjacent('-X');
    triangles.push(tri);
  }

  for (let i = 0; i < side; i++) {
    tri = tri.getAdjacent('N');
    triangles.push(tri);
  }

  for (let i = 0; i < side - 1; i++) {
    tri = tri.getAdjacent('-Y');
    triangles.push(tri);
  }

  return triangles;
}

export function drawHex(center: Point, size: number = 0): Triangle[] {
  const triangles: Triangle[] = [];
  for (let i = 0; i <= size; i++) {
    triangles.push(...drawRing(center, i));
  }
  return triangles;
}

export function fillRing(
  center: Point,
  size: number,
  color: string = 'orange',
) {
  drawRing(center, size).forEach(t => {
    t.setFill(color);
  });
}

export function drawConcentricGradient(center: Point) {
  for (let i = 1; i < 16; i++) {
    fillRing(center, i, `hsl(90, 50%, ${60 - i * 3}%)`);
  }
}

export function getAllTrianglesWithinScreen(grid: Grid) {
  const triangles: Triangle[] = [];
  const center = grid.getPointReference(0, 0);
  let i = 5;
  while (true) {
    const ring = drawRing(center, i);
    if (ring.every(t => !t.isWithinScreen())) {
      return triangles;
    }
    triangles.push(...ring);
  }
}
