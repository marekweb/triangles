const SQRT3 = Math.sqrt(3);

export class Grid {
  constructor(container, width, height, triangleAltitude) {
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

    this.svg.style.width = width + 'px';
    this.svg.style.height = height + 'px';
    this.svg.style.display = 'block';
    container.appendChild(this.svg);

    this.triangleElements = {};
  }

  convertGridCoordinates(x, y) {
    const pixelX = this.centerX + (x - y) * this.triangleAltitude;
    const pixelY = this.centerY + (x + y) * this.triangleHalfSide;
    return [Math.round(pixelX), Math.round(pixelY)];
  }

  unconvertGridCoordinatesToTriangle(Px, Py) {
    const [x, y] = this.unconvertGridCoordinates(Px, Py);
    const side = (x < 0 ? 1 - x % 1 : x % 1) > (y < 0 ? (1 - y) % 1 : y % 1);
    return [x, y, side];
  }

  unconvertGridCoordinates(Px, Py) {
    const Cx = this.centerX;
    const Cy = this.centerY;
    const H = this.triangleHalfSide;
    const A = this.triangleAltitude;
    const x = ((Px - Cx) / A + (Py - Cy) / H) / 2;
    const y = ((Py - Cy) / H - (Px - Cx) / A) / 2;
    return [x, y];
  }

  convertGridCoordinatesToPointString(points) {
    const pairs = points.map(([x, y]) =>
      this.convertGridCoordinates(x, y).join(',')
    );
    return pairs.join(' ');
  }

  createTriangleElement(x, y, side) {
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

  getTriangleElement(x, y, side) {
    const key = `${x},${y},${Number(side)}`;
    let triangleElement = this.triangleElements[key];
    if (!triangleElement) {
      triangleElement = this.triangleElements[key] = this.createTriangleElement(
        x,
        y,
        side
      );
    }
    console.log('triangle', key, triangleElement);
    return triangleElement;
  }

  createCoordinateMarker(cx, cy) {
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

  createPointElement(x, y) {
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

  getPointElement(x, y) {
    const key = `${x},${y}`;
    let pointElement = this.triangleElements[key];
    if (!pointElement) {
      pointElement = this.triangleElements[key] = this.createPointElement(x, y);
    }

    return pointElement;
  }

  setClassToPoint(x, y, cls) {
    const point = this.getPointElement(x, y);
    point.setAttribute('class', cls);
  }

  isCoordinateWithinScreen(x, y, margin = 0) {
    return !(
      x < 0 ||
      y < 0 ||
      x > this.width + margin ||
      y > this.height + margin
    );
  }

  getTriangleCenter(x, y, side) {
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

  isTriangleWithinScreen(x, y, side) {
    const center = this.getTriangleCenter(x, y, side);
    const margin = this.triangleAltitude * 2 / 3;
    return this.isCoordinateWithinScreen(...center, margin);
  }
}

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  getAdjacentPoint(direction) {
    return this.getAdjacentPoint(this.x, this.y, direction);
  }
  getTriangle() {}
}

class Triangle {
  constructor(grid, x, y, side) {
    this.grid = grid;
    this.x = x;
    this.y = y;
    this.side = side;
  }
  getCoordinates() {
    return [this.x, this.y, this.side];
  }
  getPixelCoordinates() {
    return this.grid.get;
  }
  getElement() {
    this.grid.getTriangleElement(this.x, this.y, this.side);
  }
  setFill(colorString) {
    this.getElement().style.fill = colorString;
  }
  getAdjacent(direction) {
    return getAdjacentTriangle(this.x, this.y, this.side, direction);
  }
}

function getTrianglePoints(x, y, side) {
  if (side) {
    return [[x, y], [x + 1, y], [x + 1, y + 1]];
  }
  return [[x, y], [x, y + 1], [x + 1, y + 1]];
}

function getAdjacentTriangle(x, y, side, direction) {
  if (side) {
    switch (direction) {
      case 'E':
        return [x + 1, y - 1, 0];
      case 'NW':
        return [x - 1, y - 1, 0];
      case 'SW':
        return [x + 1, y + 1, 0];
      case 'W':
        return [x, y, 0];
      case 'NE':
        return [x, y - 1, 0];
      case 'SE':
        return [x + 1, y, 0];
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
        return [x, y, 1];
      case 'NW':
        return [x - 1, y, 1];
      case 'SW':
        return [x, y + 1, 1];
    }
  }
}

function getAdjacentPoint(x, y, direction) {
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
  }
}

function getTriangleAdjacentToPoint(x, y, direction) {
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
      throw new Error(`Invalid direction ${direction}`);
  }
}

function setAttributes(element, attributes) {
  for (const name in attributes) {
    element.setAttribute(name, attributes[name]);
  }
}
