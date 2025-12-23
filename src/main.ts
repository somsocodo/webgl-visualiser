import { AudioManager } from "./audio";
import { ButterchurnManager } from "./butterchurn";

const canvas = document.getElementById(
  "visualiser",
) as HTMLCanvasElement | null;
if (canvas === null) throw new Error("Could not find canvas element");

const audioManager = new AudioManager();
const butterchurnManager = new ButterchurnManager(
  audioManager.audioContext,
  canvas,
);

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

const prevButton = document.getElementById("prevPreset");
const nextButton = document.getElementById("nextPreset");

prevButton?.addEventListener("click", () => {
  butterchurnManager.prevPreset();
});

nextButton?.addEventListener("click", () => {
  butterchurnManager.nextPreset();
});

document.getElementById("init")?.addEventListener("click", async () => {
  const stream = await audioManager.initialize();
  if (stream && stream.active) {
    butterchurnManager.connectAudio(audioManager.analyser);
    butterchurnManager.loadPreset(0);

    const initButton = document.getElementById("init");
    const controls = document.getElementById("controls");

    if (initButton && controls) {
      stream.addEventListener("inactive", () => {
        butterchurnManager.loadBlankPreset();
        initButton.style.display = "block";
        if (controls) controls.style.display = "none";
      });

      initButton.style.display = "none";
      controls.style.display = "flex";
    }
  }
});

const draw = () => {
  butterchurnManager.render();
  requestAnimationFrame(draw);
};

draw();
