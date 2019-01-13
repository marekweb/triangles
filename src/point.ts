import { Grid } from './grid';
import { getTriangleAdjacentToPoint, getAdjacentPoint } from './utilities';

export class Point {
  private readonly grid: Grid;
  private readonly x: number;
  private readonly y: number;
  constructor(grid: Grid, x: number, y: number) {
    this.grid = grid;
    this.x = x;
    this.y = y;
  }

  getPointCoordinate(): PointCoordinate {
    return { x: this.x, y: this.y };
  }

  getAdjacentPoint(direction: Direction, distance: number = 1) {
    const p = getAdjacentPoint(this.x, this.y, direction, distance);
    return this.grid.getPointReference(p.x, p.y);
  }

  getTriangle(direction: Direction) {
    const t = getTriangleAdjacentToPoint(this.x, this.y, direction);
    return this.grid.getTriangleReference(t.x, t.y, t.z);
  }

  getElement(): SVGElement {
    return this.grid.getPointElement(this.x, this.y);
  }
}
