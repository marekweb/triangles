import { Grid } from './grid';
import cubePipes from './cube-pipes';
import mandalaDemo from './rings-demo';
import hexDemo from './hex-demo';

const demoName = 'hex' as string;

const root = document.getElementById('root');
if (root) {
  const grid = new Grid(root, window.innerWidth, window.innerHeight, 40);

  switch (demoName) {
    case 'pipes':
      cubePipes(grid);
      break;

    case 'mandala':
      mandalaDemo(grid);
      break;

    case 'hex':
      hexDemo(grid);
      break;
  }
} else {
  console.log('Did not find #root element');
}
