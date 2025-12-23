import { AudioManager } from "./audio";
import { ButterchurnManager } from "./butterchurn";

export class Controls {
  private audioManager: AudioManager;
  private butterchurnManager: ButterchurnManager;
  private initButton: HTMLElement;
  private controlsContainer: HTMLElement;
  private prevButton: HTMLElement;
  private nextButton: HTMLElement;
  private presetNameElement: HTMLElement;
  private hideTimeout: number | undefined;

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
    this.presetNameElement = document.getElementById(
      "presetName",
    ) as HTMLElement;

    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.prevButton.addEventListener("click", () => {
      this.butterchurnManager.prevPreset();
      this.updatePresetName();
    });

    this.nextButton.addEventListener("click", () => {
      this.butterchurnManager.nextPreset();
      this.updatePresetName();
    });

    this.initButton.addEventListener("click", async () => {
      await this.initializeAudio();
    });
  }

  private updatePresetName() {
    this.presetNameElement.innerText =
      this.butterchurnManager.getCurrentPresetName();
  }

  private async initializeAudio() {
    const stream = await this.audioManager.initialize();
    if (stream && stream.active) {
      this.butterchurnManager.connectAudio(this.audioManager.analyser);
      this.butterchurnManager.loadPreset(0);
      this.updatePresetName();

      stream.addEventListener("inactive", () => {
        this.butterchurnManager.loadBlankPreset();
        if (this.initButton) this.initButton.style.display = "block";
        if (this.controlsContainer)
          this.controlsContainer.style.display = "none";

        window.removeEventListener("mousemove", this.handleMouseMove);
        if (this.hideTimeout) clearTimeout(this.hideTimeout);
        document.body.style.cursor = "default";
      });

      this.initButton.style.display = "none";
      this.controlsContainer.style.display = "flex";

      this.resetHideTimeout();
      window.addEventListener("mousemove", this.handleMouseMove);
    }
  }

  private handleMouseMove = () => {
    this.resetHideTimeout();
  };

  private resetHideTimeout() {
    if (this.controlsContainer) {
      this.controlsContainer.style.opacity = "1";
      document.body.style.cursor = "default";
      if (this.hideTimeout) clearTimeout(this.hideTimeout);
      this.hideTimeout = window.setTimeout(() => {
        this.controlsContainer.style.opacity = "0";
        document.body.style.cursor = "none";
      }, 2000);
    }
  }
}
