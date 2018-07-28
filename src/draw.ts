import { Point } from './point';
import { Triangle } from './triangle';
import { Grid} from './grid';

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

export function drawHex(
    center: Point,
    size: number
): Triangle[] {
    const triangles: Triangle[] = [];
    for (let i = 0; i < size; i++) {
        triangles.push(...drawRing(center, i));
    }
    return triangles;
}

export function fillRing(
  center: Point,
  size: number,
  color: string = 'orange'
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
