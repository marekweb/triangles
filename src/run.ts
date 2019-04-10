import { Grid } from './grid';
import { cubePipes } from './cube-pipes';

const root = document.getElementById('root');
if (root) {
  const grid = new Grid(root, window.innerWidth, window.innerHeight, 40);
  cubePipes(grid).catch(err => {
    console.error(err);
  });
} else {
  console.log('Did not find #root element');
}
