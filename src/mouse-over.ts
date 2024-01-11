import { Triangle } from './triangle';
import { Grid } from './grid';

export default async function mouseOver(grid: Grid) {
  let activeTriangle: Triangle | null = null;

  window.document.addEventListener('mousemove', (e: MouseEvent) => {
    const triangleCoord = grid.unconvertGridCoordinatesToTriangle(
      e.clientX,
      e.clientY,
    );
    console.log(triangleCoord);
    const triangle = grid.getTriangleReference(
      triangleCoord.x,
      triangleCoord.y,
      triangleCoord.z,
    );
    if (triangle === activeTriangle) {
      return;
    }
    if (activeTriangle) {
      activeTriangle.setFill('transparent');
    }
    activeTriangle = triangle;
    activeTriangle.setFill('red');
    // console.log({triangleCoord});
  });
}
