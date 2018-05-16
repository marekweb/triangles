import { Grid } from './grid.js';

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
    document.body.requestFullscreen();
  }
}
