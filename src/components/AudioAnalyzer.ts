export class AudioAnalyzer {
  private audioContext: AudioContext;
  private analyser: AnalyserNode;
  private dataArray: Uint8Array;
  private source: MediaStreamAudioSourceNode | null = null;

  constructor() {
    this.audioContext = new AudioContext();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 256;
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
  }

  async init() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.source = this.audioContext.createMediaStreamSource(stream);
      this.source.connect(this.analyser);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  }

  getAudioData() {
    this.analyser.getByteFrequencyData(this.dataArray);
    return this.dataArray;
  }

  getBeatIntensity() {
    const data = this.getAudioData();
    const bassRange = data.slice(0, 10);
    return Math.max(...bassRange) / 255; // Normalize to 0-1
  }

  cleanup() {
    if (this.source) {
      this.source.disconnect();
    }
    this.audioContext.close();
  }
}
