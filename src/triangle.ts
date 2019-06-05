import { Grid } from './grid';
import { Point } from './point';
import {
  getAdjacentTriangle,
  getTrianglePoints,
  getTrianglePointInDirection
} from './utilities';

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export class Triangle {
  private grid: Grid;
  private x: number;
  private y: number;
  private side: 0 | 1;

  constructor(grid: Grid, x: number, y: number, side: 0 | 1) {
    this.grid = grid;
    this.x = x;
    this.y = y;
    this.side = side;
  }

  getCoordinates(): TriangleCoordinate {
    return { x: this.x, y: this.y, z: this.side };
  }

  getPixelCoordinates(): PixelCoordinate {
    return this.grid.convertGridCoordinates(this.x, this.y);
  }

  getElement(): SVGElement {
    return this.grid.getTriangleElement(this.x, this.y, this.side);
  }

  setFillHsl(h: number, s: number, l: number) {
    h = h % 360;
    s = clamp(s, 0, 100);
    l = clamp(l, 0, 100);
    this.setFill(`hsl(${h},${s}%,${l}%)`);

  }

  setFill(colorString: string) {
    // `requestAnimationFrame` is necessary here for CSS transitions to work
    // when the element is first created. `getElement` will lazily create the
    // element when it gets called the first time. So it needs to be called
    // before the next frame, otherwise the animation won't trigger because the
    // creation of the element and the update of the style property will get
    // batched into one update of the DOM.
    const triangleElement = this.getElement();
    window.requestAnimationFrame(() => {
      setTimeout(() => {
        triangleElement.style.fill = colorString;
        triangleElement.style.stroke = colorString;
      });
    });
  }

  fade(factor: number) {
    const triangleElement = this.getElement();
    const computedColor = window.getComputedStyle(triangleElement).fill;
    if (!computedColor) {
      return;
    }
    const parts = computedColor
      .slice(0, 4)
      .slice(0, computedColor.length - 2)
      .split(', ')
      .map(i => Number.parseInt(i, 10))
      .map(i => i * factor)
      .join(', ');
    this.setFill(`rgb(${parts})`);
  }

  getAdjacent(direction: Direction): Triangle {
    const tri = getAdjacentTriangle(this.x, this.y, this.side, direction);
    return this.grid.getTriangleReference(tri.x, tri.y, tri.z);
  }

  getPoints(): [PointCoordinate, PointCoordinate, PointCoordinate] {
    return getTrianglePoints(this.x, this.y, this.side);
  }

  getPoint(direction: Direction): Point {
    const p = getTrianglePointInDirection(this.x, this.y, this.side, direction);
    return this.grid.getPointReference(p.x, p.y);
  }

  isWithinScreen() {
    return this.grid.isTriangleWithinScreen(this.x, this.y, this.side);
  }
}

export class TriangleCollection {
  private triangles = new Set<Triangle>();
  private grid: Grid;

  constructor(grid: Grid) {
    this.grid = grid;
  }

  addByCoordinates(x: number, y: number, side: 0 | 1) {
    this.add(this.grid.getTriangleReference(x, y, side));
  }

  add(t: Triangle) {
    this.triangles.add(t);
  }

  remove(t: Triangle) {
    this.triangles.delete(t);
  }

  removeByCoordinates(x: number, y: number, side: 0 | 1) {
    this.remove(this.grid.getTriangleReference(x, y, side));
  }

  apply(f: (t: Triangle) => void) {
    this.triangles.forEach(f);
  }
}
