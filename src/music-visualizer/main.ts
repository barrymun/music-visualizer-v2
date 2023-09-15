import { canvas, ctx } from "utils/elements";

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

    const barWidth = (canvas.width / this.getBufferLength()) * 2.5;
    let barHeight;
    let x = 0;

    for (let i = 0; i < this.getBufferLength(); i++) {
      barHeight = this.getDataArray()[i];

      ctx.fillStyle = "white";
      ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);

      x += barWidth + 1;
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
