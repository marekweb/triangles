///<reference path="types.d.ts"/>

const SQRT3 = Math.sqrt(3);

export class Grid {
  private width: number;
  private height: number;
  private triangleAltitude: number;
  private triangleHalfSide: number;
  private centerX: number;
  private centerY: number;

  private svg: SVGElement;
  private triangleElements = new Map<string, SVGElement>();

  constructor(
    container: HTMLElement,
    width: number,
    height: number,
    triangleAltitude: number
  ) {
    if (!container) {
      throw new Error('Missing container');
    }

    this.width = width;
    this.height = height;
    this.triangleAltitude = triangleAltitude;
    this.triangleHalfSide = triangleAltitude / SQRT3;
    this.centerX = width / 2;
    this.centerY = height / 2;

    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    this.svg.style.width = `${width}px`;
    this.svg.style.height = `${height}px`;
    this.svg.style.display = 'block';

    container.appendChild(this.svg);
  }

  convertGridCoordinates(x: number, y: number): PixelCoordinate {
    const pixelX = this.centerX + (x - y) * this.triangleAltitude;
    const pixelY = this.centerY + (x + y) * this.triangleHalfSide;
    return [Math.round(pixelX), Math.round(pixelY)];
  }

  unconvertGridCoordinatesToTriangle(
    Px: number,
    Py: number
  ): TriangleCoordinate {
    const [x, y] = this.unconvertGridCoordinates(Px, Py);
    const side = (x < 0 ? 1 - (x % 1) : x % 1) > (y < 0 ? (1 - y) % 1 : y % 1);
    return [x, y, side ? 0 : 1];
  }

  unconvertGridCoordinates(Px: number, Py: number): PixelCoordinate {
    const Cx = this.centerX;
    const Cy = this.centerY;
    const H = this.triangleHalfSide;
    const A = this.triangleAltitude;
    const x = ((Px - Cx) / A + (Py - Cy) / H) / 2;
    const y = ((Py - Cy) / H - (Px - Cx) / A) / 2;
    return [x, y];
  }

  convertGridCoordinatesToPointString(points: PixelCoordinate[]): string {
    const pairs = points.map(([x, y]) =>
      this.convertGridCoordinates(x, y).join(',')
    );
    return pairs.join(' ');
  }

  createTriangleElement(x: number, y: number, side: number) {
    const triangleElement = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'polygon'
    );
    const points = getTrianglePoints(x, y, side);
    const pointsString = this.convertGridCoordinatesToPointString(points);
    triangleElement.setAttribute('points', pointsString);
    this.svg.appendChild(triangleElement);
    return triangleElement;
  }

  getTriangleElement(x: number, y: number, side: number): SVGElement {
    const key = `${x},${y},${Number(side)}`;
    let triangleElement = this.triangleElements.get(key);
    if (!triangleElement) {
      triangleElement = this.createTriangleElement(x, y, side);
      this.triangleElements.set(key, triangleElement);
    }
    console.log('triangle', key, triangleElement);
    return triangleElement;
  }

  createCoordinateMarker(cx: number, cy: number): SVGCircleElement {
    const pointElement = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'circle'
    );

    setAttributes(pointElement, {
      cx,
      cy,
      r: 4
    });

    this.svg.appendChild(pointElement);
    return pointElement;
  }

  createPointElement(x: number, y: number): SVGCircleElement {
    const pointElement = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'circle'
    );
    const [cx, cy] = this.convertGridCoordinates(x, y);
    setAttributes(pointElement, {
      cx,
      cy,
      r: 4
    });

    this.svg.appendChild(pointElement);
    return pointElement;
  }

  getPointElement(x: number, y: number): SVGElement {
    const key = `${x},${y}`;
    let pointElement = this.triangleElements.get(key);
    if (!pointElement) {
      pointElement = this.createPointElement(x, y);
      this.triangleElements.set(key, pointElement);
    }

    return pointElement;
  }

  setClassToPoint(x: number, y: number, cls: string) {
    const point = this.getPointElement(x, y);
    point.setAttribute('class', cls);
  }

  isCoordinateWithinScreen(x: number, y: number, margin: number = 0): boolean {
    return !(
      x < 0 ||
      y < 0 ||
      x > this.width + margin ||
      y > this.height + margin
    );
  }

  getTriangleCenter(x: number, y: number, side: number): PixelCoordinate {
    const points = getTrianglePoints(x, y, side);
    const [triangleCenterX, triangleCenterY] = points.reduce(
      ([triangleCenterX, triangleCenterY], [x, y]) => [
        triangleCenterX + x,
        triangleCenterY + y
      ],
      [0, 0]
    );
    return this.convertGridCoordinates(
      triangleCenterX / 3,
      triangleCenterY / 3
    );
  }

  isTriangleWithinScreen(x: number, y: number, side: number) {
    const center = this.getTriangleCenter(x, y, side);
    const margin = (this.triangleAltitude * 2) / 3;

    // TODO Change this to a (...center, margin) with TS 3.0
    return this.isCoordinateWithinScreen(center[0], center[1], margin);
  }
}

class Point {
  private x: number;
  private y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  getAdjacentPoint(direction: Direction) {
    return getAdjacentPoint(this.x, this.y, direction);
  }
  getTriangle() {}
}

class Triangle {
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
  getPixelCoordinates() {
    return this.grid.convertGridCoordinates(this.x, this.y);
  }
  getElement() {
    return this.grid.getTriangleElement(this.x, this.y, this.side);
  }
  setFill(colorString: string) {
    this.getElement().style.fill = colorString;
  }
  getAdjacent(direction: Direction) {
    return getAdjacentTriangle(this.x, this.y, this.side, direction);
  }
}

function getTrianglePoints(
  x: number,
  y: number,
  side: number
): [PixelCoordinate, PixelCoordinate, PixelCoordinate] {
  if (side) {
    return [[x, y], [x + 1, y], [x + 1, y + 1]];
  }
  return [[x, y], [x, y + 1], [x + 1, y + 1]];
}

export function getAdjacentTriangle(
  x: number,
  y: number,
  side: 0 | 1,
  direction: Direction
): TriangleCoordinate {
  if (side) {
    switch (direction) {
      case 'E':
        return [x + 1, y - 1, 0];
      case 'NW':
        return [x - 1, y - 1, 0];
      case 'SW':
        return [x + 1, y + 1, 0];
      case 'W':
      case '+Y':
      case '-X':
        return [x, y, 0];
      case 'NE':
      case 'N':
      case '-Y':
        return [x, y - 1, 0];
      case 'SE':
      case 'S':
      case '+X':
        return [x + 1, y, 0];

      default:
        throw new Error(`Unknown direction "${JSON.stringify(direction)}"`);
    }
  } else {
    switch (direction) {
      case 'W':
        return [x - 1, y + 1, 1];
      case 'NE':
        return [x - 1, y - 1, 1];
      case 'SE':
        return [x + 1, y + 1, 1];
      case 'E':
      case '-Y':
      case '+X':
        return [x, y, 1];
      case 'NW':
      case 'N':
      case '-X':
        return [x - 1, y, 1];
      case 'SW':
      case 'S':
      case '+Y':
        return [x, y + 1, 1];

      default:
        throw new Error(`Unknown direction "${JSON.stringify(direction)}"`);
    }
  }
}

export function getAdjacentPoint(
  x: number,
  y: number,
  direction: Direction
): PointCoordinate {
  switch (direction) {
    case 'N':
      return [x - 1, y - 1];
    case 'S':
      return [x + 1, y + 1];
    case 'NE':
      return [x, y - 1];
    case 'NW':
      return [x - 1, y];
    case 'SE':
      return [x + 1, y];
    case 'SW':
      return [x, y + 1];

    default:
      throw new Error(`Unknown direction "${JSON.stringify(direction)}"`);
  }
}

export function getTriangleAdjacentToPoint(
  x: number,
  y: number,
  direction: Direction
): TriangleCoordinate {
  switch (direction) {
    case 'W':
      return [x - 1, y, 1];
    case 'E':
      return [x, y - 1, 0];
    case 'NW':
      return [x - 1, y - 1, 0];
    case 'NE':
      return [x - 1, y - 1, 1];
    case 'SW':
      return [x, y, 0];
    case 'SE':
      return [x, y, 1];
    default:
      throw new Error(`Unknown direction "${JSON.stringify(direction)}"`);
  }
}

function setAttributes(
  element: Element,
  attributes: { [key: string]: string | number }
) {
  for (const name in attributes) {
    element.setAttribute(name, String(attributes[name]));
  }
}

(window as any).Point = Point;
(window as any).Triangle = Triangle;
