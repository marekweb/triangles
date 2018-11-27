///<reference path="types.d.ts"/>
import { Triangle } from './triangle';
import { Point } from './point';
import { getTrianglePoints, setAttributes } from './utilities';

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
  private triangleReferences = new Map<string, Triangle>();
  private pointReferences = new Map<string, Point>();

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
    // triangleElement.style.stroke = 'black';
    // triangleElement.style.strokeWidth = '1';
    triangleElement.style.strokeLinejoin = 'round';
    this.svg.appendChild(triangleElement);
    return triangleElement;
  }

  getTriangleElement(x: number, y: number, side: number): SVGElement {
    const key = `${x},${y},${side}`;
    let triangleElement = this.triangleElements.get(key);
    if (!triangleElement) {
      triangleElement = this.createTriangleElement(x, y, side);
      this.triangleElements.set(key, triangleElement);
    }
    return triangleElement;
  }

  getTriangleReference(x: number, y: number, side: 0 | 1): Triangle {
    const key = `${x},${y},${side}`;
    let triangleReference = this.triangleReferences.get(key);
    if (!triangleReference) {
      triangleReference = new Triangle(this, x, y, side);
      this.triangleReferences.set(key, triangleReference);
    }
    return triangleReference;
  }

  getPointReference(p: PointCoordinate): Point {
    const { x, y } = p;
    const key = `${x},${y}`;
    let pointReference = this.pointReferences.get(key);
    if (!pointReference) {
      pointReference = new Point(this, x, y);
      this.pointReferences.set(key, pointReference);
    }
    return pointReference;
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

    return this.isCoordinateWithinScreen(center[0], center[1], margin);
  }
}
