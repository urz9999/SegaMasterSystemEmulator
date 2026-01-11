import './main.scss';
import Emulator from './Emulator';

window.onload = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 192;
  document.body.appendChild(canvas);
  const emulator = new Emulator(canvas);
  // Emulator is now ready to be extended for ROM loading, input, etc.
};
