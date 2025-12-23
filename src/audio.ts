export class AudioManager {
  audioContext: AudioContext;
  analyser: AnalyserNode;
  dataArray: Uint8Array<ArrayBuffer>;
  isInitialized: boolean = false;

  constructor() {
    this.audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 2048;

    const bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(bufferLength);
  }

  async initialize(): Promise<MediaStream | undefined> {
    try {
      await this.audioContext.resume();
      let stream: MediaStream;

      try {
        stream = await navigator.mediaDevices.getDisplayMedia({
          audio: true,
        });
      } catch (err) {
        console.warn(
          "System audio capture failed or not supported, falling back to microphone:",
          err,
        );
        stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
      }

      const source = this.audioContext.createMediaStreamSource(stream);
      source.connect(this.analyser);
      this.isInitialized = true;
      return stream;
    } catch (err) {
      console.error("Error capturing audio:", err);
      return undefined;
    }
  }

  getFrequencyData(): Uint8Array {
    if (!this.isInitialized) {
      return new Uint8Array(this.analyser.frequencyBinCount);
    }
    this.analyser.getByteFrequencyData(this.dataArray);
    return this.dataArray;
  }
}
