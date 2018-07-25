import { MyDemo } from './my-demo';

const root = document.getElementById('root');
if (root) {
  const t = new MyDemo(root, window.innerWidth, window.innerHeight, 30);
  t.render();
} else {
  console.log('Did not find #root element');
}
