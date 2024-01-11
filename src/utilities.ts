export function getTrianglePoints(
  x: number,
  y: number,
  side: number,
): PixelCoordinateTriple {
  // [top, side, bottom]
  if (side) {
    return [
      { x, y },
      { x: x + 1, y },
      { x: x + 1, y: y + 1 },
    ];
  }
  return [
    { x, y },
    { x, y: y + 1 },
    { x: x + 1, y: y + 1 },
  ];
}

export function getAdjacentTriangle(
  x: number,
  y: number,
  side: 0 | 1,
  direction: Direction,
): TriangleCoordinate {
  if (side) {
    switch (direction) {
      case 'E':
        return { x: x + 1, y: y - 1, z: 0 };
      case 'NW':
        return { x: x - 1, y: y - 1, z: 0 };
      case 'SW':
        return { x: x + 1, y: y + 1, z: 0 };
      case 'W':
      case '+Y':
      case '-X':
        return { x, y, z: 0 };
      case 'NE':
      case 'N':
      case '-Y':
        return { x, y: y - 1, z: 0 };
      case 'SE':
      case 'S':
      case '+X':
        return { x: x + 1, y, z: 0 };

      default:
        throw new Error(`Unknown direction "${JSON.stringify(direction)}"`);
    }
  } else {
    switch (direction) {
      case 'W':
        return { x: x - 1, y: y + 1, z: 1 };
      case 'NE':
        return { x: x - 1, y: y - 1, z: 1 };
      case 'SE':
        return { x: x + 1, y: y + 1, z: 1 };
      case 'E':
      case '-Y':
      case '+X':
        return { x, y, z: 1 };
      case 'NW':
      case 'N':
      case '-X':
        return { x: x - 1, y, z: 1 };
      case 'SW':
      case 'S':
      case '+Y':
        return { x, y: y + 1, z: 1 };

      default:
        throw new Error(`Unknown direction "${JSON.stringify(direction)}"`);
    }
  }
}

export function getAdjacentPoint(
  x: number,
  y: number,
  direction: Direction,
  n: number = 1,
): PointCoordinate {
  switch (direction) {
    case 'N':
      return { x: x - n, y: y - n };
    case 'S':
      return { x: x + n, y: y + n };
    case 'NE':
      return { x, y: y - n };
    case 'NW':
      return { x: x - n, y };
    case 'SE':
      return { x: x + n, y };
    case 'SW':
      return { x, y: y + n };
    case 'NNW':
      return { x: x - 2 * n, y: y - n };
    case 'NNE':
      return { x: x - n, y: y - 2 * n };
    case 'W':
      return { x: x - n, y: y + n };
    case 'E':
      return { x: x + n, y: y - n };
    case 'SSW':
      return { x: x + n, y: y + 2 * n };
    case 'SSE':
      return { x: x + 2 * n, y: y + n };

    default:
      throw new Error(`Unknown direction "${JSON.stringify(direction)}"`);
  }
}

export function getTriangleAdjacentToPoint(
  x: number,
  y: number,
  direction: Direction,
): TriangleCoordinate {
  switch (direction) {
    case 'W':
      return { x: x - 1, y, z: 1 };
    case 'E':
      return { x, y: y - 1, z: 0 };
    case 'NW':
      return { x: x - 1, y: y - 1, z: 0 };
    case 'NE':
      return { x: x - 1, y: y - 1, z: 1 };
    case 'SW':
      return { x, y, z: 0 };
    case 'SE':
      return { x, y, z: 1 };
    default:
      throw new Error(`Unknown direction "${JSON.stringify(direction)}"`);
  }
}

export function setAttributes(
  element: Element,
  attributes: { [key: string]: string | number },
) {
  for (const name in attributes) {
    element.setAttribute(name, String(attributes[name]));
  }
}

export function getTrianglePointInDirection(
  x: number,
  y: number,
  side: 0 | 1,
  direction: Direction,
): PointCoordinate {
  // TODO: this could be optimized to avoid calculating all three points
  const points = getTrianglePoints(x, y, side);
  switch (direction) {
    case 'N':
      return points[0];

    case 'E':
    case 'W': // TODO add symbol for "side"?
      return points[1];

    case 'S':
      return points[2];

    default:
      throw new Error(`Unknown direction "${JSON.stringify(direction)}"`);
  }
}

export function scalePoints(
  points: PixelCoordinate[],
  factor: number,
  center: PixelCoordinate,
) {
  points = points.map(p => ({ x: p.x - center.x, y: p.y - center.y }));
  points = points.map(p => ({ x: (p.x *= factor), y: (p.y *= factor) }));
  return points.map(p => ({ x: p.x + center.x, y: p.y + center.y }));
}

export function getTriangleCenter(
  points: PixelCoordinateTriple,
): PixelCoordinate {
  const triangleCenterX = (points[0].x + points[1].x + points[2].x) / 3;
  const triangleCenterY = (points[0].y + points[1].y + points[2].y) / 3;

  return { x: triangleCenterX, y: triangleCenterY };
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
