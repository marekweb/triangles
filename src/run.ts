import { Grid } from './grid';
import cubePipes from './cube-pipes';
import ringsDemo from './rings-demo';
import mandalaDemo from './mandala-demo';
import hexDemo from './hex-demo';
import mouseOver from './mouse-over';

const demoName = window.location.hash.slice(1);

const root = document.getElementById('root');
if (root) {
  switch (demoName) {
    case 'mouse':
      run(mouseOver);
      break;

    case 'pipes':
      run(cubePipes);
      break;

    case 'rings':
      run(ringsDemo);
      break;

    case 'hex':
      run(hexDemo);
      break;

    default:
    case 'mandala':
      run(mandalaDemo);
      break;
  }
} else {
  console.log('Did not find #root element');
}

export default function run(f: (grid: Grid) => Promise<void>) {
  const root = document.getElementById('root');
  if (root) {
    const grid = new Grid(root, window.innerWidth, window.innerHeight, 40);
    f(grid).catch(err => console.error(err));
  } else {
    console.log('Did not find #root element');
  }
}
