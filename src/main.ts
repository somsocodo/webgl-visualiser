import { AudioManager } from "./audio";
import { ButterchurnManager } from "./butterchurn";
import { Controls } from "./controls";

const canvas = document.getElementById("visualiser") as HTMLCanvasElement;

const audioManager = new AudioManager();
const butterchurnManager = new ButterchurnManager(
  audioManager.audioContext,
  canvas,
);

new Controls(audioManager, butterchurnManager);

const resizeCanvas = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const resizeVisualizer = () => {
  butterchurnManager.resize(canvas.width, canvas.height);
};
window.addEventListener("resize", resizeVisualizer);
resizeVisualizer();

const draw = () => {
  butterchurnManager.render();
  requestAnimationFrame(draw);
};

draw();
