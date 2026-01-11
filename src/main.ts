import './main.scss';

window.onload = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 192;
  document.body.appendChild(canvas);
  const gl = canvas.getContext('webgl');
  if (!gl) {
    alert('WebGL not supported');
    return;
  }
  // Placeholder for future emulator rendering logic
};
