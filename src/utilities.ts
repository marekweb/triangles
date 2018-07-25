export function getTrianglePoints(
  x: number,
  y: number,
  side: number
): [PixelCoordinate, PixelCoordinate, PixelCoordinate] {
  // [top, side, bottom]
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
  direction: Direction,
  n: number = 1
): PointCoordinate {
  switch (direction) {
    case 'N':
      return [x - n, y - n];
    case 'S':
      return [x + n, y + n];
    case 'NE':
      return [x, y - n];
    case 'NW':
      return [x - n, y];
    case 'SE':
      return [x + n, y];
    case 'SW':
      return [x, y + n];
    case 'NNW':
      return [x - 2 * n, y - n];
    case 'NNE':
      return [x - n, y - 2 * n];
    case 'W':
      return [x - n, y + n];
    case 'E':
      return [x + n, y - n];
    case 'SSW':
      return [x + n, y + 2 * n];
    case 'SSE':
      return [x + 2 * n, y + n];

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

export function setAttributes(
  element: Element,
  attributes: { [key: string]: string | number }
) {
  for (const name in attributes) {
    element.setAttribute(name, String(attributes[name]));
  }
}

export function getTrianglePointInDirection(
  x: number,
  y: number,
  side: 0 | 1,
  direction: Direction
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
