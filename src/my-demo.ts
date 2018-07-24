import {
  Grid,
  getAdjacentPoint,
  getAdjacentTriangle,
  getTriangleAdjacentToPoint
} from './grid';

function generateLotsOfTriangles(n: number): TriangleCoordinate[] {
  const list: TriangleCoordinate[] = [];
  for (let x = -n; x < n; x++) {
    for (let y = -n; y < n; y++) {
      list.push([x, y, 0]);
      list.push([x, y, 1]);
    }
  }
  return list;
}

export class MyDemo extends Grid {
  render() {
    let point: PointCoordinate = [0, 0];
    // TODO rest args when using TS 3.0
    this.getPointElement(point[0], point[1]).style.fill = 'red';

    function drawRing(grid: Grid, center: PointCoordinate, size: number, color: string = 'orange') {
      let point: PointCoordinate = center;
      const side = 1 + size * 2;
      for (let i = 0; i < size; i++) {
        point = getAdjacentPoint(point[0], point[1], 'N');
      }


      const ptEl = grid.getPointElement(...point);
      ptEl.style.fill = 'red';

      // --
    let tri: TriangleCoordinate = getTriangleAdjacentToPoint(point[0], point[1], 'NE');
      grid.getTriangleElement(...tri).style.fill = color;
      for (let i = 0; i < side; i++) {
        tri = getAdjacentTriangle(tri[0], tri[1], tri[2], '+X');
        grid.getTriangleElement(...tri).style.fill = color;
      }

      for (let i = 0; i < side; i++) {
        tri = getAdjacentTriangle(tri[0], tri[1], tri[2], 'S');
        grid.getTriangleElement(...tri).style.fill = color;
      }

      for (let i = 0; i < side; i++) {
        tri = getAdjacentTriangle(tri[0], tri[1], tri[2], '+Y');
        grid.getTriangleElement(...tri).style.fill = color;
      }

      for (let i = 0; i < side; i++) {
        tri = getAdjacentTriangle(tri[0], tri[1], tri[2], '-X');
        grid.getTriangleElement(...tri).style.fill = color;
      }

      for (let i = 0; i < side; i++) {
        tri = getAdjacentTriangle(tri[0], tri[1], tri[2], 'N');
        grid.getTriangleElement(...tri).style.fill = color;
      }

      for (let i = 0; i < side - 1; i++) {
        tri = getAdjacentTriangle(tri[0], tri[1], tri[2], '-Y');
        grid.getTriangleElement(...tri).style.fill = color;
      }
    }

    function drawCube(grid: Grid, center: PointCoordinate) {
      let tri = getTriangleAdjacentToPoint(center[0], center[1], 'NW');
      grid.getTriangleElement(...tri).style.fill = '#a0a0a0';
      tri = getTriangleAdjacentToPoint(center[0], center[1], 'NE');
      grid.getTriangleElement(...tri).style.fill = '#a0a0a0';

      tri = getTriangleAdjacentToPoint(center[0], center[1], 'E');
      grid.getTriangleElement(...tri).style.fill = '#b0b0b0';
      tri = getTriangleAdjacentToPoint(center[0], center[1], 'SE');
      grid.getTriangleElement(...tri).style.fill = '#b0b0b0';

      tri = getTriangleAdjacentToPoint(center[0], center[1], 'W');
      grid.getTriangleElement(...tri).style.fill = '#c0c0c0';
      tri = getTriangleAdjacentToPoint(center[0], center[1], 'SW');
      grid.getTriangleElement(...tri).style.fill = '#c0c0c0';

    }

    for (let i = 1; i < 8; i++) {
      drawRing(this, [0, 0], i, `hsl(90, 50%, ${60 - i * 5}%)`);
    }

    drawCube(this, [0, 0]);

    return;
    const triangleCoords = generateLotsOfTriangles(5);

    const triangleElements = triangleCoords.map(t =>
      this.createTriangleElement(...t)
    );

    setInterval(() => {
      const t =
        triangleElements[Math.floor(Math.random() * triangleElements.length)];
      const flip = Math.floor(Math.random() * 3);

      switch (flip) {
        case 0:
          t.style.fill = 'transparent';
          break;

        case 1:
          t.style.fill = `hsl(${Math.random() * 60 + 160},50%,6%)`;
          break;

        case 2:
          t.style.fill = `hsl(${Math.random() * 60 + 160},50%,50%)`;
          break;
      }
    }, 100);
  }
}
