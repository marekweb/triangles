import { Point } from './point';

export function drawCube(centerPoint: Point, hue: number = 0) {
  const top = `hsl(${hue}, 25%, 75%)`;
  const left = `hsl(${hue}, 25%, 50%)`;
  const right = `hsl(${hue}, 25%, 25%)`;

  centerPoint.getTriangle('NE').setFill(top);
  centerPoint.getTriangle('NW').setFill(top);

  centerPoint.getTriangle('E').setFill(right);
  centerPoint.getTriangle('SE').setFill(right);

  centerPoint.getTriangle('W').setFill(left);
  centerPoint.getTriangle('SW').setFill(left);
}

export async function drawCubeTower(
  p: Point,
  direction: 'N' | 'SW' | 'SE',
  height: number,
  interval: number = 200
) {
  const hue = randomInt(0, 360);
  for (let i = 0; i < height; i++) {
    drawCube(p, hue);
    await delay(interval);
    p = p.getAdjacentPoint(direction);
  }
}

export function randomInt(a: number, b: number): number {
  return Math.floor(Math.random() * (b - a) + a);
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function drawRing(
  center: Point,
  size: number,
  color: string = 'orange'
) {
  const side = 1 + size * 2;
  const apex = center.getAdjacentPoint('N', size);

  let tri = apex.getTriangle('NE');
  tri.setFill(color);

  for (let i = 0; i < side; i++) {
    tri = tri.getAdjacent('+X');
    tri.setFill(color);
  }

  for (let i = 0; i < side; i++) {
    tri = tri.getAdjacent('S');
    tri.setFill(color);
  }

  for (let i = 0; i < side; i++) {
    tri = tri.getAdjacent('+Y');
    tri.setFill(color);
  }

  for (let i = 0; i < side; i++) {
    tri = tri.getAdjacent('-X');
    tri.setFill(color);
  }

  for (let i = 0; i < side; i++) {
    tri = tri.getAdjacent('N');
    tri.setFill(color);
  }

  for (let i = 0; i < side - 1; i++) {
    tri = tri.getAdjacent('-Y');
    tri.setFill(color);
  }
}

export function drawConcentricGradient(center: Point) {
  for (let i = 1; i < 16; i++) {
    drawRing(center, i, `hsl(90, 50%, ${60 - i * 3}%)`);
  }
}
