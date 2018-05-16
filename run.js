import { MyDemo } from './my-demo.js';

const root = document.getElementById('root');
const t = new MyDemo(root, window.innerWidth, window.innerHeight, 90);
t.render();
