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

  private animate = () => {
    this.getAnalyser().getByteFrequencyData(this.getDataArray());

    ctx.fillStyle = "black";
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.draw();

    requestAnimationFrame(this.animate);
  };

  private draw = () => {
    const barWidth: number = canvas.width / this.getBufferLength() / 2;

    let pos: number = 0;
    for (let i = 0; i < this.getBufferLength(); i++) {
      const barHeight: number = this.getDataArray()[i];

      const red = (i * barHeight) / 10;
      const green = i * 4;
      const blue = barHeight / 4 - 12;
      ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
      ctx.fillRect(canvas.width / 2 - pos, canvas.height - barHeight, barWidth, barHeight);
      pos += barWidth;
    }

    for (let i = 0; i < this.getBufferLength(); i++) {
      const barHeight: number = this.getDataArray()[i];

      const red = (i * barHeight) / 10;
      const green = i * 4;
      const blue = barHeight / 4 - 12;
      ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
      ctx.fillRect(pos, canvas.height - barHeight, barWidth, barHeight);
      pos += barWidth;
    }
  };

  protected setupAudio = async (src: string) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const audioContext = new AudioContext();
    this.setAudioContext(audioContext);

    const analyser = audioContext.createAnalyser();
    // analyser.fftSize = 256;
    analyser.fftSize = 128;
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

    this.animate();
  };
}
