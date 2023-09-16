import { canvas, ctx } from "utils/elements";

// This function maps a linear index to a logarithmic scale
function getLogIndex(i: number, numBars: number, bufferLength: number): number {
  const frequencyRatio = i / numBars;
  return Math.floor(Math.pow(frequencyRatio, 2) * bufferLength);
}

export class MusicVisualizer {
  private audioContext: AudioContext | undefined;

  public getAudioContext = () => this.audioContext;

  private setAudioContext = (audioContext: AudioContext) => (this.audioContext = audioContext);

  private analyser!: AnalyserNode;

  public getAnalyser = () => this.analyser;

  private setAnalyser = (analyser: AnalyserNode) => (this.analyser = analyser);

  private bufferLength!: number;

  public getBufferLength = () => this.bufferLength;

  private setBufferLength = (bufferLength: number) => (this.bufferLength = bufferLength);

  private dataArray!: Uint8Array;

  public getDataArray = () => this.dataArray;

  private setDataArray = (dataArray: Uint8Array) => (this.dataArray = dataArray);

  constructor() {}

  private draw = () => {
    requestAnimationFrame(this.draw);

    this.getAnalyser().getByteFrequencyData(this.getDataArray());

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // const barWidth = (canvas.width / this.getBufferLength()) * 2.5;

    // Limiting the number of bars to half the canvas width or buffer length, whichever is smaller
    const numBars = Math.min(canvas.width / 2, this.getBufferLength());
    const barWidth = canvas.width / numBars;

    for (let i = 0; i < numBars; i++) {
      const dataIndex = getLogIndex(i, numBars, this.getBufferLength());
      const barHeight = this.getDataArray()[dataIndex];

      ctx.fillStyle = "white";
      ctx.fillRect(i * barWidth, canvas.height - barHeight / 2, barWidth, barHeight / 2);
    }
  };

  protected setupAudio = async (src: string) => {
    const audioContext = new AudioContext();
    this.setAudioContext(audioContext);

    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    this.setAnalyser(analyser);

    const bufferLength = analyser.frequencyBinCount;
    this.setBufferLength(bufferLength);

    const dataArray = new Uint8Array(bufferLength);
    this.setDataArray(dataArray);

    const response = await fetch(src);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.getAnalyser());

    this.getAnalyser().connect(audioContext.destination);

    source.start();

    this.draw();
  };
}
