import { AudioManager } from "./audio";
import { ButterchurnManager } from "./butterchurn";

export class Controls {
  private audioManager: AudioManager;
  private butterchurnManager: ButterchurnManager;
  private initButton: HTMLElement;
  private controlsContainer: HTMLElement;
  private prevButton: HTMLElement;
  private nextButton: HTMLElement;

  constructor(
    audioManager: AudioManager,
    butterchurnManager: ButterchurnManager,
  ) {
    this.audioManager = audioManager;
    this.butterchurnManager = butterchurnManager;

    this.initButton = document.getElementById("init") as HTMLElement;
    this.controlsContainer = document.getElementById("controls") as HTMLElement;
    this.prevButton = document.getElementById("prevPreset") as HTMLElement;
    this.nextButton = document.getElementById("nextPreset") as HTMLElement;

    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.prevButton.addEventListener("click", () => {
      this.butterchurnManager.prevPreset();
    });

    this.nextButton.addEventListener("click", () => {
      this.butterchurnManager.nextPreset();
    });

    this.initButton.addEventListener("click", async () => {
      await this.initializeAudio();
    });
  }

  private async initializeAudio() {
    const stream = await this.audioManager.initialize();
    if (stream && stream.active) {
      this.butterchurnManager.connectAudio(this.audioManager.analyser);
      this.butterchurnManager.loadPreset(0);

        stream.addEventListener("inactive", () => {
          this.butterchurnManager.loadBlankPreset();
          if (this.initButton) this.initButton.style.display = "block";
          if (this.controlsContainer)
            this.controlsContainer.style.display = "none";
        });

        this.initButton.style.display = "none";
        this.controlsContainer.style.display = "flex";
      }
    
  }
}
