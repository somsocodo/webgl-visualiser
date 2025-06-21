export class AudioManager {
  audioContext: AudioContext;
  analyser: AnalyserNode;
  dataArray: Uint8Array;
  isInitialized: boolean = false;

  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext);
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 2048;
    
    const bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(bufferLength);
  }

  async initialize(): Promise<boolean> {
    try {
      this.audioContext.resume()
      const stream = await navigator.mediaDevices.getDisplayMedia({ audio: true });
      const source = this.audioContext.createMediaStreamSource(stream);
      source.connect(this.analyser);
      this.isInitialized = true;
      return true;
    } catch (err) {
      console.error('Error capturing system audio:', err);
      return false;
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