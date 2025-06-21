import { AudioManager } from "./audio";
import { Renderer } from "./renderer";

const canvas = document.getElementById(
  "visualiser",
) as HTMLCanvasElement | null;
if (canvas === null) throw new Error("Could not find canvas element");

const gl = canvas.getContext("webgl");
if (gl === null) throw new Error("Could not get WebGL context");

gl.clearColor(0.5, 0.5, 0.5, 1.0);
gl.enable(gl.DEPTH_TEST);

const resizeCanvas = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
};

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const audioManager = new AudioManager();
const renderer = new Renderer(gl);

const draw = () => {
  const frequencyData = audioManager.getFrequencyData();
  renderer.render(frequencyData);
  requestAnimationFrame(draw);
};

document.getElementById("init")?.addEventListener("click", async () => {
  const stream = await audioManager.initialize();
  if (stream) {
    const [track] = stream.getVideoTracks();
    const initButton = document.getElementById("init");

    if (initButton === null) throw new Error("Could not find init button");
    track.addEventListener("ended", () => {
      initButton.style.display = "block";
    });
    initButton.style.display = "none";

    draw();
  }
});
