import { Grid } from './grid';
import { Point } from './point';
import {
  getAdjacentTriangle,
  getTrianglePoints,
  getTrianglePointInDirection
} from './utilities';

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
    return [this.x, this.y, this.side];
  }
  getPixelCoordinates(): PixelCoordinate {
    return this.grid.convertGridCoordinates(this.x, this.y);
  }
  getElement(): SVGElement {
    return this.grid.getTriangleElement(this.x, this.y, this.side);
  }
  setFill(colorString: string) {
    this.getElement().style.fill = colorString;
  }
  getAdjacent(direction: Direction): Triangle {
    const tri = getAdjacentTriangle(this.x, this.y, this.side, direction);
    return this.grid.getTriangleReference(...tri);
  }
  getPoints(): [PointCoordinate, PointCoordinate, PointCoordinate] {
    return getTrianglePoints(this.x, this.y, this.side);
  }
  getPoint(direction: Direction): Point {
    return this.grid.getPointReference(
      ...getTrianglePointInDirection(this.x, this.y, this.side, direction)
    );
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
