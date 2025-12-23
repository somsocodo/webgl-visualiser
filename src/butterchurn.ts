import butterchurn from "butterchurn";
import butterchurnPresets from "butterchurn-presets";

export class ButterchurnManager {
  private visualizer: any;
  private presets: any;
  private presetKeys: string[];
  private currentPresetIndex: number = 0;

  constructor(audioContext: AudioContext, canvas: HTMLCanvasElement) {
    this.visualizer = butterchurn.createVisualizer(audioContext, canvas, {
      width: canvas.width,
      height: canvas.height,
    });
    this.presets = butterchurnPresets.getPresets();
    this.presetKeys = Object.keys(this.presets);
    this.loadBlankPreset();
  }

  connectAudio(node: AudioNode) {
    this.visualizer.connectAudio(node);
  }

  loadBlankPreset() {
    this.visualizer.loadPreset(this.visualizer.renderer.blankPreset, 1);
  }

  loadPreset(index: number) {
    const presetName = this.presetKeys[index];
    const preset = this.presets[presetName];
    this.visualizer.loadPreset(preset, 1);
  }

  nextPreset() {
    this.currentPresetIndex =
      (this.currentPresetIndex + 1) % this.presetKeys.length;
    this.loadPreset(this.currentPresetIndex);
  }

  prevPreset() {
    this.currentPresetIndex =
      (this.currentPresetIndex - 1 + this.presetKeys.length) %
      this.presetKeys.length;
    this.loadPreset(this.currentPresetIndex);
  }

  resize(width: number, height: number) {
    this.visualizer.setRendererSize(width, height);
  }

  render() {
    this.visualizer.render();
  }
}
