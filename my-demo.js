import {
  Grid,
  getAdjacentPoint,
  getAdjacentTriangle,
  getTriangleAdjacentToPoint
} from './grid.js';

function generateLotsOfTriangles(n) {
  const list = [];
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
    let point = [0, 0];
    this.getPointElement(...point).style.fill = 'red';

    function drawRing(center, size, color = 'orange') {
      let point = center;
      const side = 1 + size * 2;
      for (let i = 0; i < size; i++) {
        point = getAdjacentPoint(...point, 'N');
      }

      const ptEl = this.getPointElement(...point);
      ptEl.style.fill = 'red';

      // --
      let tri = getTriangleAdjacentToPoint(...point, 'NE');
      this.getTriangleElement(...tri).style.fill = color;
      for (let i = 0; i < side; i++) {
        tri = getAdjacentTriangle(...tri, '+X');
        this.getTriangleElement(...tri).style.fill = color;
      }

      for (let i = 0; i < side; i++) {
        tri = getAdjacentTriangle(...tri, 'S');
        this.getTriangleElement(...tri).style.fill = color;
      }

      for (let i = 0; i < side; i++) {
        tri = getAdjacentTriangle(...tri, '+Y');
        this.getTriangleElement(...tri).style.fill = color;
      }

      for (let i = 0; i < side; i++) {
        tri = getAdjacentTriangle(...tri, '-X');
        this.getTriangleElement(...tri).style.fill = color;
      }

      for (let i = 0; i < side; i++) {
        tri = getAdjacentTriangle(...tri, 'N');
        this.getTriangleElement(...tri).style.fill = color;
      }

      for (let i = 0; i < side - 1; i++) {
        tri = getAdjacentTriangle(...tri, '-Y');
        this.getTriangleElement(...tri).style.fill = color;
      }
    }

    function drawCube(center) {
      let tri = getTriangleAdjacentToPoint(center, 'NW');

      this.getTriangleElement(...tri).fill = '#a0a0a0';

      tri = getAdjacentTriangle(...tri, 'E');
    }

    for (let i = 1; i < 8; i++) {
      drawRing.call(this, [0, 0], i, `hsl(90, 50%, ${60 - i * 5}%)`);
    }

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
