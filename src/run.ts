import { Grid } from './grid';
import { cubesDemo } from './cubes-demo';

const root = document.getElementById('root');
if (root) {
  const grid = new Grid(root, window.innerWidth, window.innerHeight, 30);
  cubesDemo(grid).catch(err => {
    console.error(err);
  });
} else {
  console.log('Did not find #root element');
}
