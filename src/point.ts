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
    return [this.x, this.y];
  }

  getAdjacentPoint(direction: Direction, distance: number = 1) {
    return this.grid.getPointReference(
      ...getAdjacentPoint(this.x, this.y, direction, distance)
    );
  }

  getTriangle(direction: Direction) {
    return this.grid.getTriangleReference(
      ...getTriangleAdjacentToPoint(this.x, this.y, direction)
    );
  }

  getElement(): SVGElement {
    return this.grid.getPointElement(this.x, this.y);
  }
}
