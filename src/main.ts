import { AudioManager } from './audio';
import { Renderer } from './renderer';

const canvas = document.getElementById("visualiser") as HTMLCanvasElement | null;
if (canvas === null) throw new Error("Could not find canvas element");

const gl = canvas.getContext("webgl");
if (gl === null) throw new Error("Could not get WebGL context");

gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(0.5, 0.5, 0.5, 1.0);
gl.enable(gl.DEPTH_TEST);
gl.clear(gl.COLOR_BUFFER_BIT);

const audioManager = new AudioManager();
const renderer = new Renderer(gl);

const draw = () => {
  const frequencyData = audioManager.getFrequencyData();
  renderer.render(frequencyData);
  requestAnimationFrame(draw);
}

document.getElementById('init')?.addEventListener('click', async () => {
  const audio = await audioManager.initialize();
  if (audio) {
    draw();
  }
});